
import React from 'react';
import { CategoryHeader } from '../ui/CategoryHeader';
import { UploadButton } from '../ui/UploadButton';
import { useFormContext } from '../../contexts/FormContext';

export const WebsitePlanSection: React.FC = () => {
  const { formData, updateFormData, fileUpload } = useFormContext();

  const handleFileUpload = async (file: File) => {
    const url = await fileUpload.uploadFile(file, 'websitePlanDesignGuide');
    if (url) {
      updateFormData('websitePlanDesignGuideUrl', url);
    }
  };

  const handleCheckboxChange = (enabled: boolean) => {
    updateFormData('websitePlanEnabled', enabled);
    if (!enabled) {
      updateFormData('websitePlanGuidelines', '');
      fileUpload.removeFile('websitePlanDesignGuide');
    }
  };

  const handleDetailsChange = (details: string) => {
    updateFormData('websitePlanGuidelines', details);
  };

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="Website Plan"
        description="Get website plan and structure."
        hasCheckbox={true}
        checked={formData.websitePlanEnabled || false}
        onCheckboxChange={handleCheckboxChange}
        rightContent={
          <UploadButton
            label="Upload Design guide"
            onFileUpload={handleFileUpload}
            fieldName="websitePlanDesignGuide"
            uploadedFile={fileUpload.getFile('websitePlanDesignGuide')}
            isUploading={fileUpload.isUploading('websitePlanDesignGuide')}
            onRemoveFile={() => fileUpload.removeFile('websitePlanDesignGuide')}
          />
        }
      />
      
      <div className={`transition-all duration-500 overflow-hidden ${formData.websitePlanEnabled ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="box-border mt-8 m-0 p-0">
          <label className="box-border text-hsl(var(--text-primary)) text-xl font-normal mb-8 m-0 p-0 block">
            Mention your details
          </label>
          <div className="box-border h-[200px] border relative m-0 px-[27px] py-[23px] rounded-xl border-solid border-hsl(var(--input-border)) bg-hsl(var(--input-bg))">
            <textarea
              value={formData.websitePlanGuidelines || ''}
              onChange={(e) => handleDetailsChange(e.target.value)}
              placeholder="e.g what you want etc"
              className="box-border w-full h-full bg-transparent text-hsl(var(--text-primary)) placeholder-hsl(var(--text-secondary)) placeholder-opacity-50 text-[15px] font-normal resize-none border-none outline-none m-0 p-0"
              maxLength={500}
            />
            <div className="box-border text-hsl(var(--text-secondary)) text-[15px] font-normal opacity-50 absolute m-0 p-0 right-[27px] bottom-[33px]">
              500 max
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
