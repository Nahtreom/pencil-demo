import React from 'react';
import './CharacterDisplay.css';

function CharacterDisplay() {
  // 生成9个练习格子
  const renderPracticeGrids = () => {
    return Array(8).fill().map((_, index) => (
      <div key={index} className="practice-grid">
        <div className="grid-lines">
          <div className="diagonal-line-1"></div>
          <div className="diagonal-line-2"></div>
          <div className="vertical-line"></div>
          <div className="horizontal-line"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="character-display">
      <div className="search-bar">
        <input type="text" placeholder="请输入示例文字" />
      </div>
      <div className="practice-grids-container">
        {renderPracticeGrids()}
      </div>
      <div className="instruction-box">
        <div className="instruction-content">
          <p>下一个字，请试着写</p>
          <div className="instruction-grid"></div>
          <button className="change-button">换一个</button>
        </div>
        <div className="character-avatar"></div>
      </div>
      <div className="generate-button">
        开始生成
      </div>
    </div>
  );
}

export default CharacterDisplay; 