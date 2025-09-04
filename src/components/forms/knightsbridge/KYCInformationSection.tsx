
import React from 'react';
import { CategoryHeader } from '../../ui/CategoryHeader';
import { FormInput } from '../../ui/FormInput';
import { UploadButton } from '../../ui/UploadButton';
import { useFormContext } from '../../../contexts/FormContext';

export const KYCInformationSection: React.FC = () => {
  const { formData, updateFormData, fileUpload } = useFormContext();

  const handleProofOfIdentityUpload = async (file: File) => {
    const url = await fileUpload.uploadFile(file, 'kycProofOfIdentity');
    if (url) {
      updateFormData('kycProofOfIdentityUrl', url);
    }
  };

  const handleProofOfAddressUpload = async (file: File) => {
    const url = await fileUpload.uploadFile(file, 'kycProofOfAddress');
    if (url) {
      updateFormData('kycProofOfAddressUrl', url);
    }
  };

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="KYC Information"
        description="Quickly verify your identity to ensure a safe and compliant experience"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FormInput
          label="Full Name"
          placeholder="eg John Doe"
          value={formData.kycFullName}
          onChange={(value) => updateFormData('kycFullName', value)}
        />
        
        <FormInput
          label="ID Number"
          placeholder="PASSXXX"
          value={formData.kycIdNumber}
          onChange={(value) => updateFormData('kycIdNumber', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col">
          <label className="text-text-primary text-[14px] font-medium mb-4">
            Proof of Identity Upload
          </label>
          <UploadButton
            label="eg file.pdf"
            onFileUpload={handleProofOfIdentityUpload}
            fieldName="kycProofOfIdentity"
            uploadedFile={fileUpload.getFile('kycProofOfIdentity')}
            isUploading={fileUpload.isUploading('kycProofOfIdentity')}
            onRemoveFile={() => fileUpload.removeFile('kycProofOfIdentity')}
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-text-primary text-[14px] font-medium mb-4">
            Proof of Address Upload
          </label>
          <UploadButton
            label="eg file.pdf"
            onFileUpload={handleProofOfAddressUpload}
            fieldName="kycProofOfAddress"
            uploadedFile={fileUpload.getFile('kycProofOfAddress')}
            isUploading={fileUpload.isUploading('kycProofOfAddress')}
            onRemoveFile={() => fileUpload.removeFile('kycProofOfAddress')}
          />
        </div>
      </div>
    </section>
  );
};
