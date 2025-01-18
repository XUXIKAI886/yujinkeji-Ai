/* global layui, XLSX */

layui.use(['table', 'layer'], function(){
    var table = layui.table;
    var layer = layui.layer;
    var $ = layui.$;

    // 竞店数据采集代码
    var competitorCode = [
        '// 创建并添加采集按钮',
        'const collectButton = document.createElement("button");',
        'collectButton.innerText = "采集竞店数据";',
        'collectButton.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 1000; padding: 10px 20px; background-color: #FE8C00; color: white; border: none; border-radius: 4px; cursor: pointer;";',
        'document.body.appendChild(collectButton);',
        '',
        'collectButton.onclick = async function() {',
        '    try {',
        '        const shopName = document.querySelector(".shop-name, .shopname, .title_X4W1xy")?.innerText || "未知店铺";',
        '        const products = [];',
        '',
        '        const items = document.querySelectorAll(".food-item, .fooddetails_3K5RV, .spu_s6NtPr");',
        '        items.forEach(item => {',
        '            // 获取原价',
        '            let originalPrice = "";',
        '            const originalPriceElement = item.querySelector("[class*=\'oprice\']");',
        '            if (originalPriceElement) {',
        '                originalPrice = originalPriceElement.innerText.replace("¥", "").trim();',
        '            }',
        '',
        '            // 获取活动价',
        '            let discountPrice = "";',
        '            const discountPriceElement = item.querySelector("[class*=\'cprice\']");',
        '            if (discountPriceElement) {',
        '                discountPrice = discountPriceElement.innerText.replace(/[¥ ]/g, "").trim();',
        '            }',
        '',
        '            // 如果只有活动价，则原价等于活动价',
        '            if (!originalPrice && discountPrice) {',
        '                originalPrice = discountPrice;',
        '            }',
        '',
        '            const product = {',
        '                name: item.querySelector(".food-name, .name_13SxcF, .name_hTGUTi")?.innerText || "",',
        '                originalPrice: originalPrice,',
        '                discountPrice: discountPrice,',
        '                monthlySales: item.querySelector(".food-sales, .monthsale_3tGXs, .sold_popFgl .mtsi-num")?.innerText.replace("月售","").replace("份","") || "0",',
        '                description: item.querySelector(".food-description, .description_1sVwX, .desc_JKp2Zf")?.innerText || ""',
        '            };',
        '            products.push(product);',
        '        });',
        '',
        '        if (products.length === 0) {',
        '            throw new Error("未找到商品数据，请确保页面已完全加载");',
        '        }',
        '',
        '        const data = {',
        '            shopName: shopName,',
        '            products: products',
        '        };',
        '',
        '        const jsonStr = JSON.stringify(data);',
        '',
        '        // 使用 Clipboard API',
        '        if (navigator.clipboard && window.isSecureContext) {',
        '            await navigator.clipboard.writeText(jsonStr);',
        '            alert("数据采集成功！\\n店铺名称：" + shopName + "\\n商品数量：" + products.length + "\\n\\n数据已复制到剪贴板，请返回竞店数据页面点击\\"保存数据\\"按钮导出Excel文件。");',
        '        } else {',
        '            // 降级方案：使用传统方法',
        '            const textarea = document.createElement("textarea");',
        '            textarea.value = jsonStr;',
        '            document.body.appendChild(textarea);',
        '            textarea.select();',
        '            const success = document.execCommand("copy");',
        '            document.body.removeChild(textarea);',
        '',
        '            if (!success) {',
        '                throw new Error("复制到剪贴板失败");',
        '            }',
        '',
        '            alert("数据采集成功！\\n店铺名称：" + shopName + "\\n商品数量：" + products.length + "\\n\\n数据已复制到剪贴板，请返回竞店数据页面点击\\"保存数据\\"按钮导出Excel文件。");',
        '        }',
        '    } catch (err) {',
        '        console.error("数据采集或复制失败:", err);',
        '        alert("错误：" + err.message + "\\n请检查页面是否正确加载，或重试。");',
        '    }',
        '};'
    ].join('\n');

    // 初始化表格
    table.render({
        elem: '#shopTable',
        cols: [[
            {field: 'name', title: '商品名称', width: 300},
            {field: 'originalPrice', title: '原价', width: 100},
            {field: 'discountPrice', title: '活动价', width: 100},
            {field: 'monthlySales', title: '月销量', width: 100},
            {field: 'description', title: '商品描述'}
        ]],
        data: [],
        page: true,
        limit: 20,
        limits: [10, 20, 50, 100],
        text: {
            none: '暂无数据'
        }
    });

    // 开始采集按钮点击事件
    $('#startCollectCompetitor').on('click', function(){
        var statusBox = $('#competitorStatus');
        statusBox.removeClass().addClass('status-box info').html('正在打开美团外卖页面，请稍候...');
        
        // 打开美团外卖页面
        window.open('https://h5.waimai.meituan.com/', '_blank');
        
        // 显示操作指南弹窗
        layer.open({
            type: 1,
            title: '竞店数据采集指南',
            area: ['800px', '600px'],
            shadeClose: true,
            btn: ['关闭'],
            content: [
                '<div class="layui-card">',
                '    <div class="layui-card-body" style="height: 500px; overflow-y: auto; padding: 20px;">',
                '        <h3>请按以下步骤操作：</h3>',
                '        <ol style="line-height: 2;">',
                '            <li>在新打开的页面中登录美团外卖</li>',
                '            <li>导航到目标店铺页面</li>',
                '            <li>按F12打开开发者工具</li>',
                '            <li>切换到Console标签</li>',
                '            <li>复制以下代码并粘贴到Console中：</li>',
                '            <div style="position: relative; background: #f5f5f5; padding: 10px; margin: 10px 0;">',
                '                <button type="button" class="layui-btn layui-btn-normal" id="copyCodeBtn" style="position: absolute; top: 10px; right: 10px;">复制代码</button>',
                '                <pre style="margin-top: 40px; white-space: pre-wrap; word-break: break-all; max-height: 300px; overflow-y: auto;">' + competitorCode + '</pre>',
                '            </div>',
                '            <li>按回车执行代码</li>',
                '            <li>等待页面右上角出现"采集竞店数据"按钮</li>',
                '            <li>点击"采集竞店数据"按钮开始采集</li>',
                '            <li>采集完成后返回此页面点击"保存数据"按钮导出Excel</li>',
                '        </ol>',
                '    </div>',
                '</div>'
            ].join(''),
            success: function(layero, index){
                layero.find('#copyCodeBtn').on('click', function(){
                    var textarea = document.createElement('textarea');
                    textarea.value = competitorCode;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        layer.msg('代码已复制到剪贴板');
                    } catch (err) {
                        layer.msg('复制失败，请手动复制');
                    }
                    document.body.removeChild(textarea);
                });
            }
        });
        
        // 更新状态提示
        statusBox.removeClass().addClass('status-box info').html('已打开美团外卖页面，请按照弹窗提示进行操作');
    });

    // 保存数据按钮点击事件
    $('#saveCompetitorData').on('click', async function(){
        try {
            // 使用 Clipboard API 读取剪贴板数据
            const clipboardData = await navigator.clipboard.readText();
            console.log("从剪贴板获取的数据:", clipboardData);
            
            if(!clipboardData) {
                layer.msg('暂无数据可保存，请先采集数据');
                return;
            }

            var data = JSON.parse(clipboardData);
            console.log("解析后的数据:", data);
            
            if(!data || !data.products || data.products.length === 0){
                layer.msg('数据格式错误或为空，请重新采集');
                return;
            }

            // 更新表格数据
            table.reload('shopTable', {
                data: data.products
            });

            // 创建工作簿
            var wb = XLSX.utils.book_new();
            
            // 商品信息sheet
            var productsData = [
                ["商品名称", "原价", "活动价", "月销量", "商品描述"]
            ];
            
            data.products.forEach(product => {
                productsData.push([
                    product.name,
                    product.originalPrice,
                    product.discountPrice,
                    product.monthlySales,
                    product.description
                ]);
            });
            var productsSheet = XLSX.utils.aoa_to_sheet(productsData);
            XLSX.utils.book_append_sheet(wb, productsSheet, "商品信息");
            
            // 生成文件名
            var fileName = data.shopName + '竞店数据.xlsx';
            
            // 保存文件
            XLSX.writeFile(wb, fileName);
            
            layer.msg('数据已保存到：' + fileName);
        } catch (err) {
            console.error("处理数据时出错:", err);
            layer.msg('处理数据时出错，请查看控制台输出');
        }
    });
}); 