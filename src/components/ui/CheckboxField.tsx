
import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  className = ""
}) => {
  return (
    <div className={`box-border flex items-center gap-[15px] m-0 p-0 ${className}`}>
      <div 
        className={`box-border w-6 h-6 border cursor-pointer m-0 p-0 rounded-[5px] border-solid transition-all duration-200 flex items-center justify-center ${
          checked 
            ? 'bg-transparent border-green-500' 
            : 'border-input-border hover:border-green-400'
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <Check className="w-4 h-4 text-green-500" />
        )}
      </div>
      <div className="box-border text-text-primary text-[17px] font-normal whitespace-nowrap m-0 p-0">
        {label}
      </div>
    </div>
  );
};
