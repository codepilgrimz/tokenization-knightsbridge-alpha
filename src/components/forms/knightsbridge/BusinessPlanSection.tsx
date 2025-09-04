
import React from 'react';
import { CategoryHeader } from '../../ui/CategoryHeader';
import { CheckboxField } from '../../ui/CheckboxField';
import { UploadButton } from '../../ui/UploadButton';
import { useFormContext } from '../../../contexts/FormContext';

export const BusinessPlanSection: React.FC = () => {
	const { formData, updateFormData, fileUpload } = useFormContext();

	const businessPlanTypes = formData.businessPlanType || {};

	const updateBusinessPlanType = (type: string, checked: boolean) => {
		const updatedTypes = { ...businessPlanTypes, [type]: checked };
		updateFormData('businessPlanType', updatedTypes);
	};

	const handleUploadPlanGuide = async (file: File) => {
		const url = await fileUpload.uploadFile(file, 'businessPlanGuide');
		if (url) {
			updateFormData('businessPlanGuideUrl', url);
		}
	};

	const handleGuidelinesChange = (guidelines: string) => {
		updateFormData('businessPlanGuidelines', guidelines);
	};

	return (
		<section className="box-border m-0 p-0">
			<CategoryHeader
				title="Business Plan"
				description="Outline your strategy to drive growth and achieve your goals"
				rightContent={
					<UploadButton
						label="Upload Plan guide"
						onFileUpload={handleUploadPlanGuide}
						fieldName="businessPlanGuide"
						uploadedFile={fileUpload.getFile('businessPlanGuide')}
						isUploading={fileUpload.isUploading('businessPlanGuide')}
						onRemoveFile={() => fileUpload.removeFile('businessPlanGuide')}
					/>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<CheckboxField
					label="Utility Token"
					checked={businessPlanTypes.utility || false}
					onChange={(checked) => updateBusinessPlanType('utility', checked)}
				/>
				<CheckboxField
					label="Security Token"
					checked={businessPlanTypes.security || false}
					onChange={(checked) => updateBusinessPlanType('security', checked)}
				/>
				<CheckboxField
					label="Governance Token"
					checked={businessPlanTypes.governance || false}
					onChange={(checked) => updateBusinessPlanType('governance', checked)}
				/>
				<CheckboxField
					label="Payment Token"
					checked={businessPlanTypes.payment || false}
					onChange={(checked) => updateBusinessPlanType('payment', checked)}
				/>
				<CheckboxField
					label="Reward Token"
					checked={businessPlanTypes.reward || false}
					onChange={(checked) => updateBusinessPlanType('reward', checked)}
				/>
			</div>

			<div className="flex flex-col">
				<label className="text-text-primary text-[17px] font-normal mb-[11px]">
					Mention your Guidelines
				</label>
				<textarea
					value={formData.businessPlanGuidelines || ''}
					onChange={(e) => handleGuidelinesChange(e.target.value)}
					placeholder="ENTER YOUR SERVICES"
					className="w-full h-[144px] border bg-bg-secondary text-text-primary placeholder:text-text-secondary text-[17px] font-normal px-[19px] py-[11px] rounded-xl border-solid border-border-primary focus:outline-none focus:border-blue-500 resize-none"
				/>
				<div className="text-right text-text-secondary text-sm mt-2">300 max</div>
			</div>
		</section>
	);
};
