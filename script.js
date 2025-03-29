document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    const nextButton = document.getElementById('nextButton');
    const changeStyleButton = document.getElementById('changeStyle');
    const toolOptions = document.querySelectorAll('input[name="tool"]');
    const historyContainer = document.getElementById('historyContainer');
    const currentCharacterDisplay = document.getElementById('currentCharacter');
    const generateFontButton = document.getElementById('generateFontButton');
    const imageUpload = document.getElementById('imageUpload');
    
    // 获取模式选择元素
    const drawModeBtn = document.getElementById('drawMode');
    const uploadModeBtn = document.getElementById('uploadMode');
    const drawingInterface = document.getElementById('drawingInterface');
    const uploadInterface = document.getElementById('uploadInterface');

    // 批量上传界面元素
    const uploadArea = document.getElementById('uploadArea');
    const batchImageUpload = document.getElementById('batchImageUpload');
    const uploadPreviewContainer = document.getElementById('uploadPreviewContainer');
    const uploadPreviewImage = document.getElementById('uploadPreviewImage');
    const reuploadButton = document.getElementById('reuploadButton');
    const continueButton = document.getElementById('continueButton');
    const uploadProcessing = document.getElementById('uploadProcessing');
    const processingProgress = document.getElementById('processingProgress');
    const detectedCharsContainer = document.getElementById('detectedCharsContainer');
    const detectedChars = document.getElementById('detectedChars');
    const editCharsButton = document.getElementById('editCharsButton');
    const confirmCharsButton = document.getElementById('confirmCharsButton');
    
    // 引用新的DOM元素
    const fontGenerationContainer = document.getElementById('fontGenerationContainer');
    const fontResultContainer = document.getElementById('fontResultContainer');
    const fontPreviewBox = document.getElementById('fontPreviewBox');
    const downloadFontButton = document.getElementById('downloadFontButton');
    const restartButton = document.getElementById('restartButton');
    
    // 常用汉字库（这里仅包含一小部分示例）
    const commonChars = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞';
    
    // 当前显示的字符和历史字符
    let currentChar = '者';
    let historyChars = [];
    const requiredCharCount = 8; // 需要完成的字符数量
    
    // 设置画布大小
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // 绘制网格或参考线
        drawGuideLines();
    }
    
    // 初始化画布
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 绘制参考线
    function drawGuideLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 设置默认显示的汉字为浅灰色参考
        ctx.font = `${Math.min(canvas.width, canvas.height) * 0.7}px sans-serif`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentChar, canvas.width / 2, canvas.height / 2);
        currentCharacterDisplay.textContent = currentChar;
    }
    
    // 绘画变量
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // 画笔设置
    let lineWidth = parseInt(sizeSlider.value);
    let currentTool = 'pencil';
    
    // 更新笔触大小显示
    sizeSlider.addEventListener('input', function() {
        lineWidth = parseInt(this.value);
        sizeValue.textContent = lineWidth;
    });
    
    // 工具选择
    toolOptions.forEach(option => {
        option.addEventListener('change', function() {
            currentTool = this.value;
        });
    });
    
    // 绘画事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 触摸设备支持
    canvas.addEventListener('touchstart', handleTouch(startDrawing));
    canvas.addEventListener('touchmove', handleTouch(draw));
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
    
    function handleTouch(eventHandler) {
        return function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            eventHandler(mouseEvent);
        };
    }
    
    function startDrawing(e) {
        isDrawing = true;
        
        // 获取鼠标相对于画布的坐标
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        // 设置绘画样式
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = lineWidth;
        
        // 根据所选工具设置样式
        switch(currentTool) {
            case 'pencil':
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = '#000';
                break;
            case 'brush':
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = '#333';
                break;
            case 'marker':
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = '#000';
                break;
            case 'eraser':
                ctx.globalCompositeOperation = 'destination-out';
                break;
        }
        
        // 绘制线条
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        // 更新坐标
        lastX = currentX;
        lastY = currentY;
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    // 换一组风格按钮
    changeStyleButton.addEventListener('click', function() {
        // 在实际应用中，这里可能会向服务器请求新的风格
        alert('将加载新的字体风格...');
    });
    
    // 获取随机字符
    function getRandomChar() {
        const randomIndex = Math.floor(Math.random() * commonChars.length);
        return commonChars[randomIndex];
    }
    
    // 保存当前画布内容
    function saveCurrentCanvas() {
        if (hasDrawnContent()) {
            const dataURL = canvas.toDataURL('image/png');
            
            // 创建历史项
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            // 添加图片
            const img = document.createElement('img');
            img.src = dataURL;
            historyItem.appendChild(img);
            
            // 添加字符标签
            const label = document.createElement('div');
            label.className = 'character-label';
            label.textContent = currentChar;
            historyItem.appendChild(label);
            
            // 插入到历史容器的顶部
            if (historyContainer.firstChild) {
                historyContainer.insertBefore(historyItem, historyContainer.firstChild);
            } else {
                historyContainer.appendChild(historyItem);
            }
            
            // 保存到历史记录
            historyChars.push({
                char: currentChar,
                imageData: dataURL
            });
            
            // 检查是否已完成要求的字符数量
            checkCompletionStatus();
        }
    }
    
    // 检查画布是否有内容
    function hasDrawnContent() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 0; i < imageData.length; i += 4) {
            if (imageData[i + 3] > 20) { // 检查alpha通道
                return true;
            }
        }
        return false;
    }
    
    // 检查完成状态
    function checkCompletionStatus() {
        if (historyChars.length >= requiredCharCount) {
            // 启用生成字体按钮
            generateFontButton.disabled = false;
            
            // 禁用下一张按钮，避免继续添加超过要求的字符
            nextButton.disabled = true;
            nextButton.style.opacity = '0.5';
        }
    }
    
    // 下一张按钮
    nextButton.addEventListener('click', function() {
        // 保存当前画布内容
        saveCurrentCanvas();
        
        // 如果已达到所需数量，不再生成新字符
        if (historyChars.length >= requiredCharCount) {
            return;
        }
        
        // 生成新的随机字符
        let newChar = getRandomChar();
        // 确保不重复显示同一个字
        while (newChar === currentChar) {
            newChar = getRandomChar();
        }
        currentChar = newChar;
        
        // 清除画布准备下一个字
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGuideLines();
    });
    
    // 生成字体按钮点击事件
    generateFontButton.addEventListener('click', function() {
        // 保存字体数据到本地存储
        localStorage.setItem('fontChars', JSON.stringify(historyChars));
        
        // 跳转到字体预览页面
        window.location.href = 'preview.html';
    });
    
    // 模式切换
    drawModeBtn.addEventListener('click', function() {
        drawModeBtn.classList.add('active');
        uploadModeBtn.classList.remove('active');
        drawingInterface.style.display = 'flex';
        uploadInterface.style.display = 'none';
    });
    
    uploadModeBtn.addEventListener('click', function() {
        uploadModeBtn.classList.add('active');
        drawModeBtn.classList.remove('active');
        uploadInterface.style.display = 'block';
        drawingInterface.style.display = 'none';
    });

    // 上传区域点击触发文件选择
    uploadArea.addEventListener('click', function() {
        batchImageUpload.click();
    });

    // 处理拖放上传
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            batchImageUpload.files = e.dataTransfer.files;
            handleUploadedImage(e.dataTransfer.files[0]);
        }
    });

    // 批量图片上传处理
    batchImageUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            handleUploadedImage(e.target.files[0]);
        }
    });

    // 处理上传的图片
    function handleUploadedImage(file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            // 显示预览
            uploadPreviewImage.src = event.target.result;
            uploadArea.style.display = 'none';
            uploadPreviewContainer.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }

    // 重新上传按钮
    reuploadButton.addEventListener('click', function() {
        uploadPreviewContainer.style.display = 'none';
        uploadArea.style.display = 'block';
        batchImageUpload.value = '';
    });

    // 继续按钮 - 开始处理图片
    continueButton.addEventListener('click', function() {
        uploadPreviewContainer.style.display = 'none';
        uploadProcessing.style.display = 'block';
        
        // 模拟处理进度
        let progress = 0;
        const interval = setInterval(function() {
            progress += 5;
            processingProgress.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(function() {
                    uploadProcessing.style.display = 'none';
                    showDetectedChars();
                }, 500);
            }
        }, 200);
    });

    // 显示识别的汉字
    function showDetectedChars() {
        detectedCharsContainer.style.display = 'block';
        detectedChars.innerHTML = '';
        
        // 生成8个样例汉字（实际应用中这里会是OCR识别结果）
        const sampleChars = ['我', '爱', '中', '国', '汉', '字', '设', '计'];
        
        sampleChars.forEach(char => {
            const charItem = document.createElement('div');
            charItem.className = 'detected-char-item';
            charItem.textContent = char;
            detectedChars.appendChild(charItem);
        });
    }

    // 返回重新上传按钮
    document.getElementById('backButton').addEventListener('click', function() {
        detectedCharsContainer.style.display = 'none';
        uploadArea.style.display = 'block';
        batchImageUpload.value = '';
    });

    // 确认并生成字体按钮
    confirmCharsButton.addEventListener('click', function() {
        // 获取用户输入的文字
        const userText = document.getElementById('userInputText').value.trim();
        
        if (!userText) {
            alert('请输入您希望生成的汉字');
            return;
        }
        
        // 隐藏当前界面，显示加载动画
        detectedCharsContainer.style.display = 'none';
        fontGenerationContainer.style.display = 'block';
        
        // 添加处理进度文本
        const processingText = document.createElement('p');
        processingText.className = 'processing-text';
        processingText.style.marginTop = '15px';
        fontGenerationContainer.appendChild(processingText);
        
        // 使用固定的8个字符（在实际应用中这里会是识别结果）
        const sampleChars = ['我', '爱', '中', '国', '汉', '字', '设', '计'];
        
        // 模拟较长的字体生成过程，显示进度
        let progress = 0;
        const stages = [
            "正在分析您的字体特征...",
            "正在提取书写风格...",
            "正在应用字体样式...",
            "正在生成矢量字形...",
            "正在优化字体效果...",
            "最终处理中..."
        ];
        
        processingText.textContent = stages[0];
        
        const interval = setInterval(function() {
            progress += 1;
            
            // 更新处理阶段文本
            if (progress % 16 === 0 && progress < 96) {
                const stageIndex = Math.floor(progress / 16);
                processingText.textContent = stages[stageIndex];
            }
            
            // 完成处理
            if (progress >= 100) {
                clearInterval(interval);
                
                // 最后再等待一点时间，增强完成感
                setTimeout(function() {
                    // 隐藏加载界面，显示结果
                    fontGenerationContainer.style.display = 'none';
                    fontResultContainer.style.display = 'block';
                    
                    // 显示预览效果
                    renderFontPreview(userText, sampleChars, uploadPreviewImage.src);
                }, 800);
            }
        }, 100); // 每100毫秒更新一次，总共大约需要10秒钟
    });

    // 渲染字体预览
    function renderFontPreview(text, chars, imageData) {
        fontPreviewBox.innerHTML = '';
        
        // 创建图片元素显示预设的图片
        const preview = document.createElement('img');
        preview.src = '我爱武汉大学.jpg';  // 使用当前文件夹下的图片
        preview.alt = '字体预览效果';
        preview.style.maxWidth = '100%';
        preview.style.display = 'block';
        preview.style.margin = '0 auto';
        
        // 添加一些提示文字
        const hint = document.createElement('p');
        hint.style.fontSize = '14px';
        hint.style.color = '#777';
        hint.style.marginTop = '15px';
        hint.innerHTML = '以上是使用您的字体风格生成的文字效果。';
        
        fontPreviewBox.appendChild(preview);
        fontPreviewBox.appendChild(hint);
    }

    // 下载字体按钮
    downloadFontButton.addEventListener('click', function() {
        alert('您的专属字体正在准备下载，请稍候...');
        // 在实际应用中，这里会提供真实的字体文件下载
    });

    // 重新开始按钮
    restartButton.addEventListener('click', function() {
        // 重置界面状态
        fontResultContainer.style.display = 'none';
        uploadArea.style.display = 'block';
        batchImageUpload.value = '';
    });

    // 初始化
    drawGuideLines();
}); 