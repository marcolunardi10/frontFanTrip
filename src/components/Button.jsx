import React from 'react';

const Button = ({ children, onClick, variant = 'primary' }) => {
  const base = "px-6 py-3 rounded font-semibold shadow-md";
  const styles = {
    primary: "bg-indigo-800 text-white hover:bg-indigo-900",
    secondary: "bg-gray-400 text-black hover:bg-gray-500",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
};

export default Button;
