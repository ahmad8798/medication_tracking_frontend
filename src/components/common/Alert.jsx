import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const alertClasses = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700',
  };

  const iconClasses = {
    info: 'fas fa-info-circle text-blue-500',
    success: 'fas fa-check-circle text-green-500',
    warning: 'fas fa-exclamation-triangle text-yellow-500',
    error: 'fas fa-times-circle text-red-500',
  };

  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded-md flex justify-between items-center ${alertClasses[type]}`}
      role="alert"
    >
      <div className="flex items-center">
        <i className={`${iconClasses[type]} mr-2`}></i>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default Alert; 