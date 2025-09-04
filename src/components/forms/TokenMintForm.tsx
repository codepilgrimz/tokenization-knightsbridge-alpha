
import React from 'react';
import { FormInput } from '../ui/FormInput';
import { CategoryHeader } from '../ui/CategoryHeader';
import { useFormContext } from '../../contexts/FormContext';
import { CheckboxField } from '../ui/CheckboxField';

export const TokenMintForm: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  const stablecoinOptions = [
    { value: true, label: 'Stablecoin' },
  ];

  const handleIsStablecoin = (isStablecoin: boolean, checked: boolean) => {
    if (checked) {
      updateFormData('isStablecoin', isStablecoin);
    } else {
      updateFormData('isStablecoin', false);
    }
  };

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="Mint Token"
        description="Create and mint your customization token"
        rightContent={
          <div className="flex gap-[51px] max-sm:flex-wrap max-sm:gap-[15px]">
            {stablecoinOptions.map((option: any) => (
              <CheckboxField
                key={option.value}
                label={option.label}
                checked={formData.isStablecoin === option.value}
                onChange={(checked) => handleIsStablecoin(option.value, checked)}
              />
            ))}
          </div>
        }
      />

      <div className="box-border grid grid-cols-[358px_358px] gap-[16px_20px] mb-8 m-0 p-0 max-md:grid-cols-[1fr] max-md:gap-4 max-sm:grid-cols-[1fr]">
        <FormInput
          label="Token Name"
          placeholder="Enter token name"
          value={formData.tokenName}
          onChange={(value) => updateFormData('tokenName', value)}
        />
        <FormInput
          label="Ticker"
          placeholder="Enter ticker"
          value={formData.tokenTicker}
          onChange={(value) => updateFormData('tokenTicker', value)}
        />
        <FormInput
          label="Chain"
          placeholder="Enter chain"
          value={formData.tokenChain}
          onChange={(value) => updateFormData('tokenChain', value)}
        />
        <FormInput
          label="Decimals"
          placeholder="Enter decimals"
          value={formData.tokenDecimals}
          onChange={(value) => updateFormData('tokenDecimals', value)}
        />
        <FormInput
          label="Target Price"
          placeholder="Enter target price"
          value={formData.targetPrice}
          onChange={(value) => updateFormData('targetPrice', value)}
        />
        <FormInput
          label="Treasury Address"
          placeholder="Enter treasury address"
          value={formData.treasuryAddress}
          onChange={(value) => updateFormData('treasuryAddress', value)}
        />
      </div>
    </section>
  );
};
