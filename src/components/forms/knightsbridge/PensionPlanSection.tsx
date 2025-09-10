
import React, { useCallback, useState } from 'react';
import { CategoryHeader } from '../../ui/CategoryHeader';
import { UploadButton } from '../../ui/UploadButton';
import { useFormContext } from '../../../contexts/FormContext';
import { FormInput } from '@/components/ui/FormInput';
import { useToast } from '@/hooks/use-toast';

interface PensionPlanSectionProps {
	ISINumber: string;
	setISINumber: (value: string) => void;
	lei: string;
}

export const PensionPlanSection: React.FC<PensionPlanSectionProps> = ({ ISINumber, setISINumber, lei }) => {
	const { formData, updateFormData, fileUpload } = useFormContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();

	const handleUploadPlanGuide = async (file: File) => {
		const url = await fileUpload.uploadFile(file, 'pensionPlanGuide');
		if (url) {
			updateFormData('pensionPlanGuideUrl', url);
		}
	};

	const handleGuidelinesChange = (guidelines: string) => {
		updateFormData('pensionPlanGuidelines', guidelines);
	};

	/**
	 * Verifies an ISIN using the Financial Modeling Prep API.
	 *
	 * @returns {Promise<void>}
	 */
	const handleVerifyIsin = useCallback(async (): Promise<void> => {
		if (isLoading) return;

		const isinToCheck = (typeof ISINumber === 'string' ? ISINumber : '').trim();

		if (!isinToCheck) {
			toast?.({ title: 'Missing ISIN', description: 'Enter an ISIN first.', variant: 'destructive' });
			return;
		}

		const gleifBaseUrl = import.meta.env.VITE_GLEIF_API_BASE_URL;

		if (!gleifBaseUrl) {
			toast?.({ title: 'GLEIF URL is missing', description: 'Set VITE_GLEIF_API_BASE_URL in your env.', variant: 'destructive' });
			return;
		}

		setIsLoading?.(true);

		try {
			const url = `${gleifBaseUrl}/lei-records/${lei}/isins`;
			const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
			
			let data: any = null;
			try { data = await res.json(); } catch { }
			if (!res.ok) {
				throw new Error(data?.message || res.statusText || 'Request failed');
			}

			let isins = data.data;

			const isin = isins.find((item: any) => item.attributes.isin === ISINumber);
			
			if (isin) {
				toast?.({ title: 'ISIN Verified', description: `The ISIN ${ISINumber} is valid.`, variant: 'default' });
			} else {
				toast?.({ title: 'ISIN Not Found', description: `The ISIN ${ISINumber} was not found.`, variant: 'destructive' });
			}
			

		} catch (e: any) {
			toast?.({ title: 'Verification failed', description: e?.message || 'Unable to verify ISIN.', variant: 'destructive' });
		} finally {
			setIsLoading?.(false);
		}
	},[ISINumber, isLoading, toast, setIsLoading, lei]);

	return (
		<section className="box-border m-0 p-0">
			<CategoryHeader
				title="International Securities Identification Number"
				description="ISIN Number"
				rightContent={
					// <UploadButton
					// 	label="DTI Upload"
					// 	onFileUpload={handleUploadPlanGuide}
					// 	fieldName="pensionPlanGuide"
					// 	uploadedFile={fileUpload.getFile('pensionPlanGuide')}
					// 	isUploading={fileUpload.isUploading('pensionPlanGuide')}
					// 	onRemoveFile={() => fileUpload.removeFile('pensionPlanGuide')}
					// />
					<button
						type="button"
						disabled={isLoading}
						onClick={handleVerifyIsin}
						className="box-border w-[271px] h-16 border flex items-center justify-center gap-8 m-0 p-0 rounded-xl border-solid border-input-border max-sm:w-full cursor-pointer hover:border-text-primary transition-colors"
					>
						<div className="box-border text-text-primary text-xl font-normal m-0 p-0">
							Verify ISIN
						</div>
					</button>
				}
			/>

			<div className="box-border grid grid-cols-1 md:grid-cols-2 gap-6 m-0 p-0 mb-6">
				<FormInput
					label=""
					placeholder="IE01288004079"
					// value={formData.contactEmail}
					value={ISINumber}
					// onChange={(value) => updateFormData('contactEmail', value)}
					onChange={(value) => setISINumber(value.toUpperCase())}
				/>
			</div>

			<div className="flex flex-col">
				<label className="text-text-primary text-[17px] font-normal mb-[11px]">
					More Description
				</label>
				<textarea
					value={formData.pensionPlanGuidelines || ''}
					onChange={(e) => handleGuidelinesChange(e.target.value)}
					placeholder="Write more details about your ISIN"
					className="w-full h-[144px] border bg-bg-secondary text-text-primary placeholder:text-text-secondary text-[17px] font-normal px-[19px] py-[11px] rounded-xl border-solid border-border-primary focus:outline-none focus:border-blue-500 resize-none"
				/>
				<div className="text-right text-text-secondary text-sm mt-2">300 max</div>
			</div>
		</section>
	);
};
