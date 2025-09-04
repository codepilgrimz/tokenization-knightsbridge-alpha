
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface PaymentSidebarProps {
	isVisible: boolean;
	onClose: () => void;
	onPayNow: () => Promise<any>;
	isSubmitting?: boolean;
	totalAmount?: number;
}

// Hook to detect if screen is mobile
const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		handleResize(); // initial check
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile;
};

export const PaymentSidebar: React.FC<PaymentSidebarProps> = ({
	isVisible,
	onClose,
	onPayNow,
	isSubmitting = false,
	totalAmount = 0
}) => {
	const [selectedPayment, setSelectedPayment] = useState('stripe');
	const [isProcessing, setIsProcessing] = useState(false);
	const { toast } = useToast();
	const isMobile = useIsMobile();

	const handleStripePayment = async () => {
		setIsProcessing(true);

		try {
			const submissionDataResult: any = await onPayNow();

			if (!submissionDataResult) throw new Error('Form submission failed');

			const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
				body: {
					amount: totalAmount,
					orderDescription: `Token Services Payment - Stripe`,
					submissionId: submissionDataResult?.submissionId
				}
			});

			if (error) throw error;

			if (data.success && data.payment) {
				// Update payment status to processing when payment link is opened
				if (submissionDataResult?.submissionId) {
					try {
						await supabase.functions.invoke('update-payment-status', {
							body: {
								submissionId: submissionDataResult.submissionId,
								status: 'processing'
							}
						});
					} catch (statusError) {
						console.error('Failed to update payment status:', statusError);
					}
				}

				const newWindow = window.open(data.payment.payment_url, '_blank');
				if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
					// Popup was blocked, fallback to same tab
					window.location.href = data.payment.payment_url;
				} else {
					toast({
						title: "Payment Page Opened",
						description: "Stripe payment page opened in new tab.",
					});
				}
			} else {
				throw new Error('Failed to create Stripe payment');
			}
		} catch (error) {
			console.error('Payment process error:', error);
			toast({
				title: "Payment Error",
				description: "Failed to process payment. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handleCryptoPayment = async (currency: string) => {
		setIsProcessing(true);

		try {
			const submissionDataResult: any = await onPayNow();

			if (!submissionDataResult) throw new Error('Form submission failed');

			const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

			const { data, error } = await supabase.functions.invoke('create-nowpayment', {
				body: {
					amount: totalAmount,
					currency: currency === 'btc' ? 'BTC' : 'USDTTRC20',
					orderId,
					orderDescription: `Token Services Payment - ${currency.toUpperCase()}`,
					submissionId: submissionDataResult?.submissionId
				}
			});

			if (error) throw error;

			if (data.success && data.payment) {
				// Update payment status to processing when payment link is opened
				if (submissionDataResult?.submissionId) {
					try {
						await supabase.functions.invoke('update-payment-status', {
							body: {
								submissionId: submissionDataResult.submissionId,
								status: 'processing'
							}
						});
					} catch (statusError) {
						console.error('Failed to update payment status:', statusError);
					}
				}

				const newWindow = window.open(data.payment.payment_url, '_blank');
				if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
					// Popup was blocked, fallback to same tab
					window.location.href = data.payment.payment_url;
				} else {
					toast({
						title: "Payment Page Opened",
						description: `${currency.toUpperCase()} payment page opened in new tab.`,
					});
				}
			} else {
				throw new Error('Failed to create payment');
			}
		} catch (error) {
			console.error('Payment process error:', error);
			toast({
				title: "Payment Error",
				description: "Failed to process payment. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handlePayNow = async () => {
		if (selectedPayment === 'stripe') {
			await handleStripePayment();
		} else if (selectedPayment === 'btc' || selectedPayment === 'usdt') {
			await handleCryptoPayment(selectedPayment);
		}
	};

	const PaymentContent = () => (
		<div className="h-full w-full bg-bg-secondary p-5">
			<div className="border-l-4 border-white pl-4 mb-8">
				<h2 className="text-text-primary text-[35px] font-normal mb-2">
					Select Payment
				</h2>
				<p className="text-text-secondary text-[17px] font-normal">
					Choose your preferred payment method.
				</p>
			</div>

			<div className="space-y-4">
				{[/*'stripe', */'btc', 'usdt'].map((method) => {
					const labelMap: Record<string, string> = {
						// stripe: 'Stripe',
						btc: 'Bitcoin',
						usdt: 'USDT (TRC20)',
					};

					const symbolMap: Record<string, string> = {
						// stripe: 'S',
						btc: '₿',
						usdt: '₮',
					};

					const colorMap: Record<string, string> = {
						// stripe: 'bg-blue-600',
						btc: 'bg-orange-500',
						usdt: 'bg-green-500',
					};

					return (
						<div
							key={method}
							className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPayment === method
								? 'border-text-primary bg-[rgba(255,255,255,0.05)]'
								: 'border-border-primary hover:border-text-primary'
								}`}
							onClick={() => setSelectedPayment(method)}
						>
							<div className={`w-12 h-12 ${colorMap[method]} rounded-xl flex items-center justify-center mr-4`}>
								<span className="text-white text-xl font-bold">{symbolMap[method]}</span>
							</div>
							<span className="text-text-primary text-xl font-normal flex-1">{labelMap[method]}</span>
							<div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${selectedPayment === method ? 'border-text-primary bg-text-primary' : 'border-border-primary'}`}>
								{selectedPayment === method && (
									<div className="w-3 h-3 bg-bg-primary rounded-full"></div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{totalAmount > 0 && (
				<div className="mt-6 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
					<div className="flex justify-between items-center">
						<span className="text-text-secondary">Total Amount:</span>
						<span className="text-text-primary text-xl font-medium">${totalAmount}</span>
					</div>
				</div>
			)}

			<button
				onClick={handlePayNow}
				disabled={isSubmitting || isProcessing}
				className="w-full py-4 bg-text-primary text-bg-primary text-[17px] font-medium rounded-xl hover:opacity-90 transition-opacity mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isProcessing
					? 'Processing...'
					: isSubmitting
						? 'Submitting Data...'
						: selectedPayment === 'stripe'
							? `Pay $${totalAmount} with Stripe`
							: `Pay $${totalAmount} in ${selectedPayment === 'btc' ? 'Bitcoin' : 'USDT'}`
				}
			</button>
		</div>
	);

	// Render based on screen size
	return (
		<>
			{isMobile ? (
				<Sheet open={isVisible} onOpenChange={onClose}>
					<SheetContent side="bottom" className="h-[90vh] bg-bg-secondary border-border-primary">
						<SheetHeader className="pb-4">
							<SheetTitle className="text-text-primary text-left">Payment Options</SheetTitle>
						</SheetHeader>
						<div className="overflow-y-auto h-full">
							<PaymentContent />
						</div>
					</SheetContent>
				</Sheet>
			) : (
				<>
					<div className={`fixed inset-y-0 right-0 z-50 w-96 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
						<div className="h-full w-full bg-bg-secondary border-l border-border-primary relative">
							<button
								onClick={onClose}
								className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
								aria-label="Close payment panel"
							>
								<X className="w-5 h-5 text-text-primary" />
							</button>
							<PaymentContent />
						</div>
					</div>
					{isVisible && (
						<div
							className="fixed inset-0 bg-black bg-opacity-50 z-40"
							onClick={onClose}
						/>
					)}
				</>
			)}
		</>
	);
};
