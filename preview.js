document.addEventListener('DOMContentLoaded', function() {
    const charsContainer = document.getElementById('charsContainer');
    const previewText = document.getElementById('previewText');
    const generatePreviewButton = document.getElementById('generatePreviewButton');
    const backButton = document.getElementById('backButton');
    const resultSection = document.getElementById('resultSection');
    const resultContainer = document.getElementById('resultContainer');
    const downloadButton = document.getElementById('downloadButton');
    
    // 从本地存储获取用户设计的字符和用户输入的文字
    const storedFontChars = localStorage.getItem('fontChars');
    const userInputText = localStorage.getItem('userInputText');
    let fontChars = [];
    
    if (storedFontChars) {
        fontChars = JSON.parse(storedFontChars);
        displayFontChars();
    } else {
        // 如果没有字符数据，返回首页
        alert('未找到字体数据，请返回重新设计。');
        window.location.href = 'index.html';
    }
    
    // 显示用户设计的字符
    function displayFontChars() {
        charsContainer.innerHTML = '';
        
        fontChars.forEach(char => {
            const charItem = document.createElement('div');
            charItem.className = 'char-item';
            
            const img = document.createElement('img');
            img.src = char.imageData;
            img.alt = char.char;
            
            charItem.appendChild(img);
            charsContainer.appendChild(charItem);
        });
    }
    
    // 生成预览按钮点击事件
    generatePreviewButton.addEventListener('click', function() {
        let text = previewText.value.trim();
        
        // 如果用户没有输入文字，但localStorage中有用户之前输入的文字，则使用它
        if (!text && userInputText) {
            text = userInputText;
            previewText.value = userInputText;
        }
        
        if (!text) {
            alert('请输入要预览的文字');
            return;
        }
        
        // 显示结果区域
        resultSection.style.display = 'block';
        
        // 在这里模拟生成预览结果
        // 实际应用中，这里可能会向服务器发送请求来生成预览
        simulatePreview(text);
        
        // 滚动到结果区域
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // 返回按钮点击事件
    backButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 下载按钮点击事件
    downloadButton.addEventListener('click', function() {
        alert('字体文件准备下载中，请稍候...');
        // 实际应用中，这里会提供字体文件下载
    });
    
    // 模拟预览生成
    function simulatePreview(text) {
        resultContainer.innerHTML = '';
        
        // 创建加载提示
        const loading = document.createElement('div');
        loading.textContent = '正在生成预览...';
        loading.style.textAlign = 'center';
        loading.style.padding = '20px';
        resultContainer.appendChild(loading);
        
        // 模拟加载延迟
        setTimeout(function() {
            // 在实际应用中，这里应该显示使用生成字体渲染的文本
            // 现在只是简单地使用原始文本
            resultContainer.innerHTML = '';
            
            const preview = document.createElement('div');
            preview.style.fontSize = '18px';
            preview.style.lineHeight = '1.8';
            
            // 把文本中的字符替换成图片（如果在fontChars中存在）
            const chars = text.split('');
            chars.forEach(c => {
                const match = fontChars.find(fc => fc.char === c);
                
                if (match) {
                    // 找到匹配的字符，使用对应的图片
                    const charImg = document.createElement('img');
                    charImg.src = match.imageData;
                    charImg.alt = c;
                    charImg.style.height = '24px';
                    charImg.style.verticalAlign = 'middle';
                    charImg.style.margin = '0 2px';
                    preview.appendChild(charImg);
                } else {
                    // 未找到匹配的字符，使用普通文本
                    const textNode = document.createTextNode(c);
                    preview.appendChild(textNode);
                }
            });
            
            resultContainer.appendChild(preview);
        }, 1500);
    }
    
    // 页面加载时，如果有用户输入的文字，默认填入文本框
    if (userInputText) {
        previewText.value = userInputText;
    }
}); 