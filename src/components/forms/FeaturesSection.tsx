
import React from 'react';
import { CheckboxField } from '../ui/CheckboxField';
import { CategoryHeader } from '../ui/CategoryHeader';
import { useFormContext } from '../../contexts/FormContext';

export const FeaturesSection: React.FC = () => {
  const { formData, updateFormData, updateArrayField } = useFormContext();

  const updateFeature = (feature: string, checked: boolean) => {
    updateArrayField('tokenFeatures', feature, checked);
  };

  const handleCheckboxChange = (enabled: boolean) => {
    updateFormData('featuresEnabled', enabled);
    if (!enabled) {
      updateFormData('tokenFeatures', []);
      updateFormData('featuresGuidelines', '');
    }
  };

  const handleEnableChange = (enabled: boolean, label: string) => {
    if (label === 'Mintable') {
      updateFeature('ableToMint', enabled);
    } else {
      updateFeature('ableToBurn', enabled);
    }
    handleCheckboxChange(enabled);
  }

  const handleGuidelinesChange = (guidelines: string) => {
    updateFormData('featuresGuidelines', guidelines);
  };

  const isEnabled = formData.featuresEnabled || (formData.tokenFeatures && formData.tokenFeatures.length > 0);

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="Want more Features?"
        description="Upgrade to access advanced tools and exclusive benefits"
        hasCheckbox={true}
        checked={isEnabled}
        onCheckboxChange={handleCheckboxChange}
        rightContent={
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-[34px] max-sm:flex-wrap max-sm:gap-[15px]">
              <CheckboxField
                label="Mintable"
                checked={(formData.tokenFeatures || []).includes('ableToMint')}
                onChange={(checked) => handleEnableChange(checked, 'Mintable')}
              />
              <CheckboxField
                label="Burnable"
                checked={(formData.tokenFeatures || []).includes('ableToBurn')}
                onChange={(checked) => handleEnableChange(checked, 'Burnable')}
              />
            </div>
            {/* <CheckboxField
              label="Others ?"
              checked={(formData.tokenFeatures || []).includes('others')}
              onChange={(checked) => updateFeature('others', checked)}
            /> */}
          </div>
        }
      />

      {isEnabled && (
        <>
          <div className="box-border flex flex-col gap-[17px] mb-8 m-0 p-0">
            <div className="box-border grid grid-cols-3 gap-[27px] mb-[27px] m-0 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
              <CheckboxField
                label="Revoke ownership"
                checked={(formData.tokenFeatures || []).includes('revokeOwnership')}
                onChange={(checked) => updateFeature('revokeOwnership', checked)}
              />
              <CheckboxField
                label="Liquidity Fee"
                checked={(formData.tokenFeatures || []).includes('liquidityFee')}
                onChange={(checked) => updateFeature('liquidityFee', checked)}
              />
              <CheckboxField
                label="Pausable"
                checked={(formData.tokenFeatures || []).includes('pausable')}
                onChange={(checked) => updateFeature('pausable', checked)}
              />
            </div>

            <div className="box-border grid grid-cols-3 gap-[27px] mb-[27px] m-0 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
              <CheckboxField
                label="Fees"
                checked={(formData.tokenFeatures || []).includes('fees')}
                onChange={(checked) => updateFeature('fees', checked)}
              />
              <CheckboxField
                label="Deflationary"
                checked={(formData.tokenFeatures || []).includes('deflationary')}
                onChange={(checked) => updateFeature('deflationary', checked)}
              />
              <CheckboxField
                label="Blacklist"
                checked={(formData.tokenFeatures || []).includes('blacklist')}
                onChange={(checked) => updateFeature('blacklist', checked)}
              />
            </div>

            <div className="box-border grid grid-cols-3 gap-[27px] mb-[27px] m-0 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
              <CheckboxField
                label="Transaction Limits"
                checked={(formData.tokenFeatures || []).includes('transactionLimits')}
                onChange={(checked) => updateFeature('transactionLimits', checked)}
              />
              <CheckboxField
                label="Superchain"
                checked={(formData.tokenFeatures || []).includes('superchain')}
                onChange={(checked) => updateFeature('superchain', checked)}
              />
              <CheckboxField
                label="Wallet Limits"
                checked={(formData.tokenFeatures || []).includes('walletLimits')}
                onChange={(checked) => updateFeature('walletLimits', checked)}
              />
            </div>

            <div className="box-border grid grid-cols-3 gap-[27px] mb-[27px] m-0 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
              <CheckboxField
                label="Marketing Fee"
                checked={(formData.tokenFeatures || []).includes('marketingFee')}
                onChange={(checked) => updateFeature('marketingFee', checked)}
              />
              <CheckboxField
                label="Interoperability"
                checked={(formData.tokenFeatures || []).includes('interoperability')}
                onChange={(checked) => updateFeature('interoperability', checked)}
              />
              <CheckboxField
                label="Verify Contract"
                checked={(formData.tokenFeatures || []).includes('verifyContract')}
                onChange={(checked) => updateFeature('verifyContract', checked)}
              />
            </div>
          </div>

          <div className="box-border flex flex-col m-0 p-0">
            <label className="box-border text-text-primary text-[17px] font-normal mb-[11px] m-0 p-0">
              Guidelines
            </label>
            <textarea
              value={formData.featuresGuidelines || ''}
              onChange={(e) => handleGuidelinesChange(e.target.value)}
              placeholder="Enter guidelines"
              className="box-border w-full h-[144px] border bg-bg-secondary text-text-primary placeholder:text-text-secondary text-[17px] font-normal m-0 px-[19px] py-[11px] rounded-xl border-solid border-border-primary focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </>
      )}
    </section>
  );
};
