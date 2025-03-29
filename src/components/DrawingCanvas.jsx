import React, { useRef, useEffect, useState } from 'react';
import './DrawingCanvas.css';

function DrawingCanvas({ currentTool, penType }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小为容器大小
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // 设置背景为网格
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid(ctx, canvas.width, canvas.height);
    
    setContext(ctx);
  }, []);

  const drawGrid = (ctx, width, height) => {
    const gridSize = 20;
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    // 画水平线
    for (let i = 0; i <= height; i += gridSize) {
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
    }
    
    // 画垂直线
    for (let i = 0; i <= width; i += gridSize) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
    }
    
    ctx.stroke();
  };

  const startDrawing = (e) => {
    if (currentTool !== 'select' && currentTool !== 'ruler' && currentTool !== 'zoom') {
      setIsDrawing(true);
      const { offsetX, offsetY } = getCoordinates(e);
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      
      // 根据笔类型设置线条样式
      setPenStyle(context, penType);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    
    if (currentTool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.arc(offsetX, offsetY, 10, 0, Math.PI * 2, false);
      context.fill();
    } else {
      context.globalCompositeOperation = 'source-over';
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e) => {
    if (e.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };

  const setPenStyle = (ctx, type) => {
    const penStyles = [
      { lineWidth: 2, color: 'black' },
      { lineWidth: 4, color: 'black' },
      { lineWidth: 6, color: 'black' },
      { lineWidth: 3, color: 'black' },
      { lineWidth: 1, color: 'black' }
    ];
    
    const style = penStyles[type] || penStyles[0];
    ctx.lineWidth = style.lineWidth;
    ctx.strokeStyle = style.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
}

export default DrawingCanvas; 