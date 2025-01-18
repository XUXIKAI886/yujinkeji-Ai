document.addEventListener('DOMContentLoaded', function() {
    // 获取按钮元素
    const collectCategoryBtn = document.getElementById('collectCategoryBtn');
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');
    const collectSearchBtn = document.getElementById('collectSearchBtn');
    const saveSearchBtn = document.getElementById('saveSearchBtn');
    
    // 获取状态显示元素
    const categoryStatus = document.getElementById('categoryStatus');
    const searchStatus = document.getElementById('searchStatus');

    // 存储采集到的数据
    let categoryData = null;
    let searchData = null;

    // 采集分类店铺数据
    collectCategoryBtn.addEventListener('click', function() {
        // 打开美团外卖页面
        chrome.tabs.create({ url: 'https://h5.waimai.meituan.com/' }, function(tab) {
            categoryStatus.textContent = '请在新页面中登录并浏览到目标分类页面';
            // 向新页面注入content script
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
        });
    });

    // 保存分类数据
    saveCategoryBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "collectCategoryData"}, function(response) {
                if (response && response.data) {
                    categoryData = response.data;
                    // 使用 XLSX.js 生成并下载Excel文件
                    const worksheet = XLSX.utils.json_to_sheet(categoryData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "分类店铺数据");
                    
                    // 生成文件名（包含时间戳）
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const fileName = `分类店铺数据_${timestamp}.xlsx`;
                    
                    // 保存文件
                    XLSX.writeFile(workbook, fileName);
                    categoryStatus.textContent = '数据已保存到Excel文件';
                } else {
                    categoryStatus.textContent = '未能获取数据，请确保在正确的页面上';
                }
            });
        });
    });

    // 采集搜索店铺数据
    collectSearchBtn.addEventListener('click', function() {
        // 打开美团外卖页面
        chrome.tabs.create({ url: 'https://h5.waimai.meituan.com/' }, function(tab) {
            searchStatus.textContent = '请在新页面中登录并搜索目标店铺';
            // 向新页面注入content script
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
        });
    });

    // 保存搜索数据
    saveSearchBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "collectSearchData"}, function(response) {
                if (response && response.data) {
                    searchData = response.data;
                    // 使用 XLSX.js 生成并下载Excel文件
                    const worksheet = XLSX.utils.json_to_sheet(searchData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "搜索店铺数据");
                    
                    // 生成文件名（包含时间戳）
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const fileName = `搜索店铺数据_${timestamp}.xlsx`;
                    
                    // 保存文件
                    XLSX.writeFile(workbook, fileName);
                    searchStatus.textContent = '数据已保存到Excel文件';
                } else {
                    searchStatus.textContent = '未能获取数据，请确保在正确的页面上';
                }
            });
        });
    });
}); 