/* global chrome */

    // 监听来自popup的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "collectCategoryData") {
        const data = collectCategoryData();
        sendResponse({ data: data });
    } else if (request.action === "collectSearchData") {
        const data = collectSearchData();
        sendResponse({ data: data });
            }
            return true; // 保持消息通道开启
    });

// 采集分类页面的店铺数据
function collectCategoryData() {
    const shops = [];
    // 获取所有店铺卡片元素
    const shopCards = document.querySelectorAll('.shoplist-item');
    
    shopCards.forEach(card => {
        const shop = {
            name: getTextContent(card, '.shop-name'),
            rating: getTextContent(card, '.shop-rating'),
            monthSales: getTextContent(card, '.shop-sales'),
            startingPrice: getTextContent(card, '.shop-min-price'),
            deliveryFee: getTextContent(card, '.shop-delivery-fee'),
            deliveryTime: getTextContent(card, '.shop-delivery-time'),
            address: getTextContent(card, '.shop-address'),
            categories: getTextContent(card, '.shop-categories'),
            distance: getTextContent(card, '.shop-distance')
        };
        shops.push(shop);
    });

    return shops;
}

// 采集搜索页面的店铺数据
function collectSearchData() {
    const shops = [];
    // 获取所有搜索结果店铺卡片元素
    const shopCards = document.querySelectorAll('.search-result-item');
    
    shopCards.forEach(card => {
        const shop = {
            name: getTextContent(card, '.shop-name'),
            rating: getTextContent(card, '.shop-rating'),
            monthSales: getTextContent(card, '.shop-sales'),
            startingPrice: getTextContent(card, '.shop-min-price'),
            deliveryFee: getTextContent(card, '.shop-delivery-fee'),
            deliveryTime: getTextContent(card, '.shop-delivery-time'),
            address: getTextContent(card, '.shop-address'),
            categories: getTextContent(card, '.shop-categories'),
            distance: getTextContent(card, '.shop-distance'),
            promotions: getPromotions(card)
        };
        shops.push(shop);
    });

    return shops;
}

// 获取元素文本内容的辅助函数
function getTextContent(parent, selector) {
    const element = parent.querySelector(selector);
    return element ? element.textContent.trim() : '';
}

// 获取店铺促销信息
function getPromotions(card) {
    const promotionElements = card.querySelectorAll('.promotion-item');
    return Array.from(promotionElements).map(el => el.textContent.trim()).join('; ');
} 