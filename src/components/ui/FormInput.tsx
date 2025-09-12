
import React from 'react';

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  className = ""
}) => {
  return (
    <div className={`box-border flex flex-col m-0 p-0 ${className}`}>
      <label className="box-border text-text-primary text-[14px] font-medium mb-2 m-0 p-0">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="box-border h-[40px] border bg-input-bg text-text-primary placeholder:text-text-secondary text-[14px] font-normal m-0 px-3 py-0 rounded-md border-solid border-input-border focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};
