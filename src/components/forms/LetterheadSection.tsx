
import React from 'react';
import { CategoryHeader } from '../ui/CategoryHeader';
import { UploadButton } from '../ui/UploadButton';
import { useFormContext } from '../../contexts/FormContext';

export const LetterheadSection: React.FC = () => {
  const { formData, updateFormData, fileUpload } = useFormContext();

  const handleFileUpload = async (file: File) => {
    const url = await fileUpload.uploadFile(file, 'letterheadBrandGuide');
    if (url) {
      updateFormData('letterheadBrandGuideUrl', url);
    }
  };

  const handleCheckboxChange = (enabled: boolean) => {
    updateFormData('letterheadEnabled', enabled);
    if (!enabled) {
      updateFormData('letterheadGuidelines', '');
      fileUpload.removeFile('letterheadBrandGuide');
    }
  };

  const handleGuidelinesChange = (guidelines: string) => {
    updateFormData('letterheadGuidelines', guidelines);
  };

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="Letterhead Design"
        description="Get branded letterhead designs"
        hasCheckbox={true}
        checked={formData.letterheadEnabled || false}
        onCheckboxChange={handleCheckboxChange}
        rightContent={
          <UploadButton
            label="Upload Brand guide"
            onFileUpload={handleFileUpload}
            fieldName="letterheadBrandGuide"
            uploadedFile={fileUpload.getFile('letterheadBrandGuide')}
            isUploading={fileUpload.isUploading('letterheadBrandGuide')}
            onRemoveFile={() => fileUpload.removeFile('letterheadBrandGuide')}
          />
        }
      />
      
      {formData.letterheadEnabled && (
        <div className="box-border mt-6 m-0 p-0">
          <label className="box-border text-hsl(var(--text-primary)) text-[14px] font-medium mb-2 block m-0 p-0">
            Mention your Guidelines
          </label>
          <div className="box-border h-[120px] border relative m-0 p-3 rounded-md border-solid border-hsl(var(--input-border)) bg-hsl(var(--input-bg))">
            <textarea
              value={formData.letterheadGuidelines || ''}
              onChange={(e) => handleGuidelinesChange(e.target.value)}
              placeholder="e.g what you want etc"
              className="box-border w-full h-full bg-transparent text-hsl(var(--text-primary)) placeholder-hsl(var(--text-secondary)) text-[14px] font-normal resize-none border-none outline-none m-0 p-0"
              maxLength={500}
            />
            <div className="box-border text-hsl(var(--text-secondary)) text-[12px] font-normal absolute right-3 bottom-2 m-0 p-0">
              500 max
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
