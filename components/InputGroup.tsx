
import React from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  colorClass?: string;
  focusClass?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  icon, 
  colorClass = "text-gray-900",
  focusClass = "focus:ring-blue-500"
}) => {
  return (
    <div className="flex flex-col space-y-1 group">
      <label htmlFor={name} className="text-sm font-bold text-gray-500 flex items-center gap-2 group-focus-within:text-gray-700 transition-colors">
        {icon}
        {label}
      </label>
      <div className="relative">
        <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${colorClass} opacity-60`}>₹</span>
        <input
          type="number"
          id={name}
          name={name}
          value={value === 0 ? '' : value}
          onChange={onChange}
          className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${focusClass} focus:border-transparent focus:bg-white outline-none transition-all text-sm font-bold ${colorClass}`}
          placeholder="0"
        />
      </div>
    </div>
  );
};
