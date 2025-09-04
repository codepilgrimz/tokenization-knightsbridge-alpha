
import React from 'react';
import { CheckboxField } from '../ui/CheckboxField';
import { FormInput } from '../ui/FormInput';
import { CategoryHeader } from '../ui/CategoryHeader';
import { useFormContext } from '../../contexts/FormContext';

export const RaiseDocumentSection: React.FC = () => {
	const { formData, updateFormData } = useFormContext();

	const regionOptions = [
		{ value: 'usa', label: 'USA' },
		{ value: 'Non-USA', label: 'Non USA' },
		{ value: 'both', label: 'Both' }
	];

	const updateField = (field: string, value: string) => {
		updateFormData(field, value);
	};

	const handleRegionChange = (region: string, checked: boolean) => {
		updateFormData('raiseDocumentEnabled', checked);
		// For raise document, only allow one selection at a time
		if (checked) {
			updateFormData('raiseDocumentRegion', region);
		} else {
			updateFormData('raiseDocumentRegion', '');
		}
	};

	const handleCheckboxChange = (enabled: boolean) => {
		updateFormData('raiseDocumentEnabled', enabled);
		if (!enabled) {
			updateFormData('raiseDocumentRegion', '');
			updateFormData('raiseDocumentCompany', '');
			updateFormData('raiseDocumentContactName', '');
			updateFormData('raiseDocumentContactPerson', '');
			updateFormData('raiseDocumentPosition', '');
			updateFormData('raiseDocumentEmail', '');
			updateFormData('raiseDocumentPhone', '');
			updateFormData('raiseDocumentAddress', '');
			updateFormData('raiseDocumentWebsite', '');
		}
	};

	const isEnabled = formData.raiseDocumentEnabled || !!formData.raiseDocumentRegion;

	return (
		<section className="box-border m-0 p-0">
			<CategoryHeader
				title="Raise Document"
				description="Create and mint your customization token"
				hasCheckbox={true}
				checked={isEnabled}
				onCheckboxChange={handleCheckboxChange}
				rightContent={
					<div className="flex gap-[61px] max-sm:flex-wrap max-sm:gap-[15px]">
						{regionOptions.map((option) => (
							<CheckboxField
								key={option.value}
								label={option.label}
								checked={formData.raiseDocumentRegion === option.value}
								onChange={(checked) => handleRegionChange(option.value, checked)}
							/>
						))}
					</div>
				}
			/>

			<div className={`transition-all duration-500 overflow-hidden ${isEnabled ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
				<div className="box-border grid grid-cols-[358px_358px] gap-[16px_20px] mb-8 m-0 p-0 max-md:grid-cols-[1fr] max-md:gap-4 max-sm:grid-cols-[1fr]">
					<FormInput
						label="Company Name"
						placeholder="Enter company name"
						value={formData.raiseDocumentCompany || ''}
						onChange={(value) => updateField('raiseDocumentCompany', value)}
					/>
					<FormInput
						label="Contact Name"
						placeholder="Enter contact name"
						value={formData.raiseDocumentContactName || ''}
						onChange={(value) => updateField('raiseDocumentContactName', value)}
					/>
					<FormInput
						label="Contact Person"
						placeholder="Enter contact person"
						value={formData.raiseDocumentContactPerson || ''}
						onChange={(value) => updateField('raiseDocumentContactPerson', value)}
					/>
					<FormInput
						label="Position in Company"
						placeholder="Enter position"
						value={formData.raiseDocumentPosition || ''}
						onChange={(value) => updateField('raiseDocumentPosition', value)}
					/>
				</div>
				<div className="box-border grid grid-cols-[358px_358px] gap-[16px_20px] mb-8 m-0 p-0 max-md:grid-cols-[1fr] max-md:gap-4 max-sm:grid-cols-[1fr]">
					<FormInput
						label="Email"
						placeholder="Enter email"
						value={formData.raiseDocumentEmail || ''}
						onChange={(value) => updateField('raiseDocumentEmail', value)}
					/>
					<FormInput
						label="Phone No."
						placeholder="Enter phone number"
						value={formData.raiseDocumentPhone || ''}
						onChange={(value) => updateField('raiseDocumentPhone', value)}
					/>
					<FormInput
						label="Company Address"
						placeholder="Enter address"
						value={formData.raiseDocumentAddress || ''}
						onChange={(value) => updateField('raiseDocumentAddress', value)}
					/>
					<FormInput
						label="Website URL"
						placeholder="Enter website URL"
						value={formData.raiseDocumentWebsite || ''}
						onChange={(value) => updateField('raiseDocumentWebsite', value)}
					/>
				</div>
			</div>
		</section>
	);
};
