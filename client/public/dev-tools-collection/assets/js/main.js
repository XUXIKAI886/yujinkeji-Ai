/* global layui, XLSX */

// 全局变量
let categoryData = null;
let searchData = null;
let collectionWindow = null;

// 初始化
layui.use(['table', 'layer'], function() {
    const table = layui.table;
    const layer = layui.layer;

    // 初始化表格
    table.render({
        elem: '#shopTable',
        cols: [[
            {field: '店铺名称', title: '店铺名称', width: 300},
            {field: '评分', title: '评分', width: 100},
            {field: '月售', title: '月售', width: 100},
            {field: '起送价', title: '起送价', width: 100},
            {field: '配送费', title: '配送费', width: 100},
            {field: '配送时间', title: '配送时间', width: 100}
        ]],
        data: [],
        page: true
    });

    // 采集分类店铺数据
    document.getElementById('startCollectCategory').addEventListener('click', function() {
        // 打开美团外卖页面
        window.open('https://h5.waimai.meituan.com/waimai/mindex/home');
        
        // 创建采集按钮的代码
        const collectCode = `
            // 创建并添加采集按钮
            const btn = document.createElement('button');
            btn.textContent = '采集数据';
            btn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 99999; padding: 10px 20px; background: #1E9FFF; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
            
            btn.onclick = function() {
                alert('开始采集数据...');
                let shopData = [];
                const shopCards = document.querySelectorAll('.poilist-item');
                
                if (shopCards.length === 0) {
                    alert('未找到店铺数据，请确保页面已加载完成');
                    return;
                }
                
                shopCards.forEach(card => {
                    const shop = {
                        店铺名称: card.querySelector('.poilist-item-info1name')?.textContent?.trim() || '',
                        评分: card.querySelector('.score')?.textContent?.replace('分', '') || '0',
                        月售: card.querySelector('.poi-info-txt:nth-child(2)')?.textContent?.replace('月售', '').replace('+', '') || '0',
                        起送价: card.querySelector('.poilist-item-info3left .poi-info-txt:first-child')?.textContent?.replace('起送 ¥', '') || '0',
                        配送费: card.querySelector('.poilist-item-info3left .poi-info-txt:last-child')?.textContent?.replace('配送 约¥', '') || '0',
                        配送时间: card.querySelector('.poilist-item-info3right .poi-info-txt:first-child')?.textContent?.replace('分钟', '') || '0'
                    };
                    
                    // 清理数据
                    shop.月售 = shop.月售.replace(/[^0-9]/g, '');
                    shop.起送价 = shop.起送价.replace(/[^0-9.]/g, '');
                    shop.配送费 = shop.配送费.replace(/[^0-9.]/g, '');
                    shop.配送时间 = shop.配送时间.replace(/[^0-9]/g, '');
                    
                    shopData.push(shop);
                });
                
                if (shopData.length > 0) {
                    // 将数据复制到剪贴板
                    const dataStr = JSON.stringify(shopData);
                    const textarea = document.createElement('textarea');
                    textarea.value = dataStr;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    
                    alert('数据采集成功，共采集到 ' + shopData.length + ' 条数据\\n数据已复制到剪贴板，请返回数据采集页面点击"保存分类数据"按钮');
                } else {
                    alert('未能采集到数据，请检查页面是否正确');
                }
            };
            
            // 检查是否已存在采集按钮
            const existingBtn = document.querySelector('button[data-role="collect-btn"]');
            if (existingBtn) {
                existingBtn.remove();
            }
            
            btn.setAttribute('data-role', 'collect-btn');
            document.body.appendChild(btn);
            alert('采集按钮已创建，请查看页面右上角');
        `;
        
        // 复制代码到剪贴板
        const textarea = document.createElement('textarea');
        textarea.value = collectCode;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.error('复制失败:', err);
        }
        document.body.removeChild(textarea);
        
        layer.open({
            type: 1,
            title: '操作指南',
            area: ['500px', success ? '300px' : '500px'],
            content: `
                <div style="padding: 20px;">
                    <div style="margin-bottom: 15px; color: ${success ? '#67C23A' : '#F56C6C'}">
                        ${success ? '✓ 代码已成功复制到剪贴板' : '✗ 代码复制失败，请手动复制下面的代码'}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>请按照以下步骤操作：</strong>
                        <ol style="margin-top: 10px; padding-left: 20px;">
                            <li>在新打开的页面中登录美团外卖</li>
                            <li>导航到目标分类页面</li>
                            <li>按F12打开开发者工具</li>
                            <li>切换到Console标签</li>
                            <li>粘贴代码并按回车执行</li>
                            <li>等待页面右上角出现"采集数据"按钮</li>
                            <li>点击"采集数据"按钮开始采集</li>
                        </ol>
                    </div>
                    ${!success ? `
                        <div style="margin-top: 15px; position: relative;">
                            <textarea id="codeTextarea" style="width: 100%; height: 150px; padding: 10px; border: 1px solid #DCDFE6; border-radius: 4px; margin-bottom: 10px;">${collectCode}</textarea>
                            <button onclick="copyTextareaContent()" style="position: absolute; top: -30px; right: 0; padding: 6px 15px; background: #409EFF; color: white; border: none; border-radius: 4px; cursor: pointer;">复制代码</button>
                        </div>
                        <script>
                            function copyTextareaContent() {
                                const textarea = document.getElementById('codeTextarea');
                                textarea.select();
                                try {
                                    document.execCommand('copy');
                                    layer.msg('代码复制成功', {icon: 1});
                                } catch (err) {
                                    layer.msg('代码复制失败: ' + err.message, {icon: 2});
                                }
                            }
                        </script>
                    ` : ''}
                </div>
            `,
            btn: ['我知道了']
        });
    });

    // 保存分类店铺数据
    document.getElementById('saveCategoryData').addEventListener('click', async function() {
        try {
            console.log('开始保存数据...');
            
            // 从剪贴板读取数据
            const text = await navigator.clipboard.readText();
            console.log('从剪贴板获取的数据:', text);
            
            if (!text) {
                layer.msg('请先采集数据', {icon: 2});
                console.log('未找到数据');
                return;
            }

            let shopData;
            try {
                shopData = JSON.parse(text);
                console.log('解析后的数据:', shopData);
            } catch (err) {
                console.error('数据解析失败:', err);
                layer.msg('数据格式错误', {icon: 2});
                return;
            }

            if (!Array.isArray(shopData) || shopData.length === 0) {
                layer.msg('没有可导出的数据', {icon: 2});
                console.log('数据为空或格式不正确');
                return;
            }

            try {
                // 先更新表格显示
                console.log('更新表格显示...');
                table.reload('shopTable', {
                    data: shopData
                });
                console.log('表格更新完成');
                
                // 再导出Excel
                console.log('开始导出Excel...');
                exportToExcel(shopData, '分类店铺数据');
                console.log('Excel导出完成');
                
                layer.msg('数据已导出为Excel文件', {icon: 1});
            } catch (err) {
                console.error('导出或更新表格失败:', err);
                layer.msg('保存数据失败: ' + err.message, {icon: 2});
            }
        } catch (err) {
            console.error('保存数据时发生错误:', err);
            layer.msg('保存数据时发生错误', {icon: 2});
        }
    });

    // 采集搜索店铺数据
    document.getElementById('startCollectSearch').addEventListener('click', function() {
        // 打开美团外卖页面
        window.open('https://h5.waimai.meituan.com/waimai/mindex/home');
        
        // 创建采集按钮的代码
        const collectCode = `
            // 创建并添加采集按钮
            const btn = document.createElement('button');
            btn.textContent = '采集数据';
            btn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 99999; padding: 10px 20px; background: #1E9FFF; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
            
            btn.onclick = function() {
                alert('开始采集数据...');
                let shopData = [];
                
                // 打印所有可能包含"poi"或"shop"的元素类名，用于调试
                console.log('页面上所有包含poi或shop的元素类名：');
                document.querySelectorAll('*').forEach(el => {
                    if (el.className && (el.className.includes('poi') || el.className.includes('shop'))) {
                        console.log(el.className);
                    }
                });
                
                // 尝试多个可能的选择器
                const selectors = [
                    '.shopCard_Ra8mF5',  // 新版美团外卖搜索结果店铺卡片
                    '.wm-poi-list .wm-poi-item',
                    '.shoplist .shoplist-item',
                    '.poi-list-item',
                    '.wm-poi-list li',
                    '.search-poi-list .search-poi-item'
                ];
                
                let shopCards = null;
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    console.log('使用选择器 ' + selector + ' 找到 ' + elements.length + ' 个元素');
                    if (elements.length > 0) {
                        shopCards = elements;
                        console.log('使用选择器:', selector);
                        break;
                    }
                }
                
                if (!shopCards || shopCards.length === 0) {
                    console.log('未找到店铺元素，页面内容：', document.body.innerHTML);
                    alert('未找到店铺数据，请确保页面已加载完成并且已经搜索到店铺');
                    return;
                }
                
                shopCards.forEach((card, index) => {
                    console.log('处理第 ' + (index + 1) + ' 个店铺卡片');
                    console.log('店铺卡片HTML:', card.outerHTML);
                    
                    const shop = {
                        店铺名称: '',
                        评分: '0',
                        月售: '0',
                        起送价: '0',
                        配送费: '0',
                        配送时间: '0'
                    };
                    
                    // 更新选择器以匹配新版美团外卖页面
                    const nameSelectors = ['.name_zwbG1P', '.wm-poi-name', '.shop-name', '.poi-name', 'h3', '.title'];
                    const scoreSelectors = ['.scoreNumber_dWExO8', '.wm-poi-score .score', '.shop-rating', '.rating', '.score'];
                    const salesSelectors = ['.infoCount_SzLoSC', '.wm-poi-stats-item:nth-child(2)', '.shop-sales', '.sales-num', '.month-sales'];
                    const minPriceSelectors = ['.infoCount_SzLoSC', '.wm-poi-price-info .delivery-min-price', '.shop-min-price', '.min-price', '.start-price'];
                    const deliveryFeeSelectors = ['.infoCount_SzLoSC', '.wm-poi-price-info .delivery-price', '.shop-delivery-fee', '.delivery-fee', '.shipping-fee'];
                    const deliveryTimeSelectors = ['.deliveryTimeDistance_meSMLQ', '.delivery-time', '.shop-delivery-time', '.delivery-duration', '.eta'];
                    
                    // 获取店铺名称
                    for (const selector of nameSelectors) {
                        const element = card.querySelector(selector);
                        if (element) {
                            shop.店铺名称 = element.textContent.trim();
                            console.log('找到店铺名称: ' + shop.店铺名称 + ' (使用选择器: ' + selector + ')');
                            break;
                        }
                    }
                    
                    // 获取评分
                    for (const selector of scoreSelectors) {
                        const element = card.querySelector(selector);
                        if (element) {
                            shop.评分 = element.textContent.trim().replace('分', '');
                            console.log('找到评分: ' + shop.评分 + ' (使用选择器: ' + selector + ')');
                            break;
                        }
                    }
                    
                    // 获取月售
                    for (const selector of salesSelectors) {
                        const element = card.querySelector(selector);
                        if (element) {
                            const text = element.textContent.trim();
                            // 处理"1000+"这样的格式
                            shop.月售 = text.includes('+') ? 
                                text.replace(/[^0-9]/g, '') + '+' : 
                                text.replace(/[^0-9]/g, '');
                            console.log('找到月售: ' + shop.月售 + ' (使用选择器: ' + selector + ')');
                            break;
                        }
                    }
                    
                    // 获取起送价和配送费
                    let foundStartPrice = false;
                    let foundDeliveryFee = false;
                    const priceElements = card.querySelectorAll('.infoCount_SzLoSC');
                    priceElements.forEach((el, i) => {
                        const prevText = el.previousElementSibling?.textContent?.trim() || '';
                        if (prevText.includes('起送') && !foundStartPrice) {
                            shop.起送价 = el.textContent.trim().replace(/[^0-9.]/g, '');
                            foundStartPrice = true;
                        } else if (prevText.includes('配送') && !foundDeliveryFee) {
                            shop.配送费 = el.textContent.trim().replace(/[^0-9.]/g, '');
                            foundDeliveryFee = true;
                        }
                    });
                    
                    // 获取配送时间
                    const timeElement = card.querySelector('.deliveryTimeDistance_meSMLQ');
                    if (timeElement) {
                        const timeTexts = timeElement.textContent.trim().split(/\s+/);
                        // 只获取包含"分钟"的第一个值
                        const timeText = timeTexts.find(text => text.includes('分钟'));
                        if (timeText) {
                            shop.配送时间 = timeText.replace(/[^0-9]/g, '');
                            console.log('找到配送时间: ' + shop.配送时间 + ' 分钟');
                        }
                    }
                    
                    // 数据验证和清洗
                    const cleanData = (value, type) => {
                        if (!value || value === '0') return '0';
                        switch (type) {
                            case 'price':
                                return parseFloat(value).toFixed(2);
                            case 'integer':
                                return parseInt(value, 10).toString();
                            default:
                                return value;
                        }
                    };
                    
                    // 应用数据清洗
                    shop.评分 = cleanData(shop.评分, 'price');
                    shop.起送价 = cleanData(shop.起送价, 'price');
                    shop.配送费 = cleanData(shop.配送费, 'price');
                    shop.配送时间 = cleanData(shop.配送时间, 'integer');
                    
                    // 验证数据完整性
                    const isValid = shop.店铺名称 && 
                                  parseFloat(shop.评分) > 0 && 
                                  shop.月售 && 
                                  parseFloat(shop.起送价) >= 0 && 
                                  parseFloat(shop.配送费) >= 0 && 
                                  parseInt(shop.配送时间, 10) > 0;
                    
                    if (isValid) {
                        shopData.push(shop);
                        console.log('成功采集店铺数据:', shop);
                    } else {
                        console.warn('店铺数据不完整，已跳过:', shop);
                    }
                });
                
                if (shopData.length > 0) {
                    console.log('采集到的数据:', shopData);
                    // 将数据复制到剪贴板
                    const dataStr = JSON.stringify(shopData);
                    const textarea = document.createElement('textarea');
                    textarea.value = dataStr;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    
                    alert('数据采集成功，共采集到 ' + shopData.length + ' 条数据\\n数据已复制到剪贴板，请返回数据采集页面点击"保存搜索数据"按钮');
                } else {
                    alert('未能采集到数据，请检查页面是否正确');
                }
            };
            
            // 检查是否已存在采集按钮
            const existingBtn = document.querySelector('button[data-role="collect-btn"]');
            if (existingBtn) {
                existingBtn.remove();
            }
            
            btn.setAttribute('data-role', 'collect-btn');
            document.body.appendChild(btn);
            alert('采集按钮已创建，请查看页面右上角');
        `;
        
        // 复制代码到剪贴板
        const textarea = document.createElement('textarea');
        textarea.value = collectCode;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.error('复制失败:', err);
        }
        document.body.removeChild(textarea);
        
        layer.open({
            type: 1,
            title: '操作指南',
            area: ['500px', success ? '300px' : '500px'],
            content: `
                <div style="padding: 20px;">
                    <div style="margin-bottom: 15px; color: ${success ? '#67C23A' : '#F56C6C'}">
                        ${success ? '✓ 代码已成功复制到剪贴板' : '✗ 代码复制失败，请手动复制下面的代码'}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>请按照以下步骤操作：</strong>
                        <ol style="margin-top: 10px; padding-left: 20px;">
                            <li>在新打开的页面中登录美团外卖</li>
                            <li>搜索目标店铺</li>
                            <li>按F12打开开发者工具</li>
                            <li>切换到Console标签</li>
                            <li>粘贴代码并按回车执行</li>
                            <li>等待页面右上角出现"采集数据"按钮</li>
                            <li>点击"采集数据"按钮开始采集</li>
                        </ol>
                    </div>
                    ${!success ? `
                        <div style="margin-top: 15px; position: relative;">
                            <textarea id="codeTextarea" style="width: 100%; height: 150px; padding: 10px; border: 1px solid #DCDFE6; border-radius: 4px; margin-bottom: 10px;">${collectCode}</textarea>
                            <button onclick="copyTextareaContent()" style="position: absolute; top: -30px; right: 0; padding: 6px 15px; background: #409EFF; color: white; border: none; border-radius: 4px; cursor: pointer;">复制代码</button>
                        </div>
                        <script>
                            function copyTextareaContent() {
                                const textarea = document.getElementById('codeTextarea');
                                textarea.select();
                                try {
                                    document.execCommand('copy');
                                    layer.msg('代码复制成功', {icon: 1});
                                } catch (err) {
                                    layer.msg('代码复制失败: ' + err.message, {icon: 2});
                                }
                            }
                        </script>
                    ` : ''}
                </div>
            `,
            btn: ['我知道了']
        });
    });

    // 保存搜索店铺数据
    document.getElementById('saveSearchData').addEventListener('click', async function() {
        try {
            console.log('开始保存数据...');
            
            // 从剪贴板读取数据
            const text = await navigator.clipboard.readText();
            console.log('从剪贴板获取的数据:', text);
            
            if (!text) {
                layer.msg('请先采集数据', {icon: 2});
                console.log('未找到数据');
                return;
            }

            let shopData;
            try {
                shopData = JSON.parse(text);
                console.log('解析后的数据:', shopData);
            } catch (err) {
                console.error('数据解析失败:', err);
                layer.msg('数据格式错误', {icon: 2});
                return;
            }

            if (!Array.isArray(shopData) || shopData.length === 0) {
                layer.msg('没有可导出的数据', {icon: 2});
                console.log('数据为空或格式不正确');
                return;
            }

            try {
                // 先更新表格显示
                console.log('更新表格显示...');
                table.reload('shopTable', {
                    data: shopData
                });
                console.log('表格更新完成');
                
                // 再导出Excel
                console.log('开始导出Excel...');
                exportToExcel(shopData, '搜索店铺数据');
                console.log('Excel导出完成');
                
                layer.msg('数据已导出为Excel文件', {icon: 1});
            } catch (err) {
                console.error('导出或更新表格失败:', err);
                layer.msg('保存数据失败: ' + err.message, {icon: 2});
            }
        } catch (err) {
            console.error('保存数据时发生错误:', err);
            layer.msg('保存数据时发生错误', {icon: 2});
        }
    });

    // 导出Excel文件
    function exportToExcel(data, prefix) {
        if (!data || data.length === 0) {
            console.log('没有数据可导出');
            return;
        }
        
        try {
            console.log('创建工作表...');
            
            // 重命名列标题
            const renamedData = data.map(item => {
                const {LAY_TABLE_INDEX, ...rest} = item; // 删除LAY_TABLE_INDEX列
                return {
                    '店铺名': rest['店铺名称'],
                    '评分': rest['评分'],
                    '月售': rest['月售'],
                    '起送': rest['起送价'],
                    '配送费': rest['配送费'],
                    '配送时间': rest['配送时间']
                };
            });
            
            const worksheet = XLSX.utils.json_to_sheet(renamedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "店铺数据");
            
            // 生成文件名（包含时间戳）
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${prefix}_${timestamp}.xlsx`;
            console.log('准备导出文件:', fileName);
            
            XLSX.writeFile(workbook, fileName);
            console.log('文件导出完成');
        } catch (err) {
            console.error('Excel导出失败:', err);
            throw new Error('Excel导出失败: ' + err.message);
        }
    }
});

// 更新状态显示
function updateStatus(elementId, message, type = '') {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = 'status-box ' + type;
    }
}

// 数据清洗
function cleanData(text) {
    if (!text) return '0';
    return text.toString().replace(/[^\d.]/g, '');
} 