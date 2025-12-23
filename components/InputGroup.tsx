
import React from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, icon }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
        <input
          type="number"
          id={name}
          name={name}
          value={value === 0 ? '' : value}
          onChange={onChange}
          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          placeholder="0"
        />
      </div>
    </div>
  );
};
