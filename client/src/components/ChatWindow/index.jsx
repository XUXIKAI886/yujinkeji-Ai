import React, { useState, useEffect, useMemo } from 'react';
import { message, Upload } from 'antd';
import { 
    SendOutlined,
    LoadingOutlined,
    DeleteOutlined,
    UploadOutlined,
    FileTextOutlined,
    RobotOutlined,
    MessageOutlined,
    StarOutlined,
    MoneyCollectOutlined,
    PictureOutlined,
    EnvironmentOutlined,
    CloudOutlined
} from '@ant-design/icons';
import aiAssistantService from '../../services/aiAssistantService';
import chatHistoryService from '../../services/chatHistoryService';
import http from '../../utils/http';
import Message from './components/Message';
import Welcome from './components/Welcome';
import {
    ChatContainer,
    ChatHeader,
    HeaderTitle,
    HeaderDescription,
    HeaderPoints,
    MessageList,
    InputArea,
    InputWrapper,
    StyledInput,
    UploadWrapper,
    AnalyzeButton,
    FileList,
    ClearChatButton
} from './styles';
import html2pdf from 'html2pdf.js';
import turndownService from '../../utils/turndownService';

const ChatWindow = ({ selectedAssistant, updateUser }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [assistantInfo, setAssistantInfo] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [locationInfo, setLocationInfo] = useState({
        city: '',
        weather: '',
        loading: true
    });
    const [shopName, setShopName] = useState('');

    // 加载AI助手信息
    useEffect(() => {
        const fetchAssistantInfo = async () => {
            if (selectedAssistant?.key) {
                try {
                    const response = await aiAssistantService.getActiveAssistants();
                    if (response.success) {
                        const assistant = response.data.find(a => a.key === selectedAssistant.key);
                        if (assistant) {
                            setAssistantInfo(assistant);
                        }
                    }
                } catch (error) {
                    message.error('获取AI助手信息失败');
                }
            }
        };

        fetchAssistantInfo();
    }, [selectedAssistant?.key]);

    // 判断是否为DeepSeek模型
    const isDeepseekModel = useMemo(() => {
        return selectedAssistant?.config?.modelType === 'deepseek' || assistantInfo?.config?.modelType === 'deepseek';
    }, [selectedAssistant?.config?.modelType, assistantInfo?.config?.modelType]);

    // 获取助手的唯一标识符
    const getAssistantId = React.useCallback((assistant) => {
        if (!assistant) return null;
        return assistant.key || assistant._id;
    }, []);

    // 获取IP地址和位置信息
    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                // 使用 ip.useragentinfo.com 获取位置信息
                const locationResponse = await fetch('https://ip.useragentinfo.com/json');
                const locationData = await locationResponse.json();
                
                if (locationData.city) {
                    try {
                        // 使用 WeatherAPI 获取天气信息
                        const weatherResponse = await fetch(
                            `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${encodeURIComponent(locationData.city)}&lang=zh`
                        );
                        const weatherData = await weatherResponse.json();
                        
                        if (weatherData.current) {
                            setLocationInfo({
                                city: locationData.city,
                                weather: `${weatherData.current.temp_c}°C ${weatherData.current.condition.text}`,
                                loading: false,
                            });
                        } else {
                            setLocationInfo({
                                city: locationData.city,
                                weather: '暂无天气数据',
                                loading: false,
                            });
                        }
                    } catch (weatherError) {
                        setLocationInfo({
                            city: locationData.city,
                            weather: '暂无天气数据',
                            loading: false,
                        });
                    }
                } else {
                    throw new Error('获取位置信息失败');
                }
            } catch (error) {
                setLocationInfo({
                    city: '未知城市',
                    weather: '暂无天气数据',
                    loading: false,
                });
            }
        };

        fetchLocationAndWeather();
    }, []);

    // 移除初始调试日志
    useEffect(() => {
        // 仅保留必要的初始化逻辑
    }, [selectedAssistant]);

    // 加载聊天历史
    useEffect(() => {
        const assistantId = getAssistantId(selectedAssistant);
        
        // 无论是否有历史记录，都先清空当前消息列表
        setMessages([]);
        
        if (assistantId) {
            if (selectedAssistant?.name === '美团全能客服助手') {
                // 美团客服助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用美团全能客服助手！👋

我可以帮您解答各类商家咨询和投诉问题。您可以：

1️⃣ 直接询问"单量为什么这么差"
2️⃣ 咨询"到底什么时候能看到效果"
3️⃣ 或者直接复制商家发送的消息，我会给您最专业的解答

让我们开始吧！`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '美团品牌定位设计') {
                // 品牌定位设计助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用品牌定位设计助手！🎨

我是您的品牌战略专家，让我们开始打造您的品牌价值！

请按以下格式提供您的店铺信息：

📝 基础信息模板：
━━━━━━━━━━━━━━━━
店铺名称：[您的店铺名称]
经营品类：[主营类目 > 子类目 > 具体品类]
━━━━━━━━━━━━━━━━

示例：
店铺名称：江南小馆
经营品类：美食 > 正餐 > 江浙菜

发送店铺信息后，我会为您：
1️⃣ 分析品牌定位和市场机会
2️⃣ 设计品牌形象和视觉识别
3️⃣ 制定营销策略和推广方案
4️⃣ 优化品牌传播和用户体验

请复制上方模板，填写您的店铺信息，让我们开始吧！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '美团分类栏描述') {
                // 分类栏描述助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用分类栏描述优化助手！📋

我可以帮您优化店铺分类结构，提升用户体验和转化率。

请按以下格式提供您的分类信息：

📝 分类列表模板：
━━━━━━━━━━━━━━━━
[主打分类]
[套餐分类]
[主食分类]
[优惠专区]
[加料专区]
[荤菜分类]
[素菜分类]
[饮品分类]
[小吃分类]
━━━━━━━━━━━━━━━━

示例分类结构：
🔸 特色卤粉
🔸 人气套餐 
🔸 卤汁拌饭 
🔸 优惠套餐
🔸 加量区
🔸 热卤荤菜
🔸 热卤素菜
🔸 清凉饮料
🔸 美味小吃

发送分类信息后，我会为您：
1️⃣ 优化分类顺序和层级
2️⃣ 提供吸引人的分类名称建议
3️⃣ 分析竞品分类优势
4️⃣ 给出提升转化的分类策略

请复制上方模板，填写您的分类信息，让我们开始优化吧！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖套餐搭配助手') {
                // 套餐搭配助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖套餐搭配助手！🍜

我是您的套餐优化专家，帮您设计最优套餐组合，提升客单价和用户满意度！

请按以下格式提供您的菜品信息：

📝 菜品价格表模板：
━━━━━━━━━━━━━━━━
【主食类】
[菜品名称1]    [价格]
[菜品名称2]    [价格]
[菜品名称3]    [价格]

【配菜类】
[菜品名称1]    [价格]
[菜品名称2]    [价格]
[菜品名称3]    [价格]
━━━━━━━━━━━━━━━━

示例菜品结构：
【主食类】
🔸 特色大肉粉    ¥17.88
🔸 猪脚粉        ¥20.88
🔸 软哨粉        ¥16.88
🔸 辣鸡粉        ¥16.88
🔸 招牌肠旺粉    ¥16.88

【配菜类】
🔸 卤蛋          ¥3.00
🔸 豆腐          ¥4.00
🔸 血旺          ¥4.00
🔸 辣鸡          ¥8.00

发送菜品信息后，我会为您：
1️⃣ 设计最优套餐组合方案
2️⃣ 分析价格区间合理性
3️⃣ 推荐高毛利搭配组合
4️⃣ 提供促销策略建议

请复制上方模板，填写您的菜品信息，让我们开始优化套餐搭配吧！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '美团评价解释助手') {
                // 评价解释助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用美团评价解释助手！⭐

我是您的评价分析专家，帮您深入解读评价内容，提供专业的应对建议！

请按以下格式提供评价内容：

📝 评价内容模板：
━━━━━━━━━━━━━━━━
【好评内容】
[请粘贴好评内容...]

【差评内容】
[请粘贴差评内容...]
━━━━━━━━━━━━━━━━

发送评价内容后，我会为您：
1️⃣ 分析评价关键词和情感倾向
2️⃣ 识别用户核心诉求和痛点
3️⃣ 提供专业的回复建议
4️⃣ 给出针对性的改进方案

💡 小贴士：
• 可以一次发送多条评价
• 建议包含完整的评价描述
• 如有图片评价可以描述图片内容

请复制上方模板，填写评价内容，让我来帮您分析和解决评价问题！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '补单专用外卖好评') {
                // 好评生成助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖好评生成助手！⭐

我是您的好评创作专家，帮您生成真实自然的用户好评！

📝 使用说明：
━━━━━━━━━━━━━━━━
请按以下格式提供需求：
【店铺类型】[餐饮类型，如：麻辣烫/火锅/炸鸡等]
【需求数量】[需要生成的好评数量]
【特色亮点】[店铺特色，如：招牌菜品/服务特点等]
━━━━━━━━━━━━━━━━

示例请求：
🔸 请帮我写3个关于麻辣烫店铺的好评
🔸 特色：食材新鲜，汤底鲜美，服务热情

发送需求后，我会为您：
1️⃣ 生成多样化的好评内容
2️⃣ 突出店铺特色和亮点
3️⃣ 融入真实的用户体验
4️⃣ 添加细节丰富的描述

💡 小贴士：
• 提供店铺特色可以让好评更有针对性
• 好评会包含多个角度的描述
• 语言风格自然真实，符合用户习惯

请告诉我您的需求，让我来帮您生成优质好评！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '美团店铺分解析') {
                // 店铺分解析助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用美团店铺分解析助手！📊

我是您的店铺数据分析专家，帮您深入解读店铺评分，提供专业的优化建议！

📝 数据获取指南：
━━━━━━━━━━━━━━━━
1. 登录美团商家版后台
2. 找到"店铺分"板块
3. 复制完整的数据内容
━━━━━━━━━━━━━━━━

发送数据后，我会为您：
1️⃣ 解析各项评分指标
2️⃣ 识别影响分数的关键因素
3️⃣ 对比行业平均水平
4️⃣ 提供针对性的提升建议

💡 小贴士：
• 确保复制完整的店铺分数据
• 包含所有评分维度信息
• 建议定期分析，追踪改进效果

请将店铺分数据粘贴发送给我，让我来帮您分析提升空间！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '美团关键词优化助手') {
                // 关键词优化助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用美团关键词优化助手！🔍

我是您的商品标题优化专家，帮您提升商品搜索排名和曝光度！

📝 数据获取指南：
━━━━━━━━━━━━━━━━
1. 登录美团外卖商家版
2. 进入"商品列表"页面
3. 点击"下载商品"
4. 复制所有商品名称
━━━━━━━━━━━━━━━━

示例商品列表：
🔸 酸辣粉
🔸 猪肉大葱饺子
🔸 凉面
🔸 麻辣牛肉拌饭
🔸 鱿鱼煲仔饭

发送商品列表后，我会为您：
1️⃣ 优化商品标题关键词
2️⃣ 调整词序提升曝光度
3️⃣ 加入高频搜索词
4️⃣ 提供长尾词建议

💡 小贴士：
• 建议一次不超过50个商品名称
• 相似品类商品可以一起优化
• 新品上架时及时进行关键词优化

请将您的商品名称列表粘贴发送给我，让我来帮您提升搜索排名！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖数据周报分析') {
                // 数据周报分析助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖数据周报分析助手！📈

我是您的数据分析专家，帮您深入解读运营数据，发现增长机会！

📝 数据模板格式：
━━━━━━━━━━━━━━━━
统计周期：[起始日期] 至 [结束日期]
店铺名称：[您的店铺名称]

📊 核心指标：
• 店铺营业额：[金额]元
• 实付单均价：[金额]元
• 曝光人数：[数量]人
• 入店人数：[数量]人
• 下单人数：[数量]人
• 入店转化率：[百分比]
• 下单转化率：[百分比]
━━━━━━━━━━━━━━━━

示例数据：
📅 2024-12-11 至 2024-12-17
🏪 老王烤肉店

🔸 店铺营业额：671元
🔸 实付单均价：22.55元
🔸 曝光人数：4,832人
🔸 入店人数：353人
🔸 下单人数：25人
🔸 入店转化率：7.31%
🔸 下单转化率：7.08%

发送数据后，我会为您：
1️⃣ 分析各项指标表现
2️⃣ 对比历史数据趋势
3️⃣ 诊断转化率瓶颈
4️⃣ 提供提升建议方案

💡 小贴士：
• 建议每周固定时间分析数据
• 确保数据完整且准确
• 可以添加其他补充数据说明

请将您的周报数据粘贴发送给我，让我来帮您分析经营状况！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖菜品描述（excel导入）') {
                // 菜品描述助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖菜品描述优化助手！📝

我是您的菜品文案优化专家，帮您打造吸引顾客的商品描述！

📥 数据准备步骤：
━━━━━━━━━━━━━━━━
1. 登录美团外卖商家版
2. 进入"商品列表"页面
3. 点击"下载商品"
4. 将商品名称复制到新的Excel文件
5. 保存Excel文件（支持.xlsx格式）
━━━━━━━━━━━━━━━━

📊 Excel格式要求：
• 第一列为商品名称
• 每行一个商品
• 最多支持50个商品
• 无需表头，直接填写商品名称

🍲 示例商品：
🔸 酸辣粉【🌶️酸辣过瘾】
🔸 猪肉大葱饺子【🥟饺子鲜香】
🔸 凉面【🍜凉面爽口】
🔸 麻辣牛肉拌饭【🥩拌饭麻辣】
🔸 鱿鱼煲仔饭【🦑饭香鱿鱼】

上传Excel后，我会为您：
1️⃣ 批量优化商品描述文案
2️⃣ 添加吸引人的特色标签
3️⃣ 突出商品卖点和特色
4️⃣ 融入适合的表情符号

💡 小贴士：
• 建议按品类分批整理Excel
• 一次最多处理50个商品
• 确保Excel中只包含商品名称
• 描述会保持简洁有吸引力

请上传您的Excel文件，让我来帮您优化商品描述！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '顶级思维梳理') {
                // 顶级思维梳理助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用顶级思维梳理助手！🌟

我是您的专业思维导师，擅长帮您梳理思路、分析问题、优化决策！

🎯 我可以帮您：
━━━━━━━━━━━━━━━━
1. 分析复杂问题，理清关键要素
2. 提供多角度思考，拓展思维维度
3. 优化决策方案，降低决策风险
4. 构建系统思维，提升分析能力
━━━━━━━━━━━━━━━━

💡 使用场景：
• 经营策略分析
• 运营方案制定
• 竞争策略规划
• 品牌定位思考
• 产品创新设计
• 团队管理优化

🔍 工作方法：
1️⃣ 系统性分析：从多个维度全面审视问题
2️⃣ 结构化思考：将复杂问题拆解为可执行单元
3️⃣ 创新性建议：提供独特视角和创新方案
4️⃣ 实践性指导：确保建议可落地可执行

📈 使用建议：
• 清晰描述您的问题或需求
• 提供必要的背景信息
• 说明您的目标和期望
• 分享已有的思考和尝试

让我们开始思维之旅，一起探索最优解决方案！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖店铺活动分析') {
                // 活动分析助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖店铺活动分析助手！🎯

我是您的活动策略分析专家，帮您优化活动效果，提升转化率！

📥 数据获取步骤：
━━━━━━━━━━━━━━━━
1. 登录美团外卖商家版
2. 进入"活动中心"
3. 点击"我的活动"
4. 复制所有活动数据
━━━━━━━━━━━━━━━━

📊 活动数据示例：
【满减活动】
• 满35减1 | 满55减3 | 满88减6  ↑9

【优惠券活动】
• 集3单返3元优惠券  0

【配送费活动】
• 配送费立减4元  ↑44

【邀评发券】
• 满50减5  -

【折扣商品】
• 收藏点亮/★送牛肉一片
• 仅限一份 - 1人份
• 商品0.1元售卖  ↓20

发送活动数据后，我会为您：
1️⃣ 分析各项活动效果
2️⃣ 评估活动投产比
3️⃣ 对比同行活动策略
4️⃣ 提供优化建议方案

💡 小贴士：
• 请提供完整的活动数据
• 包含活动效果指标（↑↓）
• 建议定期分析活动效果
• 可补充说明活动目标

请复制您的活动数据发送给我，让我来帮您分析活动效果！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '图片识别助手') {
                // 图片识别助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用图片识别助手！📸

我是您的图片文字提取专家，帮您快速获取图片中的文字内容！

📥 支持的图片类型：
━━━━━━━━━━━━━━━━
• 外卖订单截图
• 商品详情截图
• 评价内容截图
• 活动数据截图
• 后台数据截图
━━━━━━━━━━━━━━━━

发送图片后，我会为您：
1️⃣ 精准识别图片文字
2️⃣ 智能排版提取内容
3️⃣ 保持原始格式结构
4️⃣ 输出可复制文本

💡 小贴士：
• 图片要清晰完整
• 避免图片倾斜变形
• 支持批量识别图片
• 建议避免截图重叠

请直接发送您的截图，让我来帮您提取文字内容！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖菜品图生成') {
                // 菜品图生成助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖菜品图生成助手！🎨

我是您的美食图片生成专家，帮您创作精美的菜品展示图！

📝 描述建议格式：
━━━━━━━━━━━━━━━━
• 菜品名称：[具体名称]
• 主要食材：[食材列表]
• 烹饪方式：[具体做法]
• 摆盘风格：[期望效果]
• 特殊要求：[其他细节]
━━━━━━━━━━━━━━━━

🍜 示例描述：
"红烧牛肉面，使用上等牛腩肉，红汤浓郁，配以青菜点缀，面条筋道，碗中摆放整齐，特写拍摄角度，光线明亮自然"

发送描述后，我会为您：
1️⃣ 生成高清菜品图片
2️⃣ 确保画面真实诱人
3️⃣ 突出菜品特色卖点
4️⃣ 符合外卖展示需求

💡 小贴士：
• 描述越详细，效果越好
• 可以参考竞品图片风格
• 建议说明拍摄角度要求
• 可以指定特定的场景

请告诉我您想要生成的菜品描述，让我来为您创作美食图片！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '抖音文案提取') {
                // 抖音文案提取助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用抖音文案提取助手！📱

我是您的抖音内容提取专家，帮您快速获取视频文案！

📥 支持的链接格式：
━━━━━━━━━━━━━━━━
• 抖音APP分享链接
• 抖音网页版链接
• 抖音短链接
━━━━━━━━━━━━━━━━

🔗 链接示例：
https://v.douyin.com/iyKvBb3Q/

发送链接后，我会为您：
1️⃣ 提取视频完整文案
2️⃣ 保留文案排版格式
3️⃣ 提取话题和标签
4️⃣ 输出可复制文本

💡 小贴士：
• 确保链接格式正确
• 一次发送一个链接
• 链接需要是公开视频
• 等待提取完成后再发送下一个

请复制您想要提取的抖音链接发送给我，让我来帮您获取文案内容！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖商圈调研（销售）') {
                // 商圈调研助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖商圈调研助手！📊

我是您的商圈数据分析专家，帮您深入解读市场机会！

📥 数据准备步骤：
━━━━━━━━━━━━━━━━
1. 打开商圈数据工具
2. 选择目标商圈范围
3. 采集商圈数据信息
4. 导出数据表格文件
━━━━━━━━━━━━━━━━

📊 数据分析内容：
• 商圈商家分布
• 品类市场份额
• 客单价分布区间
• 评分与销量关系
• 竞争强度分析

上传数据后，我会为您：
1️⃣ 分析商圈市场规模
2️⃣ 评估竞争态势
3️⃣ 识别市场机会
4️⃣ 提供选址建议

💡 小贴士：
• 确保数据表格完整
• 建议选择合适的商圈范围
• 数据需包含完整的商家信息
• 支持Excel格式文件

请上传您的商圈数据表格，让我来帮您分析市场机会！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖店铺数据分析') {
                // 店铺数据分析助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖店铺数据分析助手！📈

我是您的店铺数据分析专家，帮您深入解读经营数据！

📥 数据获取步骤：
━━━━━━━━━━━━━━━━
1. 登录美团外卖商家版
2. 进入"经营分析-报表下载"
3. 选择近30天数据区间
4. 勾选所有分析指标
5. 下载数据表格文件
━━━━━━━━━━━━━━━━

📊 分析指标包括：
• 订单量与营业额
• 客单价与用户数
• 曝光量与转化率
• 商品销量分布
• 配送与服务评分

上传数据后，我会为您：
1️⃣ 分析经营趋势走势
2️⃣ 诊断关键指标表现
3️⃣ 发现异常数据波动
4️⃣ 提供优化建议方案

💡 小贴士：
• 确保选择完整30天数据
• 必须勾选所有分析指标
• 使用最新下载的数据
• 仅支持Excel格式文件

请上传您的店铺数据表格，让我来帮您分析经营状况！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖店铺诊断(销售)') {
                // 店铺诊断助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖店铺诊断助手！🔍

我是您的店铺优化专家，帮您全方位诊断店铺问题！

📋 诊断项目清单：
━━━━━━━━━━━━━━━━
【基础信息】
• 店铺名称
• 店铺评分
• 月售订单
• 配送时间

【活动运营】
• 优惠活动
• 满减活动

【菜品管理】
• 点菜栏分类
• 餐品排序
• 产品标题
• 产品价格
• 产品月售

【视觉呈现】
• LOGO设计
• 产品图片
• 海报展示
━━━━━━━━━━━━━━━━

发送店铺信息后，我会为您：
1️⃣ 诊断各项指标表现
2️⃣ 对比行业标准水平
3️⃣ 发现运营短板问题
4️⃣ 提供优化提升方案

💡 小贴士：
• 信息越完整，诊断越准确
• 建议提供具体数据
• 可以附加竞品信息
• 图片资料更有帮助

请按照以上清单提供您的店铺信息，让我来帮您诊断问题！✨`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else if (selectedAssistant?.name === '外卖竞店数据分析') {
                // 竞店数据分析助手的欢迎消息
                const welcomeMessage = {
                    id: Date.now(),
                    content: `欢迎使用外卖竞店数据分析助手！🔍

我是您的竞品分析专家，只需上传Excel文件，我就能为您提供专业的竞品分析报告！

上传Excel后，我会为您：
1️⃣ 分析竞品优劣势
2️⃣ 对比价格策略
3️⃣ 评估用户口碑
4️⃣ 提供差异化建议

💡 小贴士：
• 请确保Excel中包含店铺基础信息
• 数据越完整，分析越准确

请上传Excel文件，让我为您生成专业的竞品分析报告！📈`,
                    isUser: false
                };
                setMessages([welcomeMessage]);
            } else {
                // 加载其他助手的历史记录
            const history = chatHistoryService.getHistory(assistantId);
            if (history && history.length > 0) {
                setMessages(history);
                }
            }
        }
    }, [selectedAssistant, getAssistantId]);

    // 添加消息监控
    useEffect(() => {
        console.log('Current messages:', messages);
    }, [messages]);

    // 保存聊天历史
    useEffect(() => {
        const assistantId = getAssistantId(selectedAssistant);
        
        if (assistantId) {
            chatHistoryService.saveHistory(assistantId, messages);
        }
    }, [selectedAssistant, messages, getAssistantId]);

    const handleSend = async () => {
        if (!inputValue.trim()) {
            return;
        }

        const assistantId = getAssistantId(selectedAssistant);
        if (!assistantId) {
            message.error('请先选择一个AI助手');
            return;
        }

        try {
            const userMessage = { 
                id: Date.now(),
                content: inputValue.replace(/\n/g, '\n'),
                isUser: true 
            };
            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setInputValue('');
            setLoading(true);

            const response = await aiAssistantService.callAssistant(assistantId, inputValue);
            
            if (response.success) {
                const assistantMessage = { 
                    id: Date.now(),
                    content: response.data.message || response.data.data?.message || '抱歉，我暂时无法回答这个问题', 
                    isUser: false 
                };
                setMessages([...newMessages, assistantMessage]);
                
                // 直接获取最新用户信息并更新
                const userResponse = await http.get('/users/me');
                if (userResponse.data.success) {
                    updateUser(userResponse.data.data);
                }
            } else {
                message.error(response.message || '调用AI助手失败');
            }
        } catch (error) {
            console.error('调用AI助手失败:', error);
            message.error(error.response?.data?.message || '调用AI助手失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift + Enter 换行，不阻止默认行为
                return;
            }
            // 仅当按下Enter且没有按Shift时才发送消息
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e) => {
        setInputValue(e.target.value);
        // 自动调整输入框高度
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
    };

    const handleCopy = (content) => {
        // 创建一个临时div来解析HTML内容
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // 获取纯文本内容
        const textContent = tempDiv.textContent || tempDiv.innerText;
        
        navigator.clipboard.writeText(textContent).then(() => {
            message.success('已复制到剪贴板');
        }).catch(() => {
            message.error('复制失败');
        });
    };

    const handleExport = (content) => {
        // 创建一个临时div来解析HTML内容
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // 获取纯文本内容
        const textContent = tempDiv.textContent || tempDiv.innerText;

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedAssistant?.name || 'AI助手'}_对话内容_${new Date().toLocaleString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        message.success('导出成功');
    };

    const handleClearChat = () => {
        setMessages([]);
        // 清除本地存储的聊天记录
        const assistantId = getAssistantId(selectedAssistant);
        if (assistantId) {
            chatHistoryService.clearHistory(assistantId);
        }
        message.success('聊天记录已清除');
    };

    const handleUpload = ({ file, fileList }) => {
        setFileList(fileList);
    };

    const handleAnalyze = async () => {
        if (fileList.length === 0) {
            message.warning('请先上传文件');
            return;
        }

        setAnalyzing(true);
        try {
            // 创建FormData对象
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('files', file.originFileObj);
            });

            // 调用分析接口
            const response = await aiAssistantService.analyzeFiles(selectedAssistant.key, formData);
            
            if (response.success) {
                // 替换"我的店铺名"为用户输入的店铺名
                const content = shopName 
                    ? response.message.replace(/我的店铺名/g, shopName)
                    : response.message;
                    
                const assistantMessage = { 
                    id: Date.now(),
                    content: content || '分析完成，但未返回结果', 
                    isUser: false 
                };
                setMessages(prev => [...prev, assistantMessage]);

                // 更新用户积分
                const userResponse = await http.get('/users/me');
                if (userResponse.data.success) {
                    updateUser(userResponse.data.data);
                }
            } else {
                message.error(response.message || '文件分析失败');
            }
        } catch (error) {
            console.error('文件分析失败:', error);
            message.error('文件分析失败，请稍后重试');
        } finally {
            setAnalyzing(false);
            setFileList([]); // 清空文件列表
        }
    };

    // 图片上传处理
    const uploadProps = {
        name: 'image',
        showUploadList: false,
        beforeUpload: (file) => {
            if (!file.type.startsWith('image/')) {
                message.error('请上传图片文件');
                return false;
            }

            if (file.size > 5 * 1024 * 1024) {
                message.error('图片大小不能超过5MB');
                return false;
            }

            const formData = new FormData();
            formData.append('image', file);

            setImageUploading(true);
            http.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                },
                transformRequest: [(data) => data],
                timeout: 30000
            })
            .then(response => {
                if (response.data.success) {
                    const imageUrl = response.data.url;
                    setInputValue(prev => prev + `\n![image](${imageUrl})`);
                    message.success('图片上传成功');
                } else {
                    throw new Error(response.data.message || '上传失败');
                }
            })
            .catch(error => {
                message.error(error.response?.data?.message || '图片上传失败，请重试');
            })
            .finally(() => {
                setImageUploading(false);
            });

            return false;
        }
    };

    const handleExportPDF = async (content) => {
        try {
            const element = document.createElement('div');
            element.innerHTML = content;
            element.style.padding = '20px';
            element.style.color = '#000';
            element.style.background = '#fff';
            
            const opt = {
                margin: [10, 10],
                filename: '对话内容.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                message.success('PDF 导出成功');
            });
        } catch (error) {
            message.error('PDF 导出失败，请重试');
        }
    };

    const handleExportMarkdown = (content) => {
        // 创建一个临时div来解析HTML内容
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // 将HTML转换为Markdown格式
        const markdownContent = turndownService.turndown(content);
        
        // 创建并下载文件
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedAssistant?.name || 'AI助手'}_对话内容_${new Date().toLocaleString()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        message.success('Markdown导出成功');
    };

    const renderHeader = () => {
        if (!assistantInfo) return null;
        const isDeepseekModel = assistantInfo.model?.includes('deepseek');
        
        return (
            <ChatHeader>
                <HeaderTitle>
                    <RobotOutlined />
                    {assistantInfo.name}
                    {locationInfo.loading ? (
                        <span style={{ marginLeft: '20px', fontSize: '14px', color: '#666' }}>
                            <LoadingOutlined style={{ marginRight: '5px' }} />
                            获取位置信息...
                        </span>
                    ) : locationInfo.city && (
                        <span style={{ marginLeft: '20px', fontSize: '14px', color: '#666' }}>
                            <EnvironmentOutlined style={{ marginRight: '5px' }} />
                            {locationInfo.city}
                            <CloudOutlined style={{ marginLeft: '10px', marginRight: '5px' }} />
                            {locationInfo.weather}
                        </span>
                    )}
                </HeaderTitle>
                <HeaderDescription>
                    {assistantInfo.description || '专业的AI助手，为您提供智能对话服务'}
                </HeaderDescription>
                <HeaderPoints>
                    <div className="feature-points">
                        <span>
                            <MessageOutlined />
                            智能对话
                        </span>
                        <span>
                            <FileTextOutlined />
                            文件分析
                        </span>
                        <span>
                            <StarOutlined />
                            专业服务
                        </span>
                        <span className="cost-points">
                            <MoneyCollectOutlined />
                            每次对话{assistantInfo.pointsCost}积分
                            {isDeepseekModel && (
                                <span className="file-cost">
                                    (文件分析+5积分)
                                </span>
                            )}
                        </span>
                    </div>
                </HeaderPoints>
                <ClearChatButton onClick={handleClearChat}>
                    <DeleteOutlined />
                    清除记录
                </ClearChatButton>
            </ChatHeader>
        );
    };

    // 修改渲染逻辑
    const renderContent = () => {
        // 如果没有选择助手，显示欢迎界面
        if (!selectedAssistant) {
            return <Welcome />;
        }

        // 如果选择了助手但缺少必要信息，也显示欢迎界面
        if (!selectedAssistant.key && !selectedAssistant._id) {
            return <Welcome />;
        }

        return (
            <>
                {renderHeader()}
                <MessageList>
                    {messages.map(message => (
                        <Message
                            key={message.id}
                            message={message}
                            handleCopy={handleCopy}
                            handleExport={handleExport}
                            handleExportPDF={handleExportPDF}
                            handleExportMarkdown={handleExportMarkdown}
                        />
                    ))}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <LoadingOutlined style={{ fontSize: 24, color: '#6b7280' }} />
                            <div style={{ marginTop: 8, color: '#6b7280' }}>域锦AI正在思考中...</div>
                        </div>
                    )}
                </MessageList>
                <InputArea>
                    {isDeepseekModel ? (
                        <UploadWrapper>
                            <Upload
                                multiple
                                fileList={fileList}
                                onChange={handleUpload}
                                beforeUpload={() => false}
                                accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                            >
                                <button icon={<UploadOutlined />}>选择文件</button>
                                <div style={{ marginTop: 8, color: '#666' }}>
                                    支持PDF、Word、Excel、PPT、图片、文本文件
                                </div>
                            </Upload>
                            {fileList.length > 0 && (
                                <FileList>
                                    {fileList.map(file => (
                                        <div key={file.uid} className="file-item">
                                            <FileTextOutlined />
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-size">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    ))}
                                </FileList>
                            )}
                            {selectedAssistant?.name === '外卖竞店数据分析' && (
                                <div className="shop-name-input" style={{ 
                                    margin: '10px 0', 
                                    padding: '10px', 
                                    background: '#f5f5f5', 
                                    borderRadius: '4px' 
                                }}>
                                    <input
                                        type="text"
                                        value={shopName}
                                        onChange={(e) => setShopName(e.target.value)}
                                        placeholder="请输入店铺名称"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #d9d9d9',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                            )}
                            <AnalyzeButton
                                type="primary"
                                onClick={handleAnalyze}
                                loading={analyzing}
                                disabled={fileList.length === 0}
                            >
                                {analyzing ? '正在分析...' : '开始分析'}
                            </AnalyzeButton>
                        </UploadWrapper>
                    ) : (
                        <InputWrapper>
                            <StyledInput
                                value={inputValue}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                placeholder="输入您的问题... (Shift + Enter 换行，Enter 发送)"
                                disabled={loading}
                            />
                            <Upload {...uploadProps}>
                                <label className="upload-btn">
                                    {imageUploading ? <LoadingOutlined /> : <PictureOutlined />}
                                </label>
                            </Upload>
                            <button
                                type="primary"
                                onClick={handleSend}
                                disabled={loading || imageUploading}
                            >
                                <SendOutlined /> 发送
                            </button>
                        </InputWrapper>
                    )}
                </InputArea>
            </>
        );
    };

    return (
        <ChatContainer>
            {renderContent()}
        </ChatContainer>
    );
};

export default ChatWindow; 