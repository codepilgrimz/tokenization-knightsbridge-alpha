
import React from 'react';
import { CategoryHeader } from '../../ui/CategoryHeader';
import { UploadButton } from '../../ui/UploadButton';
import { useFormContext } from '../../../contexts/FormContext';
import { FormInput } from '@/components/ui/FormInput';

export const SavingsPlanSection: React.FC = () => {
	const { formData, updateFormData, fileUpload } = useFormContext();

	const handleUploadPlanGuide = async (file: File) => {
		const url = await fileUpload.uploadFile(file, 'savingsPlanGuide');
		if (url) {
			updateFormData('savingsPlanGuideUrl', url);
		}
	};

	const handleGuidelinesChange = (guidelines: string) => {
		updateFormData('savingsPlanGuidelines', guidelines);
	};

	return (
		<section className="box-border m-0 p-0">
			<CategoryHeader
				title="Legal Entity Identifier"
				description="LEI Number"
				rightContent={
					<UploadButton
						label="vLEI Upload"
						onFileUpload={handleUploadPlanGuide}
						fieldName="savingsPlanGuide"
						uploadedFile={fileUpload.getFile('savingsPlanGuide')}
						isUploading={fileUpload.isUploading('savingsPlanGuide')}
						onRemoveFile={() => fileUpload.removeFile('savingsPlanGuide')}
					/>
				}
			/>

			<div className="box-border grid grid-cols-1 md:grid-cols-2 gap-6 m-0 p-0 mb-6">
				<FormInput
					label=""
					placeholder="984500538D660B5B5196"
					value={formData.contactEmail}
					onChange={(value) => updateFormData('contactEmail', value)}
				/>
			</div>

			<div className="flex flex-col">
				<label className="text-text-primary text-[17px] font-normal mb-[11px]">
					More Description
				</label>
				<textarea
					value={formData.savingsPlanGuidelines || ''}
					onChange={(e) => handleGuidelinesChange(e.target.value)}
					placeholder="Write more details about your LEI"
					className="w-full h-[144px] border bg-bg-secondary text-text-primary placeholder:text-text-secondary text-[17px] font-normal px-[19px] py-[11px] rounded-xl border-solid border-border-primary focus:outline-none focus:border-blue-500 resize-none"
				/>
				<div className="text-right text-text-secondary text-sm mt-2">300 max</div>
			</div>
		</section>
	);
};
