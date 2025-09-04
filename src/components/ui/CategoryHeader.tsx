
import React from 'react';

interface CategoryHeaderProps {
  title: string;
  description: string;
  hasCheckbox?: boolean;
  checked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  rightContent?: React.ReactNode;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  description,
  hasCheckbox = false,
  checked = false,
  onCheckboxChange,
  rightContent
}) => {
  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex items-end gap-4 flex-1 min-w-0">
          <div className="w-1 h-16 lg:h-20 bg-text-primary flex-shrink-0"></div>
          
          {hasCheckbox && (
            <div 
              className={`w-6 h-6 border cursor-pointer mt-2 lg:mt-1 p-0 rounded-[5px] border-solid transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                checked 
                  ? 'bg-transparent border-green-500' 
                  : 'border-border-primary hover:border-green-400'
              }`}
              onClick={() => onCheckboxChange?.(!checked)}
            >
              {checked && (
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              )}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h2 className="text-text-primary text-2xl md:text-3xl lg:text-[35px] font-normal mb-2 break-words">
              {title}
            </h2>
            <p className="text-text-secondary text-base md:text-[17px] font-normal break-words">
              {description}
            </p>
          </div>
        </div>
        
        {rightContent && (
          <div className="flex-shrink-0 lg:mt-0 ml-5 lg:ml-0">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};
