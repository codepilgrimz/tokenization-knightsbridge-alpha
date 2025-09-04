
import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onChange,
  className = ""
}) => {
  return (
    <div className={`box-border flex gap-4 m-0 p-0 ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="box-border flex items-center gap-2 m-0 p-0">
          <div 
            className={`box-border w-4 h-4 border cursor-pointer m-0 p-0 rounded-full border-solid ${selectedValue === option.value ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}
            onClick={() => onChange(option.value)}
          >
            {selectedValue === option.value && (
              <div className="box-border w-full h-full flex items-center justify-center">
                <div className="box-border w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <div className="box-border text-white text-[14px] font-normal m-0 p-0">
            {option.label}
          </div>
        </div>
      ))}
    </div>
  );
};
