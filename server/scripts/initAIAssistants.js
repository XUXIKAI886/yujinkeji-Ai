const mongoose = require('mongoose');
const path = require('path');
const AIAssistant = require('../models/aiAssistant.model');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// 检查环境变量
if (!process.env.MONGODB_URI) {
    console.error('错误: 环境变量 MONGODB_URI 未设置');
    console.log('请确保在 .env 文件中设置了 MONGODB_URI');
    console.log('示例: MONGODB_URI=mongodb://localhost:27017/your_database');
    process.exit(1);
}

const assistants = [
    {
        key: 'general-service',
        name: '美团全能客服助手',
        description: '专业解答各类客服问题，包括订单处理、退款咨询、投诉处理等',
        type: 'general',
        pointsCost: 3,
        config: {
            modelType: 'coze',
            apiKey: 'pat_gMDZEOZoPKPPcr57dT2lNUGCFjqlkYo67GCcDtFTdYkrW92iXVlcLzVAeXgei92l',
            apiUrl: 'https://api.coze.cn/open_api/v2/chat',
            botId: '7450790638439907355',
            temperature: 0.7,
            maxTokens: 2000
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['客服', '订单', '退款']
        }
    },
    {
        key: 'brand-design',
        name: '品牌定位设计助手',
        description: '帮助商家进行品牌定位、设计品牌形象和营销策略',
        type: 'text',
        pointsCost: 10,
        config: {
            modelType: 'coze',
            apiKey: 'pat_gMDZEOZoPKPPcr57dT2lNUGCFjqlkYo67GCcDtFTdYkrW92iXVlcLzVAeXgei92l',
            apiUrl: 'https://api.coze.cn/open_api/v2/chat',
            botId: '7432139594210115595',
            temperature: 0.8,
            maxTokens: 2500
        },
        isActive: true,
        accessLevel: 'premium',
        metadata: {
            version: '1.0.0',
            tags: ['品牌', '设计', '营销']
        }
    },
    {
        key: 'category-optimization',
        name: '分类描述优化助手',
        description: '优化商品分类描述，提升搜索排名和用户体验',
        type: 'text',
        pointsCost: 8,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个SEO优化专家，专门帮助商家优化商品分类描述，提升搜索排名。',
            temperature: 0.6,
            maxTokens: 1500
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['分类', 'SEO', '描述']
        }
    },
    {
        key: 'package-recommendation',
        name: '套餐搭配推荐助手',
        description: '智能推荐最优套餐组合，提升客单价和用户满意度',
        type: 'text',
        pointsCost: 6,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的套餐搭配顾问，擅长根据用户需求推荐最优的套餐组合。',
            temperature: 0.7,
            maxTokens: 1800
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['套餐', '推荐', '组合']
        }
    },
    {
        key: 'negative-review-analysis',
        name: '差评分析解释助手',
        description: '分析差评原因，提供专业的解决方案和回复建议',
        type: 'text',
        pointsCost: 8,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的差评处理专家，擅长分析差评原因并提供解决方案。',
            temperature: 0.6,
            maxTokens: 2000
        },
        isActive: true,
        accessLevel: 'premium',
        metadata: {
            version: '1.0.0',
            tags: ['差评', '分析', '解决方案']
        }
    },
    {
        key: 'positive-review-generation',
        name: '好评生成助手',
        description: '根据用户体验生成真实自然的好评内容',
        type: 'text',
        pointsCost: 5,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的评价内容生成专家，擅长根据用户体验生成真实自然的好评。',
            temperature: 0.8,
            maxTokens: 1500
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['好评', '生成', '用户体验']
        }
    },
    {
        key: 'store-operation',
        name: '店铺运营分析助手',
        description: '分析店铺运营数据，提供优化建议和改进方案',
        type: 'text',
        pointsCost: 12,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的店铺运营顾问，擅长分析运营数据并提供优化建议。',
            temperature: 0.6,
            maxTokens: 2500
        },
        isActive: true,
        accessLevel: 'premium',
        metadata: {
            version: '1.0.0',
            tags: ['运营', '分析', '优化']
        }
    },
    {
        key: 'search-keyword',
        name: '搜索关键词优化助手',
        description: '优化店铺和商品的搜索关键词，提升搜索排名',
        type: 'text',
        pointsCost: 8,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个SEO关键词优化专家，擅长优化店铺和商品的搜索关键词。',
            temperature: 0.6,
            maxTokens: 1800
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['SEO', '关键词', '排名']
        }
    },
    {
        key: 'dish-description',
        name: '菜品描述优化助手',
        description: '生成诱人的菜品描述，提升点击率和转化率',
        type: 'text',
        pointsCost: 6,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的美食文案专家，擅长编写诱人的菜品描述。请以HTML表格格式输出内容，表格应包含以下列：菜品名称、价格、特色、推荐指数、描述。其中推荐指数用1-5颗星表示（★）。表格样式应该美观大方，使用浅色背景。每个单元格的内容应该简洁明了，突出菜品特色。',
            temperature: 0.8,
            maxTokens: 1500
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['菜品', '描述', '转化']
        }
    },
    {
        key: 'weekly-report',
        name: '周报生成助手',
        description: '自动生成店铺运营周报，包含数据分析和建议',
        type: 'text',
        pointsCost: 10,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的数据分析师，擅长生成详细的店铺运营周报。',
            temperature: 0.6,
            maxTokens: 2500
        },
        isActive: true,
        accessLevel: 'premium',
        metadata: {
            version: '1.0.0',
            tags: ['周报', '数据', '分析']
        }
    },
    {
        key: 'competitor-analysis',
        name: '竞品分析助手',
        description: '分析竞争对手优劣势，提供差异化竞争策略',
        type: 'text',
        pointsCost: 15,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的竞品分析专家，擅长分析竞争对手并提供差异化策略。',
            temperature: 0.7,
            maxTokens: 3000
        },
        isActive: true,
        accessLevel: 'premium',
        metadata: {
            version: '1.0.0',
            tags: ['竞品', '分析', '策略']
        }
    },
    {
        key: 'data-analysis',
        name: '数据分析助手',
        description: '深度分析店铺各项数据指标，提供专业的分析报告',
        type: 'text',
        pointsCost: 12,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的数据分析专家，擅长深度分析店铺数据并生成专业报告。',
            temperature: 0.6,
            maxTokens: 2500
        },
        isActive: true,
        accessLevel: 'premium',
        metadata: {
            version: '1.0.0',
            tags: ['数据', '分析', '报告']
        }
    },
    {
        key: 'xiaohongshu-content',
        name: '小红书图文助手',
        description: '专业创作小红书爆款内容，提供图片美化和排版建议',
        type: 'visual',
        pointsCost: 10,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的小红书内容创作和图片美化专家，帮助用户创作爆款内容并提供专业的排版和美化建议。',
            temperature: 0.7,
            maxTokens: 2500
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['小红书', '内容创作', '图片美化', '排版']
        }
    },
    {
        key: 'flashbuy-selling-points',
        name: '美团闪购八字卖点提炼',
        description: '专业提炼商品核心优势，凝练八字精准卖点',
        type: 'text',
        pointsCost: 8,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的商品卖点提炼专家，擅长把商品的特点和优势浓缩为简短有力的八字卖点，帮助商家提高转化率。',
            temperature: 0.6,
            maxTokens: 2000
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['美团', '闪购', '卖点', '商品描述']
        }
    },
    {
        key: 'wechat-graphic-copywriting',
        name: '微信群发图形化文案创作',
        description: '专业创作微信群发图文消息，提供精美排版和高转化率文案',
        type: 'visual',
        pointsCost: 10,
        config: {
            modelType: 'deepseek',
            apiKey: process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            systemPrompt: '你是一个专业的微信营销文案专家，擅长创作图文并茂、富有吸引力的微信群发内容，帮助用户提高转化率和互动率。',
            temperature: 0.7,
            maxTokens: 2500
        },
        isActive: true,
        accessLevel: 'public',
        metadata: {
            version: '1.0.0',
            tags: ['微信', '群发', '图文', '营销文案']
        }
    }
];

const initAIAssistants = async () => {
    try {
        // 连接数据库
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('数据库连接成功');

        // 清空现有AI助手数据
        await AIAssistant.deleteMany({});
        console.log('已清空现有AI助手数据');

        // 插入新的AI助手数据
        const result = await AIAssistant.insertMany(assistants);
        console.log(`成功添加 ${result.length} 个AI助手`);

        // 关闭数据库连接
        await mongoose.connection.close();
        console.log('数据库连接已关闭');
    } catch (error) {
        console.error('初始化AI助手失败:', error);
        process.exit(1);
    }
};

// 运行初始化脚本
initAIAssistants(); 