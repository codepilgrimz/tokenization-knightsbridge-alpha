import { useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from '../utils/supabase';

interface FormSubmissionData {
	main: {
		type: string;
		contact_email: string;
		contact_phone: string;
		token_name: string;
		token_ticker: string;
		token_chain: string;
		token_decimals: string;
		target_price: string;
		treasury_address: string;
		[key: string]: any;
	};
	tokenFeatures?: {
		submission_id?: string;
		features: string[];
	};
	letterhead?: {
		submission_id?: string;
		enabled: boolean;
		guidelines: string;
	};
	raiseDocument?: {
		submission_id?: string;
		regions: string[];
		company: string;
		contact_name: string;
		contact_person: string;
		position: string;
		email: string;
		phone: string;
		address: string;
		website: string;
	};
	whitepaper?: {
		submission_id?: string;
		pages: string;
		guidelines: string;
	};
	websitePlan?: {
		submission_id?: string;
		enabled: boolean;
		guidelines: string;
	};
	exchangeListings?: {
		submission_id?: string;
		exchanges: string[];
		preferences: string;
	};
	legalDocuments?: {
		submission_id?: string;
		documents: string[];
		preferences: string;
	};
}

interface ValidationError {
	field: string;
	message: string;
}

export const useFormSubmission = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const validateRequiredFields = (formData: any): ValidationError[] => {
		const errors: ValidationError[] = [];

		// Contact Information validation
		if (!formData.contactEmail?.trim()) {
			errors.push({ field: 'contactEmail', message: 'Email is required' });
		}
		if (!formData.contactPhone?.trim()) {
			errors.push({ field: 'contactPhone', message: 'Phone number is required' });
		}

		// Token Mint validation
		if (!formData.tokenName?.trim()) {
			errors.push({ field: 'tokenName', message: 'Token name is required' });
		}
		if (!formData.tokenTicker?.trim()) {
			errors.push({ field: 'tokenTicker', message: 'Token ticker is required' });
		}
		if (!formData.tokenChain?.trim()) {
			errors.push({ field: 'tokenChain', message: 'Token chain is required' });
		}
		if (!formData.tokenDecimals?.trim()) {
			errors.push({ field: 'tokenDecimals', message: 'Token decimals is required' });
		}
		if (!formData.targetPrice?.trim()) {
			errors.push({ field: 'targetPrice', message: 'Target price is required' });
		}
		if (!formData.treasuryAddress?.trim()) {
			errors.push({ field: 'treasuryAddress', message: 'Treasury address is required' });
		}

		return errors;
	};

	const validateOptionalSections = (formData: any): ValidationError[] => {
		const errors: ValidationError[] = [];

		// Token Features validation - if category is enabled, at least one feature should be selected
		if (formData.featuresEnabled) {
			if (!formData.tokenFeatures?.length) {
				errors.push({ field: 'tokenFeatures', message: 'At least one feature must be selected when Features category is enabled' });
			}
		}

		// Letterhead validation - if category is enabled, guidelines should be provided
		if (formData.letterheadEnabled) {
			if (!formData.letterheadGuidelines?.trim()) {
				errors.push({ field: 'letterheadGuidelines', message: 'Guidelines are required when Letterhead category is enabled' });
			}
		}

		// Raise Document validation - if category is enabled, regions and other fields should be filled
		if (formData.raiseDocumentEnabled) {
			if (!formData.raiseDocumentRegions?.length) {
				errors.push({ field: 'raiseDocumentRegions', message: 'At least one region must be selected when Raise Document category is enabled' });
			}
			if (!formData.raiseDocumentCompany?.trim()) {
				errors.push({ field: 'raiseDocumentCompany', message: 'Company name is required when Raise Document category is enabled' });
			}
			if (!formData.raiseDocumentContactName?.trim()) {
				errors.push({ field: 'raiseDocumentContactName', message: 'Contact name is required when Raise Document category is enabled' });
			}
			if (!formData.raiseDocumentEmail?.trim()) {
				errors.push({ field: 'raiseDocumentEmail', message: 'Email is required when Raise Document category is enabled' });
			}
		}

		// White Paper validation - if category is enabled, pages and guidelines should be provided
		if (formData.whitePaperEnabled) {
			if (!formData.whitePaperPages?.trim() || formData.whitePaperPages === 'none') {
				errors.push({ field: 'whitePaperPages', message: 'Page count must be selected when White Paper category is enabled' });
			}
			if (!formData.whitePaperGuidelines?.trim()) {
				errors.push({ field: 'whitePaperGuidelines', message: 'Guidelines are required when White Paper category is enabled' });
			}
		}

		// Website Plan validation - if category is enabled, guidelines should be provided
		if (formData.websitePlanEnabled) {
			if (!formData.websitePlanGuidelines?.trim()) {
				errors.push({ field: 'websitePlanGuidelines', message: 'Guidelines are required when Website Plan category is enabled' });
			}
		}

		// Exchange Listings validation - if category is enabled, at least one exchange should be selected
		if (formData.exchangeListingEnabled) {
			if (!formData.exchangeListings?.length) {
				errors.push({ field: 'exchangeListings', message: 'At least one exchange must be selected when Exchange Listing category is enabled' });
			}
		}

		// Legal Documents validation - if category is enabled, at least one document should be selected
		if (formData.legalDocumentsEnabled) {
			if (!formData.legalDocuments?.length) {
				errors.push({ field: 'legalDocuments', message: 'At least one legal document must be selected when Legal Documents category is enabled' });
			}
		}

		return errors;
	};

	const submitForm = async (data: FormSubmissionData, uploadedFiles?: Record<string, any>) => {
		setIsSubmitting(true);

		try {
			console.log('Submitting form data:', data);

			// First check if the tables exist
			const { error: testError } = await supabase
				.from('form_submissions')
				.select('id')
				.limit(1);

			if (testError) {
				console.error('Database tables not found:', testError);
				toast({
					title: "Database Error",
					description: "Database tables are not set up. Please run the database migrations first.",
					variant: "destructive",
				});
				throw new Error('Database tables not found. Please run migrations.');
			}

			// Insert main form submission
			const { data: submission, error: submissionError } = await supabase
				.from('form_submissions')
				.insert(data.main)
				.select()
				.single();

			if (submissionError) {
				console.error('Submission error:', submissionError);
				throw submissionError;
			}

			const submissionId = submission.id;
			console.log('Created submission with ID:', submissionId);

			// Store uploaded documents if any
			if (uploadedFiles && Object.keys(uploadedFiles).length > 0) {
				const documentsToInsert = Object.entries(uploadedFiles).map(([fieldName, fileData]: [string, any]) => ({
					submission_id: submissionId,
					field_name: fieldName,
					original_filename: fileData.originalFilename || fileData.file?.name || 'unknown',
					file_path: fileData.filePath || fileData.storagePath || '',
					file_size: fileData.fileSize || fileData.file?.size || 0,
					mime_type: fileData.mimeType || fileData.file?.type || 'application/octet-stream'
				}))

				const { error: documentsError } = await supabase
					.from('uploaded_documents')
					.insert(documentsToInsert);

				if (documentsError) {
					console.error('Documents storage error:', documentsError);
					// Don't throw error for documents, just log it
				}
			}

			// const submissionPayload = {
			// 	formData: {
			// 		main: data.main,
			// 		tokenFeatures: data.tokenFeatures?.features || [],
			// 		letterhead: data.letterhead,
			// 		whitepaper: data.whitepaper,
			// 		websitePlan: data.websitePlan,
			// 		raiseDocument: data.raiseDocument,
			// 		raiseDocumentRegions: data.raiseDocument?.regions || [],
			// 		exchangeListings: data.exchangeListings?.exchanges || [],
			// 		legalDocuments: data.legalDocuments?.documents || [],
			// 		uploadedDocuments: uploadedFiles || {}
			// 	}
			// };

			// console.log('Sending uploaded file metadata to Edge Function:', submissionPayload);

			// // Call the Edge Function using supabase.functions.invoke
			// const { data: result, error } = await supabase.functions.invoke('submit-form', {
			// 	body: submissionPayload
			// });

			// if (error) {
			// 	console.error('Edge function error:', error);
			// 	throw error;
			// }

			// Insert optional sections data
			if (data.tokenFeatures && data.tokenFeatures.features?.length > 0) {
				const tokenFeatures = data.tokenFeatures.features.map((feature: string) => ({
					submission_id: submissionId,
					feature_name: feature
				}));

				const { error: featuresError } = await supabase
					.from('token_features')
					.insert(tokenFeatures);

				if (featuresError) {
					console.error('Features error:', featuresError);
					throw featuresError;
				}
			}

			if (data.letterhead && data.letterhead.enabled) {
				const { error: letterheadError } = await supabase
					.from('letterhead_services')
					.insert({
						submission_id: submissionId,
						enabled: data.letterhead.enabled,
						guidelines: data.letterhead.guidelines
					});

				if (letterheadError) {
					console.error('Letterhead error:', letterheadError);
					throw letterheadError;
				}
			}

			if (data.raiseDocument && data.raiseDocument.regions?.length > 0) {
				const regions = data.raiseDocument.regions.map((region: string) => ({
					submission_id: submissionId,
					region: region
				}));

				const { error: regionsError } = await supabase
					.from('raise_document_regions')
					.insert(regions);

				if (regionsError) {
					console.error('Regions error:', regionsError);
					throw regionsError;
				}

				// Insert raise document details
				const { error: raiseDocError } = await supabase
					.from('raise_documents')
					.insert({
						submission_id: submissionId,
						company: data.raiseDocument.company,
						contact_name: data.raiseDocument.contact_name,
						contact_person: data.raiseDocument.contact_person,
						position: data.raiseDocument.position,
						email: data.raiseDocument.email,
						phone: data.raiseDocument.phone,
						address: data.raiseDocument.address,
						website: data.raiseDocument.website
					});

				if (raiseDocError) {
					console.error('Raise document error:', raiseDocError);
					throw raiseDocError;
				}
			}

			if (data.whitepaper && data.whitepaper.pages && data.whitepaper.pages !== 'none') {
				const { error: whitepaperError } = await supabase
					.from('whitepapers')
					.insert({
						submission_id: submissionId,
						pages: data.whitepaper.pages,
						guidelines: data.whitepaper.guidelines
					});

				if (whitepaperError) {
					console.error('Whitepaper error:', whitepaperError);
					throw whitepaperError;
				}
			}

			if (data.websitePlan && data.websitePlan.enabled) {
				const { error: websiteError } = await supabase
					.from('website_plans')
					.insert({
						submission_id: submissionId,
						enabled: data.websitePlan.enabled,
						guidelines: data.websitePlan.guidelines
					});

				if (websiteError) {
					console.error('Website plan error:', websiteError);
					throw websiteError;
				}
			}

			if (data.exchangeListings && data.exchangeListings.exchanges?.length > 0) {
				const exchanges = data.exchangeListings.exchanges.map((exchange: string) => ({
					submission_id: submissionId,
					exchange_name: exchange
				}));

				const { error: exchangesError } = await supabase
					.from('exchange_listings')
					.insert(exchanges);

				if (exchangesError) {
					console.error('Exchanges error:', exchangesError);
					throw exchangesError;
				}

				const { error: listingPrefError } = await supabase
					.from('exchange_listings_preferences')
					.insert({
						submission_id: submissionId,
						preferences: data.exchangeListings.preferences
					});

				if (listingPrefError) {
					console.error('Legal preferences error:', listingPrefError);
					throw listingPrefError;
				}
			}

			if (data.legalDocuments && data.legalDocuments.documents?.length > 0) {
				const documents = data.legalDocuments.documents.map((doc: string) => ({
					submission_id: submissionId,
					document_type: doc
				}));

				const { error: documentsError } = await supabase
					.from('legal_documents')
					.insert(documents);

				if (documentsError) {
					console.error('Documents error:', documentsError);
					throw documentsError;
				}

				// Insert legal document preferences
				const { error: legalPrefError } = await supabase
					.from('legal_document_preferences')
					.insert({
						submission_id: submissionId,
						preferences: data.legalDocuments.preferences
					});

				if (legalPrefError) {
					console.error('Legal preferences error:', legalPrefError);
					throw legalPrefError;
				}
			}

			toast({
				title: "Success!",
				description: "Your form has been submitted successfully.",
			});

			return { success: true, submissionId };
		} catch (error) {
			console.error('Form submission error:', error);
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Failed to submit form",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const validateAndSubmit = async (formData: any, type: string, amount: number, fileUpload?: any) => {
		// Validate required fields
		const requiredErrors = validateRequiredFields(formData);
		const optionalErrors = validateOptionalSections(formData);
		console.log(formData)

		const allErrors = [...requiredErrors, ...optionalErrors];

		if (allErrors.length > 0) {
			const errorMessages = allErrors.map(error => error.message).join('\n');
			toast({
				title: "Validation Error",
				description: errorMessages,
				variant: "destructive",
			});
			return { success: false, errors: allErrors };
		}

		// Prepare structured submission data with proper field mapping
		const submissionData: FormSubmissionData = {
			main: {
				type: type,
				contact_email: formData.contactEmail,
				contact_phone: formData.contactPhone,
				token_name: formData.tokenName,
				token_ticker: formData.tokenTicker,
				token_chain: formData.tokenChain,
				token_decimals: formData.tokenDecimals,
				target_price: formData.targetPrice,
				treasury_address: formData.treasuryAddress,
				is_stablecoin: formData.isStablecoin || false,
				// Map Knightsbridge-specific fields to snake_case database columns
				kyc_full_name: formData.kycFullName,
				kyc_id_number: formData.kycIdNumber,
				kyc_date_of_birth: formData.kycDateOfBirth && formData.kycDateOfBirth.trim() ? formData.kycDateOfBirth : null,
				kyc_nationality: formData.kycNationality,
				kyc_address: formData.kycAddress,
				kyc_occupation: formData.kycOccupation,
				kyc_employer: formData.kycEmployer,
				kyc_income_source: formData.kycIncomeSource,
				custodian_name: formData.custodianName,
				custodian_contact: formData.custodianContact,
				custodian_registration: formData.custodianRegistration,
				custodian_address: formData.custodianAddress,
				custodian_services: formData.custodianServices,
				issuer_entity_name: formData.issuerEntityName,
				issuer_jurisdiction: formData.issuerJurisdiction,
				issuer_contact_person: formData.issuerContactPerson,
				issuer_contact_info: formData.issuerContactInfo,
				issuer_address: formData.issuerAddress,
				issuer_business_type: formData.issuerBusinessType,
				issuer_registration_number: formData.issuerRegistrationNumber,
				business_plan_type: typeof formData.businessPlanType === 'object' ? JSON.stringify(formData.businessPlanType) : formData.businessPlanType,
				business_plan_guidelines: formData.businessPlanGuidelines,
				savings_plan_guidelines: formData.savingsPlanGuidelines,
				pension_plan_guidelines: formData.pensionPlanGuidelines,
				business_plan_executive_summary: formData.businessPlanExecutiveSummary,
				business_plan_market_analysis: formData.businessPlanMarketAnalysis,
				business_plan_financial_projections: formData.businessPlanFinancialProjections,
				payment_amount: amount.toString() // Store amount as string for consistency
			}
		};

		// Add optional sections only if they have data
		if (formData.tokenFeatures?.length > 0) {
			submissionData.tokenFeatures = {
				features: formData.tokenFeatures
			};
		}

		if (formData.letterheadEnabled || formData.letterheadGuidelines?.trim()) {
			submissionData.letterhead = {
				enabled: formData.letterheadEnabled,
				guidelines: formData.letterheadGuidelines || ''
			};
		}

		if (formData.raiseDocumentRegions?.length > 0) {
			submissionData.raiseDocument = {
				regions: formData.raiseDocumentRegions,
				company: formData.raiseDocumentCompany || '',
				contact_name: formData.raiseDocumentContactName || '',
				contact_person: formData.raiseDocumentContactPerson || '',
				position: formData.raiseDocumentPosition || '',
				email: formData.raiseDocumentEmail || '',
				phone: formData.raiseDocumentPhone || '',
				address: formData.raiseDocumentAddress || '',
				website: formData.raiseDocumentWebsite || ''
			};
		}

		if (formData.whitePaperPages?.trim() && formData.whitePaperPages !== 'none') {
			submissionData.whitepaper = {
				pages: formData.whitePaperPages,
				guidelines: formData.whitePaperGuidelines || ''
			};
		}

		if (formData.websitePlanEnabled) {
			submissionData.websitePlan = {
				enabled: formData.websitePlanEnabled,
				guidelines: formData.websitePlanGuidelines || ''
			};
		}

		if (formData.exchangeListings?.length > 0) {
			submissionData.exchangeListings = {
				exchanges: formData.exchangeListings,
				preferences: formData.exchangeListingsPreferences || ''
			};
		}

		if (formData.legalDocuments?.length > 0) {
			submissionData.legalDocuments = {
				documents: formData.legalDocuments,
				preferences: formData.legalDocumentsPreferences || ''
			};
		}

		// Upload files to Supabase and get URLs
		let uploadedFilesMetadata: Record<string, any> = {};
		if (fileUpload && fileUpload.uploadedFiles) {
			console.log('Processing uploaded files:', fileUpload.uploadedFiles);
			uploadedFilesMetadata = Object.entries(fileUpload.uploadedFiles).reduce((acc, [fieldName, fileData]: [string, any]) => {
				acc[fieldName] = {
					originalFilename: fileData.file?.name || 'unknown',
					filePath: fileData.storagePath || fileData.url || '',
					fileSize: fileData.file?.size || 0,
					mimeType: fileData.file?.type || 'application/octet-stream',
					uploadedAt: fileData.uploadedAt || new Date()
				};
				return acc;
			}, {} as Record<string, any>);

			console.log('Prepared uploaded files metadata:', uploadedFilesMetadata);
		}

		return await submitForm(submissionData, uploadedFilesMetadata);
	};

	return { submitForm, validateAndSubmit, isSubmitting };
};
