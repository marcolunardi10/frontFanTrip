import React from 'react';

const InputField = ({ label, type = "text", value, onChange, name, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded border-b-2 border-gray-500 bg-gray-100 focus:outline-none"
      {...props}
    />
  </div>
);

export default InputField;
