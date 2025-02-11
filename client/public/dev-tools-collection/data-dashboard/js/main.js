/* global $, echarts */
// 定义全局变量
let w;

$(function () {
    // 定义字体大小
    function placeholderPic() {
        w = document.documentElement.clientWidth / 80;
        document.documentElement.style.fontSize = w + 'px';
    }
    placeholderPic();

    // TOP5颜色循环
    function topColor() {
        const ele = $('.top5-content ul').children();
        const length = ele.length;
        let i = 1;
        setInterval(function () {
            $(ele[i]).find('.cicle').css({
                'background': 'url(./images/orange.png) no-repeat center',
                'backgroundSize': '100%'
            });
            $(ele[i]).find('.li-content').css({
                'background': 'url(./images/border2.png) no-repeat center',
                'backgroundSize': 'contain'
            });
            $(ele[i]).siblings().find('.cicle').css({
                'background': 'url(./images/green.png) no-repeat center',
                'backgroundSize': '100%'
            });
            $(ele[i]).siblings().find('.li-content').css({
                'background': 'url(./images/border.png) no-repeat center',
                'backgroundSize': 'contain'
            });
            i++;
            if (i === length) {
                i = 0;
            }
        }, 3000);
    }
    topColor();

    // 水波图 - 配送准时率和订单完成率
    function waterChart(ele, value, color) {
        const myChart = echarts.init(document.querySelector(ele));
        const chartOption = {
            series: [{
                color: color || ['#ffd700','#ffa500'],
                type: 'liquidFill',
                data: [value, value],
                radius: '90%',
                outline: {
                    show: false
                },
                backgroundStyle: {
                    color:'transparent',
                    borderColor: '#ffa500',
                    borderWidth: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    shadowBlur: 20
                },
                shape: 'circle',
                label: {
                    normal: {
                        position: ['50%', '50%'],
                        formatter: function () {
                            return (value * 100).toFixed(0) + '%';
                        },
                        textStyle: {
                            fontSize: 0.5 * w,
                            color: '#fff'
                        }
                    }
                }
            }]
        };
        myChart.setOption(chartOption);
    }
    waterChart('.chart1', 0.92, ['#ffd700','#ffa500']); // 配送准时率
    waterChart('.chart2', 0.95, ['#00ff00','#008000']); // 订单完成率

    // 餐品类别分析图表
    function draw(ele, val, con, max, color) {
        const chart = echarts.init(document.querySelector(ele));
        const value = val;
        const chartOption = {
            grid: {
                left: '20%',
                top: '0',
                right: '20%',
                bottom: '0'
            },
            xAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: [{
                type: "category",
                inverse: false,
                data: [],
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            }],
            series: [
                {
                    type: 'pictorialBar',
                    data: [value],
                    itemStyle: {
                        normal: {
                            color: color
                        }
                    },
                    symbolRepeat: 'fixed',
                    symbolClip: true,
                    symbolSize: [0.5 * w, w],
                    symbol: 'roundRect',
                    label: {
                        show: true,
                        position: 'left',
                        formatter: function () {
                            return con;
                        },
                        color: '#fff',
                        fontSize: 0.7 * w,
                    },
                    z: 1000
                },
                {
                    type: 'pictorialBar',
                    itemStyle: {
                        normal: {
                            color: '#193040'
                        }
                    },
                    data: [max],
                    animationDuration: 0,
                    symbolRepeat: 'fixed',
                    symbol: 'roundRect',
                    symbolSize: [0.5 * w, w],
                    label: {
                        show: true,
                        position: 'right',
                        formatter: function () {
                            return Math.floor(val * 100 / max) + '%';
                        },
                        color: '#fff',
                        fontSize: 0.7 * w,
                    }
                }
            ]
        };
        chart.setOption(chartOption);
    }
    draw('.shoeChart', 5256, '销量', 6000, '#ffa500');    // 主食类
    draw('.clothesChart', 3256, '销量', 4000, '#ffd700');  // 小吃类
    draw('.mzChart', 1256, '销量', 2000, '#00ff00');       // 饮品类

    // 订单趋势折线图
    function lineChart(ele) {
        const chart = echarts.init(document.querySelector(ele));

        const xdata = [];
        const dataArr = [];
        for (let i = 1; i < 30; i++) {
            xdata.push(i + '日');
            dataArr.push(Math.floor(Math.random() * 200 + 100));
        }

        const chartOption = {
            title: {
                text: '近30天订单趋势',
                textStyle: {
                    color: '#fff',
                    fontSize: 0.8 * w
                },
                left: 'center'
            },
            grid: {
                left: "5%",
                bottom: "5%",
                top: "15%",
                containLabel: true
            },
            xAxis: {
                type: "category",
                data: xdata,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: "#fff",
                        fontSize: 0.5 * w
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#ffffff30'
                    }
                }
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: '{b}<br/>订单量: {c}单'
            },
            yAxis: [{
                type: 'value',
                min: 0,
                max: 300,
                axisLabel: {
                    formatter: '{value}单',
                    textStyle: {
                        color: '#fff',
                        fontSize: 0.5 * w
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#ffffff30'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ffffff10'
                    }
                }
            }],
            series: [{
                name: '订单量',
                type: 'line',
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                itemStyle: {
                    color: '#ffd700'
                },
                lineStyle: {
                    color: '#ffa500',
                    width: 2
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(255, 165, 0, 0.3)'
                    }, {
                        offset: 1,
                        color: 'rgba(255, 165, 0, 0.1)'
                    }])
                },
                data: dataArr
            }]
        };
        chart.setOption(chartOption);
    }
    lineChart('.lineChart');

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 加载配置
        function loadDashboardConfig() {
            const config = JSON.parse(localStorage.getItem('dashboardConfig')) || {};
            
            // 如果没有配置，跳转到配置页面
            if (!config.title) {
                window.location.href = 'config.html';
                return;
            }
            
            // 更新页面标题
            document.title = config.title;
            document.querySelector('header h1 span').textContent = config.title;
            document.querySelector('header p span').textContent = config.subtitle || 'Data Dashboard Visualization Platform';
            
            // 更新TOP5数据
            document.querySelector('.top5-title span').textContent = config.top5_title || '热销商品TOP5';
            
            // 更新销售数据
            document.querySelector('.data1 p').textContent = config.yearly_orders || '0';
            document.querySelector('.data2 p').textContent = config.monthly_orders || '0';
            document.querySelector('.sum p').textContent = config.total_revenue || '0';
            
            // 更新运营指标
            document.querySelector('.cicle8 span').textContent = config.satisfaction_rate + '%' || '0%';
            document.querySelector('.cicle9 span').textContent = config.ontime_rate + '%' || '0%';
            
            // 初始化图表
            initCharts(config);
        }

        // 初始化图表
        function initCharts(config) {
            if (typeof echarts === 'undefined') {
                console.error('ECharts is not loaded');
                return;
            }

            // 水波图配置
            const liquidFillConfig = {
                series: [{
                    type: 'liquidFill',
                    data: [config.ontime_rate/100 || 0.92],
                    radius: '80%',
                    color: ['#294D99'],
                    backgroundStyle: {
                        color: '#fff'
                    },
                    label: {
                        normal: {
                            formatter: (config.ontime_rate || 92) + '%'
                        }
                    }
                }]
            };
            
            // 初始化水波图
            const chart1Container = document.querySelector('.chart1');
            const chart2Container = document.querySelector('.chart2');
            
            if (chart1Container && chart2Container) {
                const chart1 = echarts.init(chart1Container);
                const chart2 = echarts.init(chart2Container);
                chart1.setOption(liquidFillConfig);
                chart2.setOption(liquidFillConfig);
                
                // 自适应大小
                window.addEventListener('resize', function() {
                    chart1.resize();
                    chart2.resize();
                });
            }
        }

        // 初始化
        loadDashboardConfig();
    });
});