    const handleImageFile = (file) => {
        if (!file.type.startsWith("image/")) {
            message.error("请上传图片文件");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            message.error("图片大小不能超过5MB");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        setImageUploading(true);
        http.post("/upload/image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json"
            },
            transformRequest: [(data) => data],
            timeout: 30000
        })
        .then(response => {
            if (response.data.success) {
                const imageUrl = response.data.url;
                // 从返回的URL中提取路径部分
                const imagePath = imageUrl.split("/uploads/")[1];
                // 获取基础URL，如果环境变量未定义则使用默认值
                const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
                // 构建完整URL
                const fullImageUrl = baseUrl + "/uploads/" + imagePath;
                setInputValue(prev => prev + "\n![image](" + fullImageUrl + ")");
                message.success("图片上传成功");
            } else {
                throw new Error(response.data.message || "上传失败");
            }
        })
        .catch(error => {
            message.error(error.response?.data?.message || "图片上传失败，请重试");
        })
        .finally(() => {
            setImageUploading(false);
        });
    };
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

