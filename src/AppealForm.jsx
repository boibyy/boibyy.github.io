import React, { useState, useRef, useEffect } from 'react';
import './BoibyUI.css';
import Modal from './Modal';
import Button from './Button';
import { useTranslation } from './useTranslation';

const AppealForm = () => {
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [decisionType, setDecisionType] = useState('');
  const [decisionTypeText, setDecisionTypeText] = useState(t('Placeholder.SelectDecisionType'));
  const [appealReason, setAppealReason] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  
  const dropdownRef = useRef(null);
  const displayRef = useRef(null);

  const decisionOptions = [
    { value: 'account', label: t('DecisionType.Account') },
    { value: 'alt-account', label: t('DecisionType.AltAccount') },
    { value: 'chat', label: t('DecisionType.Chat') },
    { value: 'voice-chat', label: t('DecisionType.VoiceChat') },
    { value: 'cheating', label: t('DecisionType.Cheating') },
    { value: 'experience', label: t('DecisionType.Experience') },
    { value: 'asset', label: t('DecisionType.Asset') },
    { value: 'billing', label: t('DecisionType.Billing') },
    { value: 'child-account', label: t('DecisionType.ChildAccount') },
    { value: 'avatar-profile', label: t('DecisionType.AvatarProfile') }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        displayRef.current &&
        !displayRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearError('email');
  };

  const handleConfirmEmailChange = (e) => {
    setConfirmEmail(e.target.value);
    clearError('confirmEmail');
  };

  const handleAppealReasonChange = (e) => {
    setAppealReason(e.target.value);
    clearError('appealReason');
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (value, label) => {
    setDecisionType(value);
    setDecisionTypeText(label);
    setIsDropdownOpen(false);
    clearError('decisionType');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    let isValid = true;

    // Validate email
    const emailValue = email.trim();
    if (!emailValue) {
      newErrors.email = t('Error.EmailRequired');
      isValid = false;
    } else if (!isValidEmail(emailValue)) {
      newErrors.email = t('Error.EmailInvalid');
      isValid = false;
    }

    // Validate confirm email
    const confirmEmailValue = confirmEmail.trim();
    if (!confirmEmailValue) {
      newErrors.confirmEmail = t('Error.ConfirmEmailRequired');
      isValid = false;
    } else if (!isValidEmail(confirmEmailValue)) {
      newErrors.confirmEmail = t('Error.ConfirmEmailInvalid');
      isValid = false;
    } else if (emailValue !== confirmEmailValue) {
      newErrors.confirmEmail = t('Error.EmailsDoNotMatch');
      isValid = false;
    }

    // Validate decision type
    if (!decisionType) {
      newErrors.decisionType = t('Error.DecisionTypeRequired');
      isValid = false;
    }

    // Validate appeal reason
    const reasonValue = appealReason.trim();
    if (!reasonValue) {
      newErrors.appealReason = t('Error.AppealReasonRequired');
      isValid = false;
    }

    setErrors(newErrors);

    // If valid, show modal and reset form
    if (isValid) {
      setShowModal(true);
      setEmail('');
      setConfirmEmail('');
      setDecisionType('');
      setDecisionTypeText(t('Placeholder.SelectDecisionType'));
      setAppealReason('');
    }
  };

  return (
    <>
      <style>{`
        body {
            padding: 40px 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-header);
        }
        
        .form-input,
        .form-select,
        .form-textarea {
            width: 100%;
            background: var(--bg-base);
            border: 1px solid var(--shadow-border);
            color: var(--text-normal);
            padding: 12px;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.2s;
            font-size: 14px;
        }
        
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
            border-color: var(--btn-purple);
            box-shadow: 0 0 0 2px rgba(115, 9, 228, 0.2);
        }
        
        .form-textarea {
            resize: vertical;
            min-height: 120px;
            font-family: 'Public Sans', sans-serif;
        }
        
        .char-counter {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
            text-align: right;
        }
        
        .error-message {
            color: var(--danger);
            font-size: 12px;
            margin-top: 4px;
        }
        
        .input-error {
            border-color: var(--danger) !important;
        }
        
        .custom-select-wrapper {
            position: relative;
            width: 100%;
        }
        
        .custom-select-display {
            width: 100%;
            background: var(--bg-base);
            border: 1px solid var(--shadow-border);
            color: var(--text-normal);
            padding: 12px;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.2s;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        
        .custom-select-display:hover {
            border-color: var(--btn-gray);
        }
        
        .custom-select-display:focus,
        .custom-select-display.active {
            border-color: var(--btn-purple);
            box-shadow: 0 0 0 2px rgba(115, 9, 228, 0.2);
        }
        
        .custom-select-arrow {
            color: var(--text-muted);
            transition: transform 0.2s;
            flex-shrink: 0;
        }
        
        .custom-select-display.active .custom-select-arrow {
            transform: rotate(180deg);
        }
        
        .custom-select-dropdown {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            right: 0;
            background: var(--bg-primary);
            border: 1px solid var(--shadow-border);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            z-index: 1000;
            max-height: 240px;
            overflow-y: auto;
            padding: 4px;
        }
        
        .custom-select-option {
            padding: 12px;
            cursor: pointer;
            border-radius: 6px;
            transition: background 0.15s;
            font-size: 14px;
            color: var(--text-normal);
        }
        
        .custom-select-option:hover {
            background: var(--btn-gray);
            color: var(--text-header);
        }
        
        .custom-select-option.selected {
            background: var(--btn-gray2);
            color: var(--text-header);
        }
        
        a {
            color: var(--link-purple);
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
      `}</style>

      <div className="container radius-medium p-2xlarge card-primary border-thin-subtle" style={{ maxWidth: '800px' }}>
        <h1 className="font-4xlarge mb-large text-header">{t('Heading.AppealDecision')}</h1>
        <p className="font-medium mb-huge text-normal">
          {t('Description.AppealInfo')}{' '}
          {t('Description.ViewViolations')} <a href="violations-appeals">{t('Link.ViolationsAppeals')}</a>.
          {' '}{t('Description.ReviewsBasedOn')} <a href="Boiby-Community-Standards">{t('Link.CommunityStandards')}</a>.
        </p>
        
        <form id="appealForm" onSubmit={handleSubmit}>
          <div className="form-group mb-2xlarge">
            <label className="form-label" htmlFor="email">{t('Label.EmailAddress')}</label>
            <input 
              type="email" 
              id="email" 
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder={t('Placeholder.Email')}
              value={email}
              onChange={handleEmailChange}
              required
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>
          
          <div className="form-group mb-2xlarge">
            <label className="form-label" htmlFor="confirmEmail">{t('Label.ConfirmEmail')}</label>
            <input 
              type="email" 
              id="confirmEmail" 
              className={`form-input ${errors.confirmEmail ? 'input-error' : ''}`}
              placeholder={t('Placeholder.Email')}
              value={confirmEmail}
              onChange={handleConfirmEmailChange}
              required
            />
            {errors.confirmEmail && (
              <div className="error-message">{errors.confirmEmail}</div>
            )}
          </div>
          
          <div className="form-group mb-2xlarge">
            <label className="form-label" htmlFor="decisionType">{t('Label.DecisionType')}</label>
            <div className="custom-select-wrapper">
              <div 
                ref={displayRef}
                className={`custom-select-display ${isDropdownOpen ? 'active' : ''}`}
                tabIndex="0"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
              >
                <span className={decisionType ? 'text-normal' : 'text-muted'}>
                  {decisionTypeText}
                </span>
                <svg className="custom-select-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {isDropdownOpen && (
                <div ref={dropdownRef} className="custom-select-dropdown">
                  {decisionOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`custom-select-option ${decisionType === option.value ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionSelect(option.value, option.label);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.decisionType && (
              <div className="error-message">{errors.decisionType}</div>
            )}
          </div>
          
          <div className="form-group mb-medium">
            <label className="form-label" htmlFor="appealReason">{t('Label.AppealReason')}</label>
            <textarea 
              id="appealReason" 
              className={`form-textarea ${errors.appealReason ? 'input-error' : ''}`}
              placeholder={t('Placeholder.AppealReason')}
              maxLength="1000"
              value={appealReason}
              onChange={handleAppealReasonChange}
              required
            />
            <div className="char-counter">
              {t('CharCounter.Format', { current: appealReason.length, max: 1000 })}
            </div>
            {errors.appealReason && (
              <div className="error-message">{errors.appealReason}</div>
            )}
          </div>

          <p className="font-normal text-muted mb-huge">
            {t('Confirmation.Text')}
          </p>
          
          <div className="flex justify-end mt-huge">
            <Button type="submit" variant="emphasis" size="medium">
              {t('Button.Send')}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t('Modal.AppealSent.Title')}
        confirmText={t('Button.OK')}
      >
        <p>
          {t('Modal.AppealSent.Message')}
        </p>
      </Modal>
    </>
  );
};

export default AppealForm;