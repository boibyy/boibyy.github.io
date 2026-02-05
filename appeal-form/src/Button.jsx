import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'emphasis', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = ''
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-h-${size}`;
  const widthClass = fullWidth ? 'full-width' : '';
  
  const classes = [baseClass, variantClass, sizeClass, widthClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button 
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;