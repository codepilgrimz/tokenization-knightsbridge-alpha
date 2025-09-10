import React, { useState } from 'react';
import { Header } from '../components/Header';
import { KYCInformationSection } from '../components/forms/knightsbridge/KYCInformationSection';
import { CustodianInformationSection } from '../components/forms/knightsbridge/CustodianInformationSection';
import { IssuerInformationSection } from '../components/forms/knightsbridge/IssuerInformationSection';
import { BusinessPlanSection } from '../components/forms/knightsbridge/BusinessPlanSection';
import { SavingsPlanSection } from '../components/forms/knightsbridge/SavingsPlanSection';
import { PensionPlanSection } from '../components/forms/knightsbridge/PensionPlanSection';
import { TokenMintForm } from '../components/forms/TokenMintForm';
import { FeaturesSection } from '../components/forms/FeaturesSection';
import { LetterheadSection } from '../components/forms/LetterheadSection';
import { RaiseDocumentSection } from '../components/forms/RaiseDocumentSection';
import { WhitePaperSection } from '../components/forms/WhitePaperSection';
import { WebsitePlanSection } from '../components/forms/WebsitePlanSection';
import { ExchangeListingSection } from '../components/forms/ExchangeListingSection';
import { LegalDocumentsSection } from '../components/forms/LegalDocumentsSection';
import { ContactInformationSection } from '../components/forms/ContactInformationSection';
import { KnightsbridgeServicesSidebar } from '../components/sidebar/KnightsbridgeServicesSidebar';
import { PaymentSidebar } from '../components/sidebar/PaymentSidebar';
import { FormProvider, useFormContext } from '../contexts/FormContext';
import { useFormSubmission } from '../hooks/useFormSubmission';

import Icon from '../assets/img/knightsbridge_icon.png';

interface KnightsbridgeProps {
	isDarkMode: boolean;
	onThemeToggle: () => void;
}

const KnightsbridgeContent: React.FC<KnightsbridgeProps> = ({ isDarkMode, onThemeToggle }) => {
	const [showPayment, setShowPayment] = useState(false);
	const [selectedServices, setSelectedServices] = useState({
		knightsbridgeService: true,
		serviceTax: true,
		vatTax: true
	});
	const [totalAmount, setTotalAmount] = useState(200); // Start with Knightsbridge Service + Mint Token

	const { formData, fileUpload } = useFormContext();
	const [lei, setLei] = useState('');
	const [ISINumber, setISINumber] = useState('');

	const { validateAndSubmit, isSubmitting } = useFormSubmission();

	const handleCheckout = (amount: number) => {
		setTotalAmount(amount);
		setShowPayment(true);
	};

	const handlePayNow = async () => {
		try {
			const result = await validateAndSubmit(formData, 'Knightsbridge', totalAmount, fileUpload);
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
				{/* Hero Section */}
				<section className="w-full flex justify-center pt-[150px] md:pt-[200px] lg:pt-[225px] pb-[80px] md:pb-[108px] px-4">
					<div className="max-w-6xl mx-auto text-center">
						{/* <div className="flex justify-center mb-8">
							<img
								src={Icon}
								alt="Knightsbridge Icon"
								className="w-20 h-20 md:w-24 md:h-24"
							/>
						</div> */}
						<h1 className="text-text-primary text-center text-3xl md:text-5xl lg:text-[75px] font-normal mb-8 md:mb-11 leading-tight">
							Knightsbridge Approved Process
						</h1>
						<p className="text-text-secondary text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
							Submit your business plan, complete KYC, and let our team handle the legal, hosting, and compliance to ensure a secure, vetted token launch.
						</p>
					</div>
				</section>

				<div className="flex flex-col xl:flex-row gap-4 xl:gap-7 mb-[100px] px-4 pb-4 md:px-8 xl:px-16 xl:absolute right-0 w-full">
					<form className="flex-[7] border bg-bg-secondary p-4 md:p-7 rounded-3xl border-border-primary">
						{/* <KYCInformationSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<CustodianInformationSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<IssuerInformationSection />

						<div className="w-full h-px bg-border-primary my-8" />
						<BusinessPlanSection />

						<div className="w-full h-px bg-border-primary my-8" /> */}
						<SavingsPlanSection lei={lei} setLei={setLei} />

						<div className="w-full h-px bg-border-primary my-8" />
						<PensionPlanSection lei={lei} setISINumber={setISINumber} ISINumber={ISINumber} />

						<div className="w-full h-px bg-border-primary my-8" />
						<ContactInformationSection />

						{/* <div className="w-full h-px bg-border-primary my-8" />
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
						<LegalDocumentsSection /> */}
					</form>

					<div className="flex-[3] min-w-0 relative">
						<div className="sticky top-4">
							<KnightsbridgeServicesSidebar
								onCheckout={handleCheckout}
								selectedServices={selectedServices}
								isSubmitting={isSubmitting}
							/>
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

const Knightsbridge: React.FC<KnightsbridgeProps> = (props) => {
	return (
		<FormProvider>
			<KnightsbridgeContent {...props} />
		</FormProvider>
	);
};

export default Knightsbridge;
