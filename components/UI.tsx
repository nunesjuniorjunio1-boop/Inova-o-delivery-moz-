
import React from 'react';

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
}> = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 active:scale-95",
    secondary: "bg-green-600 text-white hover:bg-green-700 active:scale-95",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "orange" }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-600`}>
    {children}
  </span>
);
