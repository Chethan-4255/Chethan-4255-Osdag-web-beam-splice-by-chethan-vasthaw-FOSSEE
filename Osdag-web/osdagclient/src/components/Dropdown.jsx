import React from 'react';

// Simple reusable dropdown component
const Dropdown = ({ label, name, value, options, onChange }) => {
  return (
    <div className="form-row">
      <label htmlFor={name}>{label}:</label>
      <select id={name} name={name} value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown; 