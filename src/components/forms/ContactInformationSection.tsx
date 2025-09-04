
import React from 'react';
import { CategoryHeader } from '../ui/CategoryHeader';
import { FormInput } from '../ui/FormInput';
import { PhoneInput } from '../ui/PhoneInput';
import { useFormContext } from '../../contexts/FormContext';
import { UploadButton } from '../ui/UploadButton';

export const ContactInformationSection: React.FC = () => {
  const { formData, updateFormData, fileUpload } = useFormContext();

  const handleUploadPlanGuide = async (file: File) => {
    const url = await fileUpload.uploadFile(file, 'pensionPlanGuide');
    if (url) {
      updateFormData('pensionPlanGuideUrl', url);
    }
  };

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="LEI - ISIN Mapping"
        description=" Legal Entity Identifier - International Securities Identification Number"
        rightContent={
          <UploadButton
            label="Upload"
            onFileUpload={handleUploadPlanGuide}
            fieldName="pensionPlanGuide"
            uploadedFile={fileUpload.getFile('pensionPlanGuide')}
            isUploading={fileUpload.isUploading('pensionPlanGuide')}
            onRemoveFile={() => fileUpload.removeFile('pensionPlanGuide')}
          />
        }
      />

      <div className="flex flex-col pt-4">
        <label className="text-text-primary text-[17px] font-normal mb-[11px]">
          More Description
        </label>
        <textarea
          value={formData.pensionPlanGuidelines || ''}
          // onChange={(e) => handleGuidelinesChange(e.target.value)}
          placeholder="Write more details"
          className="w-full h-[144px] border bg-bg-secondary text-text-primary placeholder:text-text-secondary text-[17px] font-normal px-[19px] py-[11px] rounded-xl border-solid border-border-primary focus:outline-none focus:border-blue-500 resize-none"
        />
        <div className="text-right text-text-secondary text-sm mt-2">300 max</div>
      </div>

      {/* <div className="box-border grid grid-cols-1 md:grid-cols-2 gap-6 m-0 p-0">
        <FormInput
          label="Email"
          placeholder="Enter your email"
          value={formData.contactEmail}
          onChange={(value) => updateFormData('contactEmail', value)}
        />
        <PhoneInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.contactPhone}
          onChange={(value) => updateFormData('contactPhone', value)}
        />
      </div> */}
    </section>
  );
};
