
import React from 'react';
import { CategoryHeader } from '../../ui/CategoryHeader';
import { FormInput } from '../../ui/FormInput';
import { PhoneInput } from '../../ui/PhoneInput';
import { useFormContext } from '../../../contexts/FormContext';

export const IssuerInformationSection: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="Issuer Information"
        description="Provide details about the issuing entity"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormInput
          label="Entity Name"
          placeholder="eg BINANCE"
          value={formData.issuerEntityName}
          onChange={(value) => updateFormData('issuerEntityName', value)}
        />
        
        <FormInput
          label="Jurisdiction"
          placeholder="eg California"
          value={formData.issuerJurisdiction}
          onChange={(value) => updateFormData('issuerJurisdiction', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PhoneInput
          label="Contact Person"
          placeholder="Phone number"
          value={formData.issuerContactPerson}
          onChange={(value) => updateFormData('issuerContactPerson', value)}
        />
        
        <FormInput
          label="Contact Info"
          placeholder="Email"
          value={formData.issuerContactInfo}
          onChange={(value) => updateFormData('issuerContactInfo', value)}
        />
      </div>
    </section>
  );
};
