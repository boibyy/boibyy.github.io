// ChatBanModal.jsx
import React from 'react';
import '@shared/BoibyUI.css';
import ChatBanTranslations from './ChatBanTranslations.json';

const ChatBanButton = ({ onClick, variant = 'secondary', children, style }) => {
  return (
    <button 
      className={`btn btn-${variant} w-full btn-h-medium`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

const ChatBanModal = ({ duration, reason, chatItems = [], onReportMistake, onOK }) => {
  const getHeadingKey = () => {
    switch(duration) {
      case 'warning': return 'Heading.ChatBreaksRules.V2';
      case '5min': return 'Heading.ChatSuspended5Minutes';
      case '10min': return 'Heading.ChatSuspended10Minutes';
      case '20min': return 'Heading.ChatSuspended20Minutes';
      case '1hour': return 'Heading.ChatSuspended1Hour';
      case '1day': return 'Heading.ChatSuspended1Day';
      case '3days': return 'Heading.ChatSuspended3Days';
      default: return 'Heading.ChatBreaksRules.V2';
    }
  };

  const getDescriptionKey = () => {
    switch(duration) {
      case 'warning': return 'Description.ChatBreaksRulesWarning';
      case '3days': return 'Description.ChatSuspendedMultipleDays';
      case '1day': return 'Description.ChatSuspendedSingleDay';
      case '1hour': return 'Description.ChatSuspendedSingleHour';
      case '5min':
      case '10min':
      case '20min': return 'Description.ChatSuspendedMultipleMinutes';
      default: return 'Description.ChatBreaksRulesWarning';
    }
  };

  const getDurationValue = () => {
    switch(duration) {
      case '5min': return 5;
      case '10min': return 10;
      case '20min': return 20;
      case '3days': return 3;
      default: return null;
    }
  };

  const getReasonLabel = () => {
    const reasonKey = `Label.Reason.${reason}`;
    return ChatBanTranslations[reasonKey] || ChatBanTranslations['Label.Reason.Other'];
  };

  const heading = ChatBanTranslations[getHeadingKey()];
  const descriptionTemplate = ChatBanTranslations[getDescriptionKey()];
  const durationValue = getDurationValue();
  const description = durationValue 
    ? descriptionTemplate.replace('{{duration}}', durationValue)
    : descriptionTemplate;

  return (
    <div 
      className="modal modal-centered w-500px padding-xlarge radius-large border-thin-subtle shadow-heavy card-primary"
      id="modalBox"
      style={{ 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      }}
    >
      <h2 className="font-2xlarge mb-large">{heading}</h2>
      <p className="font-normal mb-xlarge">{description}</p>
      
      <div className="card-secondary radius-small mb-2xlarge p-medium border-thin-subtle w-full">
        {chatItems.map((item, index) => (
          <p 
            key={index}
            className={`text-normal font-normal ${index === chatItems.length - 1 ? 'mb-xsmall' : ''}`}
            id="item"
            style={{ marginBottom: index === chatItems.length - 1 ? undefined : '0px' }}
          >
            {item}
          </p>
        ))}
        
        <div className="separator mb-medium mt-medium"></div>
        
        <p className="label text-700 text-header font-normal" style={{ marginBottom: 0 }}>
          {ChatBanTranslations['Label.Reason']}
        </p>
        <p className="text-normal font-normal mb-xsmall">{getReasonLabel()}</p>
      </div>
      
      <div className="button-container w-full gap-medium">
        <ChatBanButton 
          variant="secondary"
          onClick={onReportMistake}
          style={{ width: '50%' }}
        >
          {ChatBanTranslations['Action.ReportMistake']}
        </ChatBanButton>
        <ChatBanButton 
          variant="emphasis"
          onClick={onOK}
          style={{ width: '50%' }}
        >
          {ChatBanTranslations['Action.OK']}
        </ChatBanButton>
      </div>
    </div>
  );
};

export default ChatBanModal;