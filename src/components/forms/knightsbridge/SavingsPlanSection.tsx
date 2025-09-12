import React, { useEffect, useState } from 'react';
import { CategoryHeader } from '../../ui/CategoryHeader';
// import { UploadButton } from '../../ui/UploadButton';
import { FormInput } from '@/components/ui/FormInput';
import { useToast } from '@/hooks/use-toast';
import { createClient, type AuthorizeResult, type ExtensionClient } from '@/utils/client';
import { useFormContext } from '../../../contexts/FormContext';

interface SavingsPlanSectionProps {
	lei: string;
	setLei: (value: string) => void;
	setLeiVerified: (vale: boolean) => void;
}

export const SavingsPlanSection: React.FC<SavingsPlanSectionProps> = ({ lei, setLei, setLeiVerified }) => {
	const { formData, updateFormData, fileUpload } = useFormContext();
	const [signifyClient, setSignifyClient] = useState<ExtensionClient | null>(null);
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const client = createClient();
		setSignifyClient(client);
	}, []);

	const handleGuidelinesChange = (guidelines: string) => {
		updateFormData('savingsPlanGuidelines', guidelines);
	};


	/**
	 * Requests a CESR payload from an extension (if available) for the given LEI.
	 * Listens for messages with type 'CESR_RESPONSE' or '/signify/reply' to resolve the promise.
	 * If no extension is available, the promise will never resolve.
	 * @param {string} lei
	 * @returns {Promise<string>}
	 */
	const requestCesrPayload = (lei: string): Promise<string> => {
		return new Promise((resolve) => {
			/**
			 * Handles incoming messages from the extension, specifically those with type 'CESR_RESPONSE'
			 * or '/signify/reply'. If a CESR payload is received, resolves the promise with the payload.
			 * If no extension is available or the extension does not respond, the promise will never
			 * resolve.
			 * @param {MessageEvent} event
			 */
			const onMessage = (event: MessageEvent) => {
				try {
					const msgType = event?.data?.type;
					if (msgType === 'CESR_RESPONSE') {
						window.removeEventListener('message', onMessage);
						return resolve(event.data.cesrPayload as string);
					}
					if (msgType === '/signify/reply') {
						// Some extensions reply using a common channel
						const payload = event?.data?.payload ?? {};
						const maybeCesr = payload?.credential?.cesr || payload?.cesr || payload?.cesrPayload;
						if (maybeCesr) {
							window.removeEventListener('message', onMessage);
							return resolve(String(maybeCesr));
						}
					}
				} catch { }
			};
			window.addEventListener('message', onMessage);
			window.postMessage({ type: 'GENERATE_CESR', lei }, '*');
		});
	};

	/**
	 * Opens the Signify extension (if installed) to authorize a credential and request a CESR payload.
	 * If the extension is not installed, shows an error toast.
	 * If the extension is installed, it will handle the authorization flow and return the CESR payload.
	 * If the authorization is successful, it will call your API to verify the vLEI and show a success or error toast.
	 * If the authorization fails, it will show an error toast.
	 */
	const handleOpenSignify = async () => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			if (!lei.trim()) {
				toast({ title: 'Missing LEI', description: 'Enter an LEI number first.', variant: 'destructive' });
				return;
			}

			// Optional: check extension presence if your client supports it
			if (signifyClient) {
				const extensionId = await signifyClient.isExtensionInstalled();
				if (!extensionId) {
					toast({ title: 'Extension not found', description: 'Please install or enable Signify extension. If installed, refresh the page.', variant: 'destructive' });
					return;
				}
			}

			// Short timeout for direct CESR response; if it fails, fall back to selection
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Request timeout after 5 seconds')), 5000)
			);

			let cesrPayload = '' as string;
			try {
				cesrPayload = await Promise.race([
					requestCesrPayload(lei.trim()),
					timeoutPromise
				]) as string;
			} catch { }

			// Fallback: open selection dialog via client, then ensure credential matches LEI
			if (!cesrPayload) {
				if (!signifyClient) throw new Error('Signify client not available');
				const result: AuthorizeResult = await signifyClient.authorizeCred({
					message: 'Select a credential to provide CESR',
					session: { oneTime: true },
				});

				// Set the OUTER cesrPayload (do not redeclare with const)
				cesrPayload = result?.credential?.cesr ?? '';

				// Extract LEI from the returned credential
				const raw: any = result?.credential?.raw ?? {};
				const foundLei: string =
					(raw?.sad?.a?.LEI ?? raw?.LEI ?? '').toString();

				if (!cesrPayload) {
					toast({ title: 'No CESR received', description: 'Please try again.', variant: 'destructive' });
					return;
				}

				// Normalize and compare
				const norm = (s: string) => s.replace(/\s+/g, '').toUpperCase();
				if (!foundLei || norm(foundLei) !== norm(lei)) {
					toast({
						title: 'Credential does not match LEI',
						description: `Selected credential LEI does not match entered LEI.`,
						variant: 'destructive'
					});
					return;
				}
			}

			// Verify vLEI with your API
			try {
				const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/verify-vlei`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
					body: JSON.stringify({ cesr: cesrPayload })
				});

				let body: any = null;
				try { body = await response.json(); } catch { }

				if (response.status === 202) {
					setLeiVerified(true);
					toast({ title: 'Verification successful', description: body?.msg || 'Credential verified successfully.' });
				} else if (response.status === 400) {
					toast({ title: 'Bad request', description: body?.msg || 'The request is invalid or missing CESR.', variant: 'destructive' });
				} else if (response.status === 500) {
					toast({ title: 'Server error', description: body?.msg || 'An unexpected error occurred during verification.', variant: 'destructive' });
				} else {
					toast({ title: `Request failed (${response.status})`, description: body?.msg || response.statusText || 'Unknown error', variant: 'destructive' });
				}
			} catch (apiError: any) {
				toast({ title: 'Network error', description: apiError?.message || 'Failed to call verification API.', variant: 'destructive' });
			}
		} catch (e: any) {
			toast({ title: 'Authorization failed', description: e?.message || 'Signify request failed.', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="box-border m-0 p-0">
			<CategoryHeader
				title="Legal Entity Identifier"
				description="LEI Number"
				rightContent={
					<>
						{/* <UploadButton
							label="vLEI Upload"
							onFileUpload={handleUploadPlanGuide}
							fieldName="savingsPlanGuide"
							uploadedFile={fileUpload.getFile('savingsPlanGuide')}
							isUploading={fileUpload.isUploading('savingsPlanGuide')}
							onRemoveFile={() => fileUpload.removeFile('savingsPlanGuide')}
						/> */}
						<button
							type="button"
							disabled={isLoading}
							onClick={handleOpenSignify}
							className="box-border w-[271px] h-16 border flex items-center justify-center gap-8 m-0 p-0 rounded-xl border-solid border-input-border max-sm:w-full cursor-pointer hover:border-text-primary transition-colors"
						>
							<div className="box-border text-text-primary text-xl font-normal m-0 p-0">
								Verify vLEI
							</div>
						</button>
					</>
				}
			/>

			<div className="box-border grid grid-cols-1 md:grid-cols-2 gap-6 m-0 p-0 mb-6">
				<FormInput
					label=""
					placeholder="984500538D660B5B5196"
					value={lei}
					onChange={(value) => setLei(value.toUpperCase())}
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
