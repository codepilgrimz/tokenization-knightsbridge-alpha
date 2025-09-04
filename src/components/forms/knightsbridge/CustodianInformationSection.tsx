
import React from 'react';
import { CategoryHeader } from '../../ui/CategoryHeader';
import { FormInput } from '../../ui/FormInput';
import { PhoneInput } from '../../ui/PhoneInput';
import { useFormContext } from '../../../contexts/FormContext';

export const CustodianInformationSection: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="Custodian Information"
        description="Provide details to ensure secure and compliant management of your funds"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormInput
          label="Name"
          placeholder="eg BINANCE"
          value={formData.custodianName}
          onChange={(value) => updateFormData('custodianName', value)}
        />
        
        <PhoneInput
          label="Contact"
          placeholder="eg +1-555-0199"
          value={formData.custodianContact}
          onChange={(value) => updateFormData('custodianContact', value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FormInput
          label="Registration"
          placeholder="eg CUSTPASS001"
          value={formData.custodianRegistration}
          onChange={(value) => updateFormData('custodianRegistration', value)}
        />
      </div>
    </section>
  );
};
