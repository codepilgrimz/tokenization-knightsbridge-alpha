
import React, { useState, useEffect } from 'react';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ContactMessages } from '../components/admin/ContactMessages';
import { DataTable } from '../components/admin/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Header } from '../components/Header';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../utils/supabase';

interface FormSubmission {
	id: string;
	type: 'Knightsbridge' | 'Decentralized';
	submissionDate: string;

	// Contact Information (both)
	contactEmail: string;
	contactPhone: string;

	// Knightsbridge specific fields
	kycFullName?: string;
	kycIdNumber?: string;
	kycDateOfBirth?: string;
	kycNationality?: string;
	kycAddress?: string;
	kycOccupation?: string;
	kycEmployer?: string;
	kycIncomeSource?: string;
	kycNetWorth?: string;
	kycInvestmentExperience?: string;
	kycRiskTolerance?: string;
	kycInvestmentObjectives?: string;

	custodianName?: string;
	custodianContact?: string;
	custodianRegistration?: string;
	custodianAddress?: string;
	custodianServices?: string;

	issuerEntityName?: string;
	issuerJurisdiction?: string;
	issuerContactPerson?: string;
	issuerContactInfo?: string;
	issuerAddress?: string;
	issuerBusinessType?: string;
	issuerRegistrationNumber?: string;

	businessPlanType?: string;
	businessPlanGuidelines?: string;
	businessPlanExecutiveSummary?: string;
	businessPlanMarketAnalysis?: string;
	businessPlanFinancialProjections?: string;

	// Token fields (both can have)
	tokenName?: string;
	tokenTicker?: string;
	tokenChain?: string;
	tokenDecimals?: string;
	targetPrice?: string;
	treasuryAddress?: string;

	// Token features
	wantMoreFeatures?: string[];
	features?: string[];
	featuresEnabled?: boolean;
	featuresGuidelines?: string;

	// Services with guidelines
	letterheadEnabled?: boolean;
	letterheadGuidelines?: string;

	raiseDocumentEnabled?: boolean;
	raiseDocumentRegions?: string[];
	raiseDocumentCompany?: string;
	raiseDocumentContactName?: string;
	raiseDocumentContactPerson?: string;
	raiseDocumentPosition?: string;
	raiseDocumentEmail?: string;
	raiseDocumentPhone?: string;
	raiseDocumentAddress?: string;
	raiseDocumentWebsite?: string;

	whitePaperEnabled?: boolean;
	whitePaperPages?: string;
	whitePaperGuidelines?: string;

	websitePlanEnabled?: boolean;
	websitePlanGuidelines?: string;

	exchangeListings?: string[];

	legalDocumentsEnabled?: boolean;
	legalDocuments?: string[];
	legalDocumentsPreferences?: string;

	paymentAmount: number;
	status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'Expired';

	// Add uploaded documents
	uploadedDocuments?: Array<{
		id: string;
		fieldName: string;
		originalFilename: string;
		filePath: string;
		fileSize: number;
		mimeType: string;
	}>;
}

interface AdminDashboardProps {
	isDarkMode: boolean;
	onThemeToggle: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isDarkMode, onThemeToggle }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [activeSection, setActiveSection] = useState<'form-submissions' | 'contact-messages'>('form-submissions');
	const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const fetchSubmissions = async () => {
		setLoading(true);
		try {
			// Check for expired payments first
			await supabase.functions.invoke('check-expired-payments');

			// Use the get-submissions Edge Function instead of direct Supabase queries
			const { data, error } = await supabase.functions.invoke('get-submissions');

			if (error) {
				throw error;
			}

			if (data && data.submissions) {
				setSubmissions(data.submissions);
			} else {
				setSubmissions([]);
			}
		} catch (error) {
			console.error('Error fetching submissions:', error);
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Failed to fetch submissions",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			fetchSubmissions();
		}
	}, [isAuthenticated]);

	const handleLogin = () => {
		setIsAuthenticated(true);
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		toast({
			title: "Logged out",
			description: "You have been logged out successfully",
		});
	};

	const totalSubmissions = submissions.length;
	const knightsbridgeSubmissions = submissions.filter(s => s.type === 'Knightsbridge').length;
	const decentralizedSubmissions = submissions.filter(s => s.type === 'Decentralized').length;
	const totalRevenue = submissions.reduce((sum, s) => sum + s.paymentAmount, 0);

	if (!isAuthenticated) {
		return <AdminLogin onLogin={handleLogin} isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />;
	}

	return (
		<div className="min-h-screen bg-bg-primary">
			<Header isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />
			<div className="flex">
				<AdminSidebar
					activeSection={activeSection}
					onSectionChange={setActiveSection}
				/>

				<div className="flex-1 p-6">
					<div className="max-w-7xl mx-auto">
						<div className="mb-8 flex justify-between items-center">
							<div>
								<h1 className="text-3xl font-bold text-text-primary mb-2">
									{activeSection === 'form-submissions' ? 'Form Submissions' : 'Contact Messages'}
								</h1>
								<p className="text-text-secondary">
									{activeSection === 'form-submissions'
										? 'Manage and monitor form submissions from Knightsbridge and Decentralized processes'
										: 'View and manage contact messages from users'
									}
								</p>
							</div>
							<AdminSettings onLogout={handleLogout} />
						</div>

						{activeSection === 'form-submissions' ? (
							<>
								{/* Stats Cards */}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
									<Card>
										<CardHeader>
											<CardTitle className="text-sm font-medium text-text-secondary">
												Total Submissions
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-text-primary">
												{totalSubmissions}
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="text-sm font-medium text-text-secondary">
												Knightsbridge
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-blue-600">
												{knightsbridgeSubmissions}
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="text-sm font-medium text-text-secondary">
												Decentralized
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-green-600">
												{decentralizedSubmissions}
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="text-sm font-medium text-text-secondary">
												Total Revenue
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-text-primary">
												${totalRevenue.toLocaleString()}
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Data Table */}
								<Card>
									<CardHeader>
										<CardTitle>Form Submissions</CardTitle>
									</CardHeader>
									<CardContent>
										{loading ? (
											<div className="flex items-center justify-center py-8">
												<div className="text-text-secondary">Loading submissions...</div>
											</div>
										) : (
											<DataTable data={submissions} />
										)}
									</CardContent>
								</Card>
							</>
						) : (
							<ContactMessages />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
