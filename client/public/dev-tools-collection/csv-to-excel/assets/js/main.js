/* global layui, Papa, XLSX */

// 当前数据状态
let currentData = null;
let layer = null;

// 检测文件编码
function detectEncoding(buffer) {
    // 检查是否包含 UTF-8 BOM
    if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        return 'UTF-8';
    }
    
    // 检查是否是 GB2312/GBK
    try {
        const gbkDecoder = new TextDecoder('gbk');
        gbkDecoder.decode(buffer);
        return 'GBK';
    } catch (e) {
        return 'UTF-8';
    }
}

// 初始化
layui.use(['layer', 'table'], function() {
    layer = layui.layer;
    const upload = layui.upload;
    
    // 文件上传配置
    upload.render({
        elem: '#uploadBtn',
        accept: 'file',
        exts: 'csv',
        auto: false,
        choose: function(obj) {
            obj.preview(function(index, file) {
                const reader = new FileReader();
                
                // 先读取文件的二进制内容
                const binaryReader = new FileReader();
                binaryReader.onload = function(e) {
                    const buffer = new Uint8Array(e.target.result);
                    const encoding = detectEncoding(buffer);
                    
                    // 使用检测到的编码重新读取文件
                    reader.onload = function(e) {
                        try {
                            // 解析CSV文件
                            Papa.parse(e.target.result, {
                                header: true,
                                skipEmptyLines: true,
                                encoding: encoding, // 设置编码
                                complete: function(results) {
                                    if (results.errors.length > 0) {
                                        layer.msg('CSV文件解析失败，请检查文件格式');
                                        return;
                                    }
                                    if (results.data.length === 0) {
                                        layer.msg('CSV文件中没有数据');
                                        return;
                                    }
                                    
                                    // 保存当前数据
                                    currentData = results.data;
                                    
                                    // 更新预览表格
                                    updatePreviewTable(results.data);
                                    
                                    // 启用转换按钮
                                    document.getElementById('convertBtn').disabled = false;
                                    
                                    layer.msg('文件解析成功');
                                },
                                error: function(error) {
                                    layer.msg('CSV文件解析失败：' + error.message);
                                }
                            });
                        } catch (error) {
                            layer.msg('文件处理失败：' + error.message);
                        }
                    };
                    
                    // 使用正确的编码读取文件
                    reader.readAsText(file, encoding);
                };
                
                binaryReader.readAsArrayBuffer(file);
            });
        }
    });
    
    // 转换按钮点击事件
    document.getElementById('convertBtn').addEventListener('click', function() {
        if (!currentData) {
            layer.msg('请先选择CSV文件');
            return;
        }
        
        try {
            // 创建工作簿
            const wb = XLSX.utils.book_new();
            
            // 创建工作表
            const ws = XLSX.utils.json_to_sheet(currentData);
            
            // 将工作表添加到工作簿
            XLSX.utils.book_append_sheet(wb, ws, "数据");
            
            // 生成文件名（包含时间戳）
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `转换结果_${timestamp}.xlsx`;
            
            // 保存文件
            XLSX.writeFile(wb, fileName);
            
            layer.msg('转换成功，文件已下载');
        } catch (error) {
            layer.msg('转换失败：' + error.message);
        }
    });
});

// 更新预览表格
function updatePreviewTable(data) {
    if (!data || data.length === 0) return;
    
    const table = document.getElementById('previewTable');
    const headers = Object.keys(data[0]);
    
    // 创建表头
    let thead = '<thead><tr>';
    headers.forEach(header => {
        thead += `<th>${header}</th>`;
    });
    thead += '</tr></thead>';
    
    // 创建表体（最多显示5行）
    let tbody = '<tbody>';
    data.slice(0, 5).forEach(row => {
        tbody += '<tr>';
        headers.forEach(header => {
            tbody += `<td>${row[header] || ''}</td>`;
        });
        tbody += '</tr>';
    });
    
    // 如果数据超过5行，添加提示信息
    if (data.length > 5) {
        tbody += `<tr><td colspan="${headers.length}" style="text-align: center;">共 ${data.length} 行数据，仅显示前 5 行</td></tr>`;
    }
    tbody += '</tbody>';
    
    table.innerHTML = thead + tbody;
}
