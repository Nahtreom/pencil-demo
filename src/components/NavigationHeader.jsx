import React from 'react';
import './NavigationHeader.css';

function NavigationHeader() {
  return (
    <div className="nav-header">
      <div className="nav-tabs">
        <div className="nav-tab">文件</div>
        <div className="nav-tab">插入</div>
        <div className="nav-tab">共享</div>
        <div className="nav-tab">协作</div>
      </div>
    </div>
  );
}

export default NavigationHeader; 