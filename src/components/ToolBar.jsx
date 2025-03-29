import React from 'react';
import './ToolBar.css';

function ToolBar({ currentTool, setCurrentTool }) {
  const tools = [
    { id: 'select', name: '选择', icon: '⊙' },
    { id: 'ruler', name: '标尺', icon: '◢' },
    { id: 'zoom', name: '缩放', icon: '⊕' },
    { id: 'stroke', name: '粗细', icon: '≡' },
    { id: 'pressure', name: '压感', icon: '✎' },
    { id: 'eraser', name: '橡皮擦', icon: '⌫' }
  ];

  return (
    <div className="toolbar">
      {tools.map(tool => (
        <div 
          key={tool.id}
          className={`tool-item ${currentTool === tool.id ? 'selected' : ''}`}
          onClick={() => setCurrentTool(tool.id)}
        >
          <div className="tool-icon">{tool.icon}</div>
          <div className="tool-name">{tool.name}</div>
        </div>
      ))}
      <div className="toolbar-footer">
        <div className="footer-icon">👤</div>
        <div className="footer-icon">⚙️</div>
      </div>
    </div>
  );
}

export default ToolBar; 