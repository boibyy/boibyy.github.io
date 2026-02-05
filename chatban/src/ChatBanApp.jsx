// App.jsx
import React, { useState } from 'react';
import ChatBanModal from './ChatBanModal';
import ChatBanConfigPanel from './ChatBanConfigPanel';
import '@shared/BoibyUI.css';

const App = () => {
  const [config, setConfig] = useState({
    duration: '1day',
    reason: 'Other',
    chatItems: ['test item 492krgmjkfgjk']
  });

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
  };

  const handleReportMistake = () => {
    console.log('Report mistake clicked');
  };

  const handleOK = () => {
    console.log('OK clicked');
  };

  return (
    <div style={{ display: 'flex' }}>
      <ChatBanConfigPanel onConfigChange={handleConfigChange} />
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Overlay to prevent clicking outside */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998
        }} />
        <ChatBanModal
          duration={config.duration}
          reason={config.reason}
          chatItems={config.chatItems}
          onReportMistake={handleReportMistake}
          onOK={handleOK}
        />
      </div>
    </div>
  );
};

export default App;