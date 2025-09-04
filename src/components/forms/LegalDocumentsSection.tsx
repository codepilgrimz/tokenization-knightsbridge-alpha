
import React from 'react';
import { CheckboxField } from '../ui/CheckboxField';
import { CategoryHeader } from '../ui/CategoryHeader';
import { useFormContext } from '../../contexts/FormContext';

export const LegalDocumentsSection: React.FC = () => {
  const { formData, updateFormData, updateArrayField } = useFormContext();

  const updateDocument = (document: string, checked: boolean) => {
    updateArrayField('legalDocuments', document, checked);
  };

  const handleCheckboxChange = (enabled: boolean) => {
    updateFormData('legalDocumentsEnabled', enabled);
    if (!enabled) {
      updateFormData('legalDocuments', []);
      updateFormData('legalDocumentsPreferences', '');
    }
  };

  const handlePreferencesChange = (preferences: string) => {
    updateFormData('legalDocumentsPreferences', preferences);
  };

  const isEnabled = formData.legalDocumentsEnabled || (formData.legalDocuments && formData.legalDocuments.length > 0);

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="Legal Documents"
        description="Legal Document Templates design"
        hasCheckbox={true}
        checked={isEnabled}
        onCheckboxChange={handleCheckboxChange}
      />

      <div className={`transition-all duration-500 overflow-hidden ${isEnabled ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="box-border mb-8 m-0 p-0">
          <div className="box-border grid grid-cols-3 gap-[27px] mb-[27px] m-0 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
            <CheckboxField
              label="Offering Memorandum"
              checked={(formData.legalDocuments || []).includes('offeringMemorandum')}
              onChange={(checked) => updateDocument('offeringMemorandum', checked)}
            />
            <CheckboxField
              label="Smart Contract Legal Opinion"
              checked={(formData.legalDocuments || []).includes('smartContractLegalOpinion')}
              onChange={(checked) => updateDocument('smartContractLegalOpinion', checked)}
            />
            {/* <CheckboxField
              label="Non-disclosure Agreement"
              checked={(formData.legalDocuments || []).includes('nonDisclosureAgreement')}
              onChange={(checked) => updateDocument('nonDisclosureAgreement', checked)}
            /> */}
            <CheckboxField
              label="Security Token Offering"
              checked={(formData.legalDocuments || []).includes('securityTokenOffering')}
              onChange={(checked) => updateDocument('securityTokenOffering', checked)}
            />
          </div>
          <div className="box-border grid grid-cols-3 gap-[27px] mb-[27px] m-0 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
            <CheckboxField
              label="Token Purchase Agreement"
              checked={(formData.legalDocuments || []).includes('tokenPurchaseAgreement')}
              onChange={(checked) => updateDocument('tokenPurchaseAgreement', checked)}
            />
            <CheckboxField
              label="SADA"
              checked={(formData.legalDocuments || []).includes('sada')}
              onChange={(checked) => updateDocument('sada', checked)}
            />
            <CheckboxField
              label="Non-Disclosure Agreement"
              checked={(formData.legalDocuments || []).includes('nda')}
              onChange={(checked) => updateDocument('nda', checked)}
            />
          </div>
          <div className="box-border grid grid-cols-3 gap-[27px] mb-[27px] m-0 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
            <CheckboxField
              label="Smart Contract Audit"
              checked={(formData.legalDocuments || []).includes('smartContractAudit')}
              onChange={(checked) => updateDocument('smartContractAudit', checked)}
            />
            <CheckboxField
              label="Tokenomics Whitepaper"
              checked={(formData.legalDocuments || []).includes('tokenomicsWhitepaper')}
              onChange={(checked) => updateDocument('tokenomicsWhitepaper', checked)}
            />
            <CheckboxField
              label="Mutual NDA"
              checked={(formData.legalDocuments || []).includes('mutualNda')}
              onChange={(checked) => updateDocument('mutualNda', checked)}
            />
          </div>
          <div className="box-border grid grid-cols-3 gap-[27px] mb-[27px] m-0 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
            {/* <CheckboxField
              label="All?"
              checked={(formData.legalDocuments || []).includes('all')}
              onChange={(checked) => updateDocument('all', checked)}
            /> */}
          </div>
        </div>
        <div className="box-border mt-8 m-0 p-0">
          <label className="box-border text-white text-xl font-normal mb-8 m-0 p-0 block">
            Any special prefernces
          </label>
          <div className="box-border h-[200px] border relative m-0 px-[27px] py-[23px] rounded-xl border-solid border-[#535353]">
            <textarea
              value={formData.legalDocumentsPreferences || ''}
              onChange={(e) => handlePreferencesChange(e.target.value)}
              placeholder="e.g what you want etc"
              className="box-border w-full h-full bg-transparent text-white placeholder-white placeholder-opacity-50 text-[15px] font-normal resize-none border-none outline-none m-0 p-0"
              maxLength={500}
            />
            <div className="box-border text-white text-[15px] font-normal opacity-50 absolute m-0 p-0 right-[27px] bottom-[33px]">
              500 max
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
