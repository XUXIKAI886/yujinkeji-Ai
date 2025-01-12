/* global layui, echarts, XLSX, Papa, layer, html2canvas */

// 图表实例对象
const charts = {
    rating: null,
    sales: null,
    minPrice: null,
    deliveryFee: null,
    deliveryTime: null,
    wordCloud: null
};

// 初始化函数
function init() {
    // 初始化所有图表实例
    charts.rating = echarts.init(document.getElementById('ratingChart'));
    charts.sales = echarts.init(document.getElementById('salesChart'));
    charts.minPrice = echarts.init(document.getElementById('minPriceChart'));
    charts.deliveryFee = echarts.init(document.getElementById('deliveryFeeChart'));
    charts.deliveryTime = echarts.init(document.getElementById('deliveryTimeChart'));
    charts.wordCloud = echarts.init(document.getElementById('wordCloudChart'));

    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => chart.resize());
    });

    // 添加初始化按钮点击事件
    document.getElementById('resetBtn').addEventListener('click', function() {
        // 清空所有图表
        Object.values(charts).forEach(chart => {
            chart.clear();
        });
        // 提示用户
        layer.msg('图表已初始化');
    });
}

// 初始化Layui模块
layui.use(['upload', 'layer'], function() {
    const upload = layui.upload;
    const layer = layui.layer;

    // 文件上传配置
    upload.render({
        elem: '#fileBtn',
        accept: 'file',
        exts: 'xlsx|xls|csv',
        auto: false,
        choose: function(obj) {
            obj.preview(function(index, file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        if (file.name.toLowerCase().endsWith('.csv')) {
                            // 处理CSV文件
                            const text = e.target.result;
                            Papa.parse(text, {
                                header: true,
                                skipEmptyLines: true,
                                complete: function(results) {
                                    if (results.errors.length > 0) {
                                        layer.msg('CSV文件解析失败，请检查文件格式');
                                        return;
                                    }
                                    if (results.data.length === 0) {
                                        layer.msg('CSV文件中没有数据');
                                        return;
                                    }
                                    
                                    // 检查必要的列是否存在
                                    const requiredColumns = ['店铺名', '评分', '月售', '起送', '配送费', '配送时间'];
                                    const missingColumns = requiredColumns.filter(col => !results.data[0].hasOwnProperty(col));
                                    
                                    if (missingColumns.length > 0) {
                                        layer.msg(`CSV文件缺少必要的列: ${missingColumns.join(', ')}`);
                                        return;
                                    }

                                    analyzeData(results.data);
                                    layer.msg('数据分析完成');
                                },
                                error: function(error) {
                                    layer.msg('CSV文件解析失败：' + error.message);
                                }
                            });
                        } else {
                            // 处理Excel文件
                            const data = new Uint8Array(e.target.result);
                            const workbook = XLSX.read(data, { type: 'array' });
                            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                            
                            if (jsonData.length === 0) {
                                layer.msg('Excel文件中没有数据');
                                return;
                            }

                            // 检查必要的列是否存在
                            const requiredColumns = ['店铺名', '评分', '月售', '起送', '配送费', '配送时间'];
                            const missingColumns = requiredColumns.filter(col => !jsonData[0].hasOwnProperty(col));
                            
                            if (missingColumns.length > 0) {
                                layer.msg(`Excel文件缺少必要的列: ${missingColumns.join(', ')}`);
                                return;
                            }

                            analyzeData(jsonData);
                            layer.msg('数据分析完成');
                        }
                    } catch (error) {
                        console.error('文件解析失败:', error);
                        layer.msg('文件解析失败，请检查文件格式是否正确');
                    }
                };
                
                if (file.name.toLowerCase().endsWith('.csv')) {
                    reader.readAsText(file, 'UTF-8');
                } else {
                    reader.readAsArrayBuffer(file);
                }
            });
        }
    });

    // 导出图表按钮点击事件
    document.getElementById('exportBtn').addEventListener('click', function() {
        layer.load(1, { shade: [0.3, '#fff'] });
        
        // 创建临时容器，设置更大的宽度和适当的高度
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.background = '#fff';
        container.style.width = '2000px';
        container.style.padding = '40px';
        document.body.appendChild(container);

        // 创建标题
        const title = document.createElement('h2');
        title.style.textAlign = 'center';
        title.style.margin = '20px 0 40px';
        title.style.fontSize = '28px';
        title.innerText = '商圈数据分析图表';
        container.appendChild(title);

        // 创建图表网格布局容器
        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        gridContainer.style.gap = '40px';
        container.appendChild(gridContainer);

        // 获取所有图表容器
        const chartContainers = document.querySelectorAll('.chart-area');
        const chartPromises = [];

        // 为每个图表创建新的容器并重新渲染
        chartContainers.forEach((chartContainer, index) => {
            const newContainer = document.createElement('div');
            newContainer.style.width = '900px';
            newContainer.style.height = '500px';
            gridContainer.appendChild(newContainer);

            // 获取原始图表实例并复制配置
            const chartId = chartContainer.getAttribute('id');
            const originalChart = echarts.getInstanceByDom(document.getElementById(chartId));
            const newChart = echarts.init(newContainer);
            const option = originalChart.getOption();
            
            // 调整图表配置以适应导出
            if (option.grid) {
                option.grid.containLabel = true;
                option.grid.left = '10%';
                option.grid.right = '10%';
            }
            
            newChart.setOption(option);
            
            // 等待图表渲染完成
            chartPromises.push(new Promise(resolve => {
                setTimeout(() => {
                    newChart.resize();
                    resolve(newChart);
                }, 200);
            }));
        });

        // 等待所有图表渲染完成后导出
        Promise.all(chartPromises).then(() => {
            setTimeout(() => {
                html2canvas(container, {
                    backgroundColor: '#fff',
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: true
                }).then(canvas => {
                    // 转换为图片并下载
                    const link = document.createElement('a');
                    link.download = '商圈数据分析图表.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    
                    // 清理临时元素
                    document.body.removeChild(container);
                    layer.closeAll('loading');
                    layer.msg('导出成功');
                }).catch(error => {
                    console.error('导出图表失败:', error);
                    layer.closeAll('loading');
                    layer.msg('导出失败，请重试');
                });
            }, 500);
        });
    });
});

// 数据分析和图表更新函数
function analyzeData(data) {
    // 更新所有图表
    updateRatingChart(data);
    updateSalesChart(data);
    updateMinPriceChart(data);
    updateDeliveryFeeChart(data);
    updateDeliveryTimeChart(data);
    updateWordCloud(data);
    updateRadarChart(data);
}

// 更新店铺评分图表
function updateRatingChart(data) {
    // 提取店铺名和评分数据
    const shopData = data.map(item => ({
        name: item.店铺名,
        rating: parseFloat(item.评分) || 0
    }))
    .sort((a, b) => b.rating - a.rating); // 按评分从高到低排序

    charts.rating.setOption({
        title: { 
            text: '店铺评分分布',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = params[0];
                return `${data.name}<br/>评分: ${data.value}`;
            }
        },
        grid: {
            top: '10%',
            left: '5%',
            right: '5%',
            bottom: '15%',
            containLabel: true,
            height: '100%' // 增加图表主体的高度到100%
        },
        xAxis: {
            type: 'category',
            name: '店铺名称',
            nameLocation: 'middle',
            nameGap: 35,
            data: shopData.map(item => item.name),
            axisLabel: {
                interval: 0,
                rotate: 45,
                textStyle: {
                    fontSize: 12
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '评分',
            nameLocation: 'middle',
            nameGap: 40,
            min: 0,
            max: 5,
            interval: 0.5,
            axisLabel: {
                fontSize: 12
            }
        },
        series: [{
            type: 'bar',
            data: shopData.map(item => item.rating),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ffd85c' },
                    { offset: 0.5, color: '#ff9f45' },
                    { offset: 1, color: '#ff7676' }
                ])
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#ffc72c' },
                        { offset: 0.7, color: '#ff8c25' },
                        { offset: 1, color: '#ff5555' }
                    ])
                }
            },
            barWidth: '60%'
        }]
    });
}

// 更新月售分布图表
function updateSalesChart(data) {
    // 提取月售数据并转换为数值
    const sales = data.map(item => {
        const match = String(item.月售).match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    });

    // 定义更细致的区间
    const intervals = [
        { min: 0, max: 200, label: '0-200' },
        { min: 200, max: 500, label: '200-500' },
        { min: 500, max: 1000, label: '500-1000' },
        { min: 1000, max: 2000, label: '1000-2000' },
        { min: 2000, max: 3000, label: '2000-3000' },
        { min: 3000, max: 4000, label: '3000-4000' },
        { min: 4000, max: 5000, label: '4000-5000' },
        { min: 5000, max: Infinity, label: '>5000' }
    ];

    // 计算每个区间的店铺数量
    const distribution = intervals.map(interval => {
        const count = sales.filter(value => 
            value >= interval.min && value < interval.max
        ).length;
        return {
            interval: interval.label,
            count: count
        };
    });

    charts.sales.setOption({
        title: { 
            text: '月售订单分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = params[0];
                return `月售区间: ${data.name}<br/>店铺数量: ${data.value}`;
            }
        },
        grid: {
            left: '10%',
            right: '5%',
            bottom: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '店铺数量',
            nameLocation: 'middle',
            nameGap: 30,
            axisLabel: {
                formatter: '{value}'
            }
        },
        yAxis: {
            type: 'category',
            name: '月售区间',
            nameLocation: 'middle',
            nameGap: 70,
            data: distribution.map(item => item.interval),
            axisLabel: {
                interval: 0
            }
        },
        series: [{
            type: 'bar',
            data: distribution.map(item => item.count),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                ])
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        { offset: 0, color: '#2378f7' },
                        { offset: 0.7, color: '#2378f7' },
                        { offset: 1, color: '#83bff6' }
                    ])
                }
            }
        }]
    });
}

// 更新起送价分布图表
function updateMinPriceChart(data) {
    const minPriceData = calculateDistribution(data.map(item => item.起送));
    const total = minPriceData.reduce((sum, item) => sum + item.count, 0);
    
    charts.minPrice.setOption({
        title: { 
            text: '起送价分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        series: [{
            name: '起送价',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c} ({d}%)',
                fontSize: 14
            },
            labelLine: {
                show: true,
                length: 15,
                length2: 10
            },
            data: minPriceData.map(item => ({
                value: item.count,
                name: item.range,
                percentage: ((item.count / total) * 100).toFixed(1) + '%'
            }))
        }]
    });
}

// 更新配送费分布图表
function updateDeliveryFeeChart(data) {
    const deliveryFeeData = calculateDistribution(data.map(item => item.配送费));
    
    charts.deliveryFee.setOption({
        title: { 
            text: '配送费分布',
            left: 'center'
        },
        tooltip: { 
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            left: '10%',
            right: '5%',
            bottom: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: deliveryFeeData.map(item => item.range),
            name: '配送费区间',
            nameLocation: 'middle',
            nameGap: 35,
            axisLabel: {
                interval: 0
            }
        },
        yAxis: { 
            type: 'value',
            name: '店铺数量',
            nameLocation: 'middle',
            nameGap: 40
        },
        series: [{
            type: 'line',
            smooth: true,
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgb(128, 255, 165)' },
                    { offset: 1, color: 'rgb(1, 191, 236)' }
                ])
            },
            emphasis: {
                focus: 'series'
            },
            data: deliveryFeeData.map(item => item.count)
        }]
    });
}

// 更新配送时间分布图表
function updateDeliveryTimeChart(data) {
    const times = data.map(item => {
        const match = item['配送时间'].match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    });

    const option = {
        title: {
            text: '配送时间分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['店铺数量'],
            bottom: '0%'
        },
        grid: {
            left: '10%',
            right: '5%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['0-20分钟', '20-30分钟', '30-40分钟', '40-50分钟', '>50分钟'],
            name: '配送时间区间',
            nameLocation: 'middle',
            nameGap: 35,
            axisLabel: {
                interval: 0
            }
        },
        yAxis: {
            type: 'value',
            name: '店铺数量',
            nameLocation: 'middle',
            nameGap: 40
        },
        series: [{
            name: '店铺数量',
            data: calculateTimeDistribution(times),
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff9a9e' },
                    { offset: 1, color: '#fad0c4' }
                ])
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{c}家',
                fontSize: 14,
                fontWeight: 'bold'
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#ff8a8e' },
                        { offset: 1, color: '#fac0b4' }
                    ])
                }
            }
        }]
    };

    charts.deliveryTime.setOption(option);
}

// 更新店铺名称词云图
function updateWordCloud(data) {
    // 分词并统计词频
    const wordFreq = {};
    data.forEach(item => {
        const shopName = item.店铺名;
        if (shopName && shopName.length > 0) {
            // 分词规则：按照常见分隔符分割
            const words = shopName.split(/[·•\s,，.。&()（）[\]【】]/g)
                .map(word => word.trim())
                .filter(word => word.length >= 2);
            
            // 进一步分词：提取2-4个字的词
            words.forEach(word => {
                for (let len = 2; len <= Math.min(4, word.length); len++) {
                    for (let i = 0; i <= word.length - len; i++) {
                        const subWord = word.substr(i, len);
                        if (subWord.length >= 2) {
                            wordFreq[subWord] = (wordFreq[subWord] || 0) + 1;
                        }
                    }
                }
            });
        }
    });

    // 过滤掉一些常见的无意义词
    const stopWords = ['餐饮', '店铺', '商家', '外卖', '专卖', '专营', '食品'];
    stopWords.forEach(word => delete wordFreq[word]);

    // 转换数据格式
    const wordCloudData = Object.entries(wordFreq)
        .map(([name, value]) => ({
            name,
            value,
            textStyle: {
                color: `rgb(${Math.round(Math.random() * 155 + 100)},${Math.round(Math.random() * 155 + 100)},${Math.round(Math.random() * 155 + 100)})`
            }
        }))
        .filter(item => item.value > 1) // 只显示出现次数大于1的词
        .sort((a, b) => b.value - a.value)
        .slice(0, 100);  // 只显示前100个高频词

    // 生成图例数据
    const legendData = wordCloudData.slice(0, 10).map(item => item.name);

    const option = {
        title: {
            text: '店铺名称词云',
            left: 'center'
        },
        tooltip: {
            show: true,
            formatter: function(params) {
                return `${params.name}: 出现${params.value}次`;
            }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: legendData,
            formatter: function(name) {
                const item = wordCloudData.find(d => d.name === name);
                return `${name} (${item.value}次)`;
            }
        },
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: '5%',
            top: 'center',
            width: '70%',
            height: '80%',
            sizeRange: [12, 50],
            rotationRange: [-45, 45],
            rotationStep: 5,
            gridSize: 8,
            drawOutOfBound: false,
            layoutAnimation: true,
            textStyle: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function () {
                    return 'rgb(' + [
                        Math.round(Math.random() * 155 + 100),
                        Math.round(Math.random() * 155 + 100),
                        Math.round(Math.random() * 155 + 100)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                focus: 'self',
                textStyle: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: wordCloudData
        }]
    };

    charts.wordCloud.setOption(option);
}

// 工具函数：计算数值分布
function calculateDistribution(data) {
    const values = data.map(val => {
        const match = String(val).match(/\d+(\.\d+)?/);
        return match ? parseFloat(match[0]) : 0;
    });

    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;
    const step = range / 4;

    const ranges = Array(5).fill().map((_, i) => {
        const start = min + i * step;
        const end = i === 4 ? max : min + (i + 1) * step;
        return {
            range: i === 4 ? `>${start.toFixed(0)}` : `${start.toFixed(0)}-${end.toFixed(0)}`,
            count: values.filter(v => i === 4 ? v > start : v >= start && v < end).length
        };
    });

    return ranges;
}

// 工具函数：计算配送时间分布
function calculateTimeDistribution(times) {
    const distribution = [0, 0, 0, 0, 0]; // [0-20, 20-30, 30-40, 40-50, >50]
    
    times.forEach(value => {
        if (value <= 20) distribution[0]++;
        else if (value <= 30) distribution[1]++;
        else if (value <= 40) distribution[2]++;
        else if (value <= 50) distribution[3]++;
        else distribution[4]++;
    });
    
    return distribution;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 

function updateRadarChart(data) {
    // 计算每个维度的平均值
    const dimensions = ['月售', '起送', '配送费', '评分', '配送时间'];
    const averages = dimensions.map(dim => {
        const values = data.map(item => {
            const val = String(item[dim]).match(/\d+(\.\d+)?/);
            return val ? parseFloat(val[0]) : 0;
        });
        return {
            name: dim,
            value: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
        };
    });

    const maxValues = dimensions.map(dim => {
        const values = data.map(item => {
            const val = String(item[dim]).match(/\d+(\.\d+)?/);
            return val ? parseFloat(val[0]) : 0;
        });
        return Math.max(...values);
    });

    charts.deliveryTime.setOption({
        title: { text: '多维度数据对比' },
        tooltip: { trigger: 'item' },
        radar: {
            indicator: dimensions.map((name, index) => ({
                name,
                max: maxValues[index]
            })),
            splitArea: {
                areaStyle: {
                    color: ['rgba(0,255,255,0.1)', 'rgba(0,255,255,0.2)',
                           'rgba(0,255,255,0.3)', 'rgba(0,255,255,0.4)',
                           'rgba(0,255,255,0.5)']
                }
            }
        },
        series: [{
            name: '店铺数据对比',
            type: 'radar',
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                    { offset: 0, color: 'rgba(0, 145, 234, 0.5)' },
                    { offset: 1, color: 'rgba(0, 145, 234, 0)' }
                ])
            },
            data: [{
                value: averages.map(item => item.value),
                name: '平均值',
                itemStyle: {
                    color: '#0091ea'
                },
                lineStyle: {
                    width: 2,
                    color: '#0091ea'
                }
            }]
        }]
    });
} 