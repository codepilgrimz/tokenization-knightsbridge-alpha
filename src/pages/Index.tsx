import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { TokenMintForm } from '../components/forms/TokenMintForm';
import { FeaturesSection } from '../components/forms/FeaturesSection';
import { LetterheadSection } from '../components/forms/LetterheadSection';
import { RaiseDocumentSection } from '../components/forms/RaiseDocumentSection';
import { WhitePaperSection } from '../components/forms/WhitePaperSection';
import { WebsitePlanSection } from '../components/forms/WebsitePlanSection';
import { ExchangeListingSection } from '../components/forms/ExchangeListingSection';
import { LegalDocumentsSection } from '../components/forms/LegalDocumentsSection';
import { ContactInformationSection } from '../components/forms/ContactInformationSection';
import { ServicesSidebar } from '../components/sidebar/ServicesSidebar';
import { PaymentSidebar } from '../components/sidebar/PaymentSidebar';
import { FormProvider, useFormContext } from '../contexts/FormContext';
import { useFormSubmission } from '../hooks/useFormSubmission';

interface IndexProps {
	isDarkMode: boolean;
	onThemeToggle: () => void;
}

const IndexContent: React.FC<IndexProps> = ({ isDarkMode, onThemeToggle }) => {
	const [showPayment, setShowPayment] = useState(false);
	const [selectedServices, setSelectedServices] = useState({
		mintToken: false,
		features: [] as string[],
		letterhead: true, // Always enabled for letterhead
		raiseDocument: [] as string[],
		whitePaper: [] as string[],
		websitePlan: false,
		exchangeListing: [] as string[],
		legalDocuments: [] as string[]
	});
	const [totalAmount, setTotalAmount] = useState(100); // Start with Mint Token

	const { formData, fileUpload } = useFormContext();
	const { validateAndSubmit, isSubmitting } = useFormSubmission();

	const handleCheckout = (amount: number) => {
		setTotalAmount(amount);
		setShowPayment(true);
	};

	const handlePayNow = async () => {
		try {
			const result = await validateAndSubmit(formData, 'Decentralized', totalAmount, fileUpload);
			if (result.success) {
				setShowPayment(false);
				// Only access submissionId if success is true
				return (result as { success: true; submissionId: any }).submissionId;
			}
			return null; // explicitly return null if not successful
		} catch (error) {
			console.error('Form submission error:', error);
			return null; // explicitly return null on error
		}
	};

	const handleClosePayment = () => {
		setShowPayment(false);
	};

	return (
		<div className={`w-full min-h-screen relative overflow-x-hidden bg-bg-primary ${!isDarkMode ? 'light' : ''}`}>
			<Header isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />

			<main>
				<HeroSection />

				<div className="flex flex-col xl:flex-row gap-4 xl:gap-7 mb-[100px] px-4 pb-4 md:px-8 xl:px-16 xl:absolute right-0 w-full">
					<form className="flex-[7] border bg-bg-secondary p-4 md:p-7 rounded-3xl border-border-primary">
						<ContactInformationSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<TokenMintForm />

						<div className="w-full h-px bg-border-primary my-8" />
						<FeaturesSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<LetterheadSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<RaiseDocumentSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<WhitePaperSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<WebsitePlanSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<ExchangeListingSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<LegalDocumentsSection />

					</form>

					<div className="flex-[3] min-w-0 relative">
						<div className="sticky top-4">
							<ServicesSidebar onCheckout={handleCheckout} selectedServices={selectedServices} />
						</div>
					</div>
				</div>
			</main>

			{/* Payment Sidebar - now handles its own positioning and mobile responsiveness */}
			<PaymentSidebar
				isVisible={showPayment}
				onClose={handleClosePayment}
				onPayNow={handlePayNow}
				isSubmitting={isSubmitting}
				totalAmount={totalAmount}
			/>
		</div>
	);
};

const Index: React.FC<IndexProps> = ({ isDarkMode, onThemeToggle }) => {
	return (
		<FormProvider>
			<IndexContent isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />
		</FormProvider>
	);
};

export default Index;
