
import React from 'react';
import { CheckboxField } from '../ui/CheckboxField';
import { CategoryHeader } from '../ui/CategoryHeader';
import { useFormContext } from '../../contexts/FormContext';

export const ExchangeListingSection: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  const exchangeOptions = [
    { value: 'xt', label: 'XT' },
    { value: 'lbank', label: 'LBank' },
    { value: 'etf', label: 'ETF' }
  ];

  const handleExchangeChange = (exchange: string, checked: boolean) => {
    updateFormData('exchangeListingEnabled', checked);
    const currentExchanges = formData.exchangeListings || [];
    let updatedExchanges;

    if (checked) {
      updatedExchanges = [...currentExchanges, exchange];
    } else {
      updatedExchanges = currentExchanges.filter((e: string) => e !== exchange);
    }

    updateFormData('exchangeListings', updatedExchanges);
  };

  const handleCheckboxChange = (enabled: boolean) => {
    updateFormData('exchangeListingEnabled', enabled);
    if (!enabled) {
      updateFormData('exchangeListings', []);
    }
  };

  const handleDetailsChange = (details: string) => {
    updateFormData('exchangeListingsPreferences', details);
  };

  const isEnabled = formData.exchangeListingEnabled || (formData.exchangeListings && formData.exchangeListings.length > 0);

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="Consulting on Listing"
        description="Choose your preference for listing *price may vary"
        hasCheckbox={true}
        checked={isEnabled}
        onCheckboxChange={handleCheckboxChange}
        rightContent={
          <div className="flex gap-[72px] max-sm:flex-wrap max-sm:gap-[15px]">
            {exchangeOptions.map((option) => (
              <CheckboxField
                key={option.value}
                label={option.label}
                checked={(formData.exchangeListings || []).includes(option.value)}
                onChange={(checked) => handleExchangeChange(option.value, checked)}
              />
            ))}
          </div>
        }
      />
      {isEnabled && (
        <div className="box-border mt-8 m-0 p-0">
          <label className="box-border text-text-primary text-xl font-normal mb-8 m-0 p-0 block">
            Preferences
          </label>
          <div className="box-border h-[200px] border relative m-0 px-[27px] py-[23px] rounded-xl border-solid border-border-primary bg-bg-secondary">
            <textarea
              value={formData.exchangeListingsPreferences || ''}
              onChange={(e) => handleDetailsChange(e.target.value)}
              placeholder="e.g what you want etc"
              className="box-border w-full h-full bg-transparent text-text-primary placeholder:text-text-secondary text-[15px] font-normal resize-none border-none outline-none m-0 p-0"
              maxLength={500}
            />
            <div className="box-border text-text-secondary text-[15px] font-normal absolute m-0 p-0 right-[27px] bottom-[33px]">
              500 max
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
