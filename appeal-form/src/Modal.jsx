import React from 'react';

const Modal = ({ isOpen, onClose, title, children, confirmText = 'OK' }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-cover" onClick={onClose}></div>
      <div className="modal modal-centered w-400px padding-xlarge radius-large border-thin-subtle shadow-subtle">
        <h2 className="font-2xlarge mb-large text-header">{title}</h2>
        <div className="mb-xlarge text-normal">
          {children}
        </div>
        <div className="button-container justify-end mt-large gap-medium">
          <button 
            className="btn btn-emphasis btn-h-medium full-width" 
            onClick={onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;