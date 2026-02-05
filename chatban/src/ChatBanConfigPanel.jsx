// ChatBanConfigPanel.jsx
import React, { useState } from 'react';
import '@shared/BoibyUI.css';

const ChatBanConfigPanel = ({ onConfigChange }) => {
  const [duration, setDuration] = useState('1day');
  const [reason, setReason] = useState('Other');
  const [chatItems, setChatItems] = useState(['test item 492krgmjkfgjk']);
  const [newItemText, setNewItemText] = useState('');

  const durations = [
    { value: 'warning', label: 'Warning' },
    { value: '5min', label: '5 Minutes' },
    { value: '10min', label: '10 Minutes' },
    { value: '20min', label: '20 Minutes' },
    { value: '1hour', label: '1 Hour' },
    { value: '1day', label: '1 Day' },
    { value: '3days', label: '3 Days' }
  ];

  const reasons = [
    'Other',
    'Spam',
    'Harassment.V2',
    'DiscriminationHate.V2',
    'PoliticalContent.V2',
    'ExtortionThreats.V2',
    'DirectingUsersOffPlatform',
    'Swearing'
  ];

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setDuration(newDuration);
    onConfigChange({ duration: newDuration, reason, chatItems });
  };

  const handleReasonChange = (e) => {
    const newReason = e.target.value;
    setReason(newReason);
    onConfigChange({ duration, reason: newReason, chatItems });
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItems = [...chatItems, newItemText];
      setChatItems(newItems);
      setNewItemText('');
      onConfigChange({ duration, reason, chatItems: newItems });
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = chatItems.filter((_, i) => i !== index);
    setChatItems(newItems);
    onConfigChange({ duration, reason, chatItems: newItems });
  };

  return (
    <div className="card-primary padding-large border-thin-subtle radius-large" style={{ width: '350px', height: '100vh', overflowY: 'auto' }}>
      <h2 className="font-xlarge mb-large">Chat Ban Configuration</h2>
      
      <div className="mb-large">
        <label className="label text-700 font-normal mb-small" style={{ display: 'block' }}>
          Duration
        </label>
        <select 
          className="w-full p-small border-thin-subtle radius-small"
          value={duration}
          onChange={handleDurationChange}
        >
          {durations.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-large">
        <label className="label text-700 font-normal mb-small" style={{ display: 'block' }}>
          Reason
        </label>
        <select 
          className="w-full p-small border-thin-subtle radius-small"
          value={reason}
          onChange={handleReasonChange}
        >
          {reasons.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="mb-large">
        <label className="label text-700 font-normal mb-small" style={{ display: 'block' }}>
          Chat Items
        </label>
        <div className="card-secondary p-medium radius-small border-thin-subtle mb-small">
          {chatItems.map((item, index) => (
            <div key={index} className="mb-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p className="text-normal font-normal" style={{ flex: 1, margin: 0 }}>
                {item}
              </p>
              <button 
                className="btn btn-secondary btn-h-small"
                onClick={() => handleRemoveItem(index)}
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="p-small border-thin-subtle radius-small"
            style={{ flex: 1 }}
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new chat item..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <button 
            className="btn btn-emphasis btn-h-small"
            onClick={handleAddItem}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBanConfigPanel;