import React from 'react';

const RadioGroup = ({ options, selected, onChange }) => (
  <div className="flex justify-center space-x-8 text-lg font-semibold text-indigo-800">
    {options.map(opt => (
      <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          value={opt.value}
          checked={selected === opt.value}
          onChange={() => onChange(opt.value)}
          className="accent-indigo-700"
        />
        <span>{opt.label}</span>
      </label>
    ))}
  </div>
);

export default RadioGroup;
