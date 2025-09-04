
import React from 'react';
import { CheckboxField } from '../ui/CheckboxField';
import { CategoryHeader } from '../ui/CategoryHeader';
import { useFormContext } from '../../contexts/FormContext';

export const WhitePaperSection: React.FC = () => {
	const { formData, updateFormData } = useFormContext();

	const pageOptions = [
		{ value: '30', label: '30 Pages' },
		{ value: '60', label: '60 Pages' }
	];

	const handlePageChange = (page: string, checked: boolean) => {
		updateFormData('whitePaperEnabled', checked);
		// For whitepaper, only allow one selection at a time
		if (checked) {
			updateFormData('whitePaperPages', page);
		} else {
			updateFormData('whitePaperPages', '');
		}
	};

	const handleCheckboxChange = (enabled: boolean) => {
		updateFormData('whitePaperEnabled', enabled);
		if (!enabled) {
			updateFormData('whitePaperPages', '');
			updateFormData('whitePaperGuidelines', '');
		}
	};

	const handleDetailsChange = (details: string) => {
		updateFormData('whitePaperGuidelines', details);
	};

	return (
		<section className="box-border m-0 p-0">
			<CategoryHeader
				title="White Paper"
				description="Create and mint your customization token"
				hasCheckbox={true}
				checked={formData.whitePaperEnabled || false}
				onCheckboxChange={handleCheckboxChange}
				rightContent={
					<div className="flex gap-[51px] max-sm:flex-wrap max-sm:gap-[15px]">
						{pageOptions.map((option) => (
							<CheckboxField
								key={option.value}
								label={option.label}
								checked={formData.whitePaperPages === option.value}
								onChange={(checked) => handlePageChange(option.value, checked)}
							/>
						))}
					</div>
				}
			/>

			{formData.whitePaperEnabled && (
				<div className="box-border mt-8 m-0 p-0">
					<label className="box-border text-text-primary text-xl font-normal mb-8 m-0 p-0 block">
						Mention your details
					</label>
					<div className="box-border h-[200px] border relative m-0 px-[27px] py-[23px] rounded-xl border-solid border-border-primary bg-bg-secondary">
						<textarea
							value={formData.whitePaperGuidelines || ''}
							onChange={(e) => handleDetailsChange(e.target.value)}
							placeholder="e.g what you want etc"
							className="box-border w-full h-full bg-transparent text-text-primary placeholder:text-text-secondary text-[15px] font-normal resize-none border-none outline-none m-0 p-0"
							maxLength={500}
						/>
						<div className="box-border text-text-secondary text-[15px] font-normal absolute m-0 p-0 right-[27px] bottom-[33px]">
							500 max
						</div>
					</div>
				</div>
			)}
		</section>
	);
};
