import React, { useState } from 'react';
import './App.css';
import ToolBar from './components/ToolBar';
import DrawingCanvas from './components/DrawingCanvas';
import CharacterDisplay from './components/CharacterDisplay';
import NavigationHeader from './components/NavigationHeader';

function App() {
  const [currentTool, setCurrentTool] = useState('pen');
  const [penType, setPenType] = useState(0);
  
  return (
    <div className="app-container">
      <NavigationHeader />
      <div className="main-content">
        <ToolBar currentTool={currentTool} setCurrentTool={setCurrentTool} />
        <div className="canvas-area">
          <div className="pen-selection">
            {[0, 1, 2, 3, 4].map((index) => (
              <div 
                key={index} 
                className={`pen-option ${penType === index ? 'selected' : ''}`}
                onClick={() => setPenType(index)}
              />
            ))}
          </div>
          <DrawingCanvas currentTool={currentTool} penType={penType} />
          <div className="canvas-pages">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="page-indicator" />
            ))}
          </div>
        </div>
        <CharacterDisplay />
      </div>
    </div>
  );
}

export default App; 