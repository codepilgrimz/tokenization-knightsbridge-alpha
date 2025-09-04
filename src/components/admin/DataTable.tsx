import React, { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';
import { ChevronDown, ChevronRight, Eye, Download } from 'lucide-react';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { supabase } from '../../utils/supabase';
import { useToast } from '../../hooks/use-toast';

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

	// Features from "want more features" section
	wantMoreFeatures?: string[];
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

interface DataTableProps {
	data: FormSubmission[];
}

const DocumentsCell: React.FC<{ documents: FormSubmission['uploadedDocuments'] }> = ({ documents }) => {
	const { toast } = useToast();

	const handleDownload = async (filePath: string, filename: string) => {
		try {
			const { data, error } = await supabase.storage
				.from('form-documents')
				.download(filePath);

			if (error) {
				throw error;
			}

			// Create blob URL and trigger download
			const url = URL.createObjectURL(data);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			toast({
				title: "Download started",
				description: `${filename} is being downloaded.`,
			});
		} catch (error) {
			console.error('Download error:', error);
			toast({
				title: "Download failed",
				description: "Failed to download file. Please try again.",
				variant: "destructive",
			});
		}
	};

	if (!documents || documents.length === 0) {
		return <span className="text-muted-foreground text-sm">No documents</span>;
	}

	return (
		<div className="space-y-1">
			{documents.map((doc) => (
				<div key={doc.id} className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleDownload(doc.filePath, doc.originalFilename)}
						className="h-6 px-2 text-xs"
					>
						<Download className="h-3 w-3 mr-1" />
						{doc.originalFilename}
					</Button>
				</div>
			))}
		</div>
	);
};

const FileDownloadButton: React.FC<{ document: { id: string; fieldName: string; originalFilename: string; filePath: string; fileSize: number; mimeType: string; } }> = ({ document: fileDocument }) => {
	const { toast } = useToast();

	const handleDownload = async () => {
		try {
			const { data, error } = await supabase.storage
				.from('form-documents')
				.download(fileDocument.filePath);

			if (error) {
				throw error;
			}

			// Create blob URL and trigger download
			const url = URL.createObjectURL(data);
			const a = document.createElement('a');
			a.href = url;
			a.download = fileDocument.originalFilename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			toast({
				title: "Download started",
				description: `${fileDocument.originalFilename} is being downloaded.`,
			});
		} catch (error) {
			console.error('Download error:', error);
			toast({
				title: "Download failed",
				description: "Failed to download file. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleDownload}
			className="h-6 px-2 text-xs ml-2"
		>
			<Download className="h-3 w-3 mr-1" />
			{fileDocument.originalFilename}
		</Button>
	);
};

const SubmissionDetailDialog: React.FC<{ submission: FormSubmission }> = ({ submission }) => {
	// Helper function to get document by field name
	const getDocumentByFieldName = (fieldName: string) => {
		return submission.uploadedDocuments?.find(doc => doc.fieldName === fieldName);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Eye className="h-4 w-4 mr-1" />
					View Details
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Submission Details - {submission.type}</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="font-semibold text-lg border-b pb-2">Basic Information</h3>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div><strong>Type:</strong></div>
							<div>{submission.type}</div>
							<div><strong>Date:</strong></div>
							<div>{submission.submissionDate}</div>
							<div><strong>Status:</strong></div>
							<div>{submission.status}</div>
							<div><strong>Payment:</strong></div>
							<div>${submission.paymentAmount}</div>
						</div>
					</div>

					{/* Contact Information */}
					<div className="space-y-4">
						<h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div><strong>Email:</strong></div>
							<div>{submission.contactEmail}</div>
							<div><strong>Phone:</strong></div>
							<div>{submission.contactPhone}</div>
						</div>
					</div>

					{/* Token Information */}
					{(submission.tokenName || submission.tokenTicker) && (
						<div className="space-y-4">
							<h3 className="font-semibold text-lg border-b pb-2">Token Information</h3>
							<div className="grid grid-cols-2 gap-2 text-sm">
								{submission.tokenName && (
									<>
										<div><strong>Token Name:</strong></div>
										<div>{submission.tokenName}</div>
									</>
								)}
								{submission.tokenTicker && (
									<>
										<div><strong>Ticker:</strong></div>
										<div>{submission.tokenTicker}</div>
									</>
								)}
								{submission.tokenChain && (
									<>
										<div><strong>Chain:</strong></div>
										<div>{submission.tokenChain}</div>
									</>
								)}
								{submission.tokenDecimals && (
									<>
										<div><strong>Decimals:</strong></div>
										<div>{submission.tokenDecimals}</div>
									</>
								)}
								{submission.targetPrice && (
									<>
										<div><strong>Target Price:</strong></div>
										<div>${submission.targetPrice}</div>
									</>
								)}
								{submission.treasuryAddress && (
									<>
										<div><strong>Treasury:</strong></div>
										<div className="break-all">{submission.treasuryAddress}</div>
									</>
								)}
							</div>
						</div>
					)}

					{/* KYC Information (Knightsbridge only) - Simplified */}
					{submission.type === 'Knightsbridge' && (
						<div className="space-y-4">
							<h3 className="font-semibold text-lg border-b pb-2">KYC Information</h3>
							<div className="grid grid-cols-2 gap-2 text-sm">
								{submission.kycFullName && (
									<>
										<div><strong>Full Name:</strong></div>
										<div className="flex items-center">
											{submission.kycFullName}
											{getDocumentByFieldName('kycProofOfAddress') && (
												<FileDownloadButton document={getDocumentByFieldName('kycProofOfAddress')!} />
											)}
										</div>
									</>
								)}
								{submission.kycIdNumber && (
									<>
										<div><strong>ID Number:</strong></div>
										<div className="flex items-center">
											{submission.kycIdNumber}
											{getDocumentByFieldName('kycProofOfIdentity') && (
												<FileDownloadButton document={getDocumentByFieldName('kycProofOfIdentity')!} />
											)}
										</div>
									</>
								)}
							</div>
						</div>
					)}

					{/* Custodian Information (Knightsbridge only) - Simplified */}
					{submission.type === 'Knightsbridge' && (
						<div className="space-y-4">
							<h3 className="font-semibold text-lg border-b pb-2">Custodian Information</h3>
							<div className="grid grid-cols-2 gap-2 text-sm">
								{submission.custodianName && (
									<>
										<div><strong>Name:</strong></div>
										<div>{submission.custodianName}</div>
									</>
								)}
								{submission.custodianContact && (
									<>
										<div><strong>Contact:</strong></div>
										<div>{submission.custodianContact}</div>
									</>
								)}
								{submission.custodianRegistration && (
									<>
										<div><strong>Registration:</strong></div>
										<div>{submission.custodianRegistration}</div>
									</>
								)}
							</div>
						</div>
					)}

					{/* Issuer Information (Knightsbridge only) - Simplified */}
					{submission.type === 'Knightsbridge' && (
						<div className="space-y-4">
							<h3 className="font-semibold text-lg border-b pb-2">Issuer Information</h3>
							<div className="grid grid-cols-2 gap-2 text-sm">
								{submission.issuerEntityName && (
									<>
										<div><strong>Entity Name:</strong></div>
										<div>{submission.issuerEntityName}</div>
									</>
								)}
								{submission.issuerJurisdiction && (
									<>
										<div><strong>Jurisdiction:</strong></div>
										<div>{submission.issuerJurisdiction}</div>
									</>
								)}
								{submission.issuerContactPerson && (
									<>
										<div><strong>Contact Person:</strong></div>
										<div>{submission.issuerContactPerson}</div>
									</>
								)}
								{submission.issuerContactInfo && (
									<>
										<div><strong>Contact Info:</strong></div>
										<div>{submission.issuerContactInfo}</div>
									</>
								)}
							</div>
						</div>
					)}

					{/* Business Plan (Knightsbridge only) - Simplified */}
					{submission.type === 'Knightsbridge' && (
						<div className="space-y-4">
							<h3 className="font-semibold text-lg border-b pb-2">Business Plan</h3>
							<div className="grid grid-cols-2 gap-2 text-sm">
								{submission.businessPlanType && (
									<>
										<div><strong>Type:</strong></div>
										<div>{submission.businessPlanType}</div>
									</>
								)}
								{submission.businessPlanGuidelines && (
									<>
										<div><strong>Guidelines:</strong></div>
										<div className="flex items-center">
											{submission.businessPlanGuidelines}
											{getDocumentByFieldName('businessPlanGuide') && (
												<FileDownloadButton document={getDocumentByFieldName('businessPlanGuide')!} />
											)}
										</div>
									</>
								)}
							</div>
						</div>
					)}

					{/* Additional Services */}
					<div className="space-y-4 md:col-span-2">
						<h3 className="font-semibold text-lg border-b pb-2">Additional Services</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<strong>Features Enabled:</strong> {submission.featuresEnabled ? '✓ Yes' : '✗ No'}
								{submission.featuresEnabled && submission.featuresGuidelines && (
									<div className="mt-1 p-2 bg-muted rounded text-xs">
										{submission.featuresGuidelines}
									</div>
								)}
							</div>

							<div>
								<div className="flex items-center">
									<strong>Letterhead:</strong> {submission.letterheadEnabled ? '✓ Yes' : '✗ No'}
									{getDocumentByFieldName('letterheadBrandGuide') && (
										<FileDownloadButton document={getDocumentByFieldName('letterheadBrandGuide')!} />
									)}
								</div>
								{submission.letterheadEnabled && submission.letterheadGuidelines && (
									<div className="mt-1 p-2 bg-muted rounded">
										{submission.letterheadGuidelines}
									</div>
								)}
							</div>

							<div>
								<strong>Raise Document:</strong> {submission.raiseDocumentEnabled ? '✓ Yes' : '✗ No'}
							</div>

							<div>
								<div className="flex items-center">
									<strong>Website Plan:</strong> {submission.websitePlanEnabled ? '✓ Yes' : '✗ No'}
									{getDocumentByFieldName('websitePlanDesignGuide') && (
										<FileDownloadButton document={getDocumentByFieldName('websitePlanDesignGuide')!} />
									)}
								</div>
								{submission.websitePlanEnabled && submission.websitePlanGuidelines && (
									<div className="mt-1 p-2 bg-muted rounded">
										{submission.websitePlanGuidelines}
									</div>
								)}
							</div>

							<div>
								<strong>WhitePaper:</strong> {submission.whitePaperEnabled ? '✓ Yes' : '✗ No'}
								{submission.whitePaperEnabled && submission.whitePaperPages && (
									<div className="mt-1 text-muted-foreground">
										Pages: {submission.whitePaperPages}
									</div>
								)}
								{submission.whitePaperEnabled && submission.whitePaperGuidelines && (
									<div className="mt-1 p-2 bg-muted rounded">
										{submission.whitePaperGuidelines}
									</div>
								)}
							</div>

							<div>
								<strong>Legal Documents:</strong> {submission.legalDocumentsEnabled ? '✓ Yes' : '✗ No'}
							</div>

							<div>
								<strong>Exchanges:</strong>
								{submission.exchangeListings && submission.exchangeListings.length > 0 ? (
									<span> {submission.exchangeListings.join(', ')}</span>
								) : (
									<span> None</span>
								)}
							</div>
						</div>
					</div>

					{/* Token Features */}
					<div className="space-y-4 md:col-span-2">
						<h3 className="font-semibold text-lg border-b pb-2">Token Features</h3>
						<div className="text-sm">
							{submission.wantMoreFeatures && submission.wantMoreFeatures.length > 0 ? (
								<ul className="list-disc list-inside space-y-1">
									{submission.wantMoreFeatures.map((feature, index) => (
										<li key={index}>{feature}</li>
									))}
								</ul>
							) : (
								<div className="text-gray-500">No additional features selected</div>
							)}
						</div>
					</div>

					{/* Documents */}
					<div className="space-y-4 md:col-span-2">
						<h3 className="font-semibold text-lg border-b pb-2">Documents</h3>

						{/* Raise Documents */}
						{submission.raiseDocumentRegions && submission.raiseDocumentRegions.length > 0 ? (
							<div className="mb-4">
								<h4 className="font-medium text-md mb-2">Raise Documents - Regions: {submission.raiseDocumentRegions.join(', ')}</h4>
								<div className="text-sm space-y-1">
									{submission.raiseDocumentCompany && (
										<div><strong>Company Name:</strong> {submission.raiseDocumentCompany}</div>
									)}
									{submission.raiseDocumentContactName && (
										<div><strong>Contact Name:</strong> {submission.raiseDocumentContactName}</div>
									)}
									{submission.raiseDocumentContactPerson && (
										<div><strong>Contact Person:</strong> {submission.raiseDocumentContactPerson}</div>
									)}
									{submission.raiseDocumentPosition && (
										<div><strong>Position in Company:</strong> {submission.raiseDocumentPosition}</div>
									)}
									{submission.raiseDocumentEmail && (
										<div><strong>Email:</strong> {submission.raiseDocumentEmail}</div>
									)}
									{submission.raiseDocumentPhone && (
										<div><strong>Phone No.:</strong> {submission.raiseDocumentPhone}</div>
									)}
									{submission.raiseDocumentAddress && (
										<div><strong>Company Address:</strong> {submission.raiseDocumentAddress}</div>
									)}
									{submission.raiseDocumentWebsite && (
										<div><strong>Website URL:</strong> {submission.raiseDocumentWebsite}</div>
									)}
								</div>
							</div>
						) : (
							<div className="mb-4">
								<h4 className="font-medium text-md mb-2">Raise Documents</h4>
								<div className="text-sm text-gray-500">None selected</div>
							</div>
						)}

						{/* Legal Documents */}
						{submission.legalDocuments && submission.legalDocuments.length > 0 ? (
							<div>
								<h4 className="font-medium text-md mb-2">Legal Documents:</h4>
								<div className="text-sm space-y-2">
									{submission.legalDocumentsPreferences && (
										<div className="p-2 bg-muted rounded">
											{submission.legalDocumentsPreferences}
										</div>
									)}
									<ul className="list-disc list-inside space-y-1">
										{submission.legalDocuments.map((doc, index) => (
											<li key={index}>{doc}</li>
										))}
									</ul>
								</div>
							</div>
						) : (
							<div>
								<h4 className="font-medium text-md mb-2">Legal Documents</h4>
								<div className="text-sm text-gray-500">None selected</div>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Helper function to get document by field name
	const getDocumentByFieldName = (submission: FormSubmission, fieldName: string) => {
		return submission.uploadedDocuments?.find(doc => doc.fieldName === fieldName);
	};

	const toggleRow = (id: string) => {
		const newExpanded = new Set(expandedRows);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedRows(newExpanded);
	};

	// Calculate pagination
	const totalPages = Math.ceil(data.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = data.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setExpandedRows(new Set()); // Clear expanded rows when changing pages
	};

	const renderPaginationItems = () => {
		const items = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total is small
			for (let i = 1; i <= totalPages; i++) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							href="#"
							isActive={currentPage === i}
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(i);
							}}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			}
		} else {
			// Show truncated pagination
			items.push(
				<PaginationItem key={1}>
					<PaginationLink
						href="#"
						isActive={currentPage === 1}
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(1);
						}}
					>
						1
					</PaginationLink>
				</PaginationItem>
			);

			if (currentPage > 3) {
				items.push(
					<PaginationItem key="ellipsis1">
						<PaginationEllipsis />
					</PaginationItem>
				);
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							href="#"
							isActive={currentPage === i}
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(i);
							}}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			}

			if (currentPage < totalPages - 2) {
				items.push(
					<PaginationItem key="ellipsis2">
						<PaginationEllipsis />
					</PaginationItem>
				);
			}

			if (totalPages > 1) {
				items.push(
					<PaginationItem key={totalPages}>
						<PaginationLink
							href="#"
							isActive={currentPage === totalPages}
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(totalPages);
							}}
						>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
				);
			}
		}

		return items;
	};

	return (
		<div className="space-y-4">
			<div className="rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]"></TableHead>
							<TableHead className="min-w-[100px]">ID</TableHead>
							<TableHead className="min-w-[100px]">Type</TableHead>
							<TableHead className="min-w-[120px]">Date</TableHead>
							<TableHead className="min-w-[200px]">Contact Email</TableHead>
							<TableHead className="min-w-[150px]">Contact Phone</TableHead>
							<TableHead className="min-w-[150px]">Token/Project</TableHead>
							<TableHead className="min-w-[120px]">Payment</TableHead>
							<TableHead className="min-w-[100px]">Status</TableHead>
							<TableHead className="min-w-[150px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentData.length === 0 ? (
							<TableRow>
								<TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
									No submissions found
								</TableCell>
							</TableRow>
						) : (
							currentData.map((submission) => (
								<React.Fragment key={submission.id}>
									<TableRow className="hover:bg-muted/50">
										<TableCell>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => toggleRow(submission.id)}
												className="p-0 h-6 w-6"
											>
												{expandedRows.has(submission.id) ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												)}
											</Button>
										</TableCell>
										<TableCell>
											<span className="text-xs font-mono text-muted-foreground">
												{submission.id.slice(0, 5) + '...' + submission.id.slice(-3)}
											</span>
										</TableCell>
										<TableCell className="font-medium">
											<span className={`px-2 py-1 rounded-full text-xs ${submission.type === 'Knightsbridge'
												? 'bg-blue-100 text-blue-800'
												: 'bg-green-100 text-green-800'
												}`}>
												{submission.type}
											</span>
										</TableCell>
										<TableCell>{submission.submissionDate}</TableCell>
										<TableCell>{submission.contactEmail}</TableCell>
										<TableCell>{submission.contactPhone}</TableCell>
										<TableCell>
											<div className="space-y-1">
												<div className="font-medium">{submission.tokenName || 'N/A'}</div>
												{submission.tokenTicker && (
													<div className="text-xs text-muted-foreground">
														{submission.tokenTicker} • {submission.tokenChain}
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>${submission.paymentAmount}</TableCell>
										<TableCell>
											<span className={`px-2 py-1 rounded-full text-xs ${
												submission.status === 'Completed'
													? 'bg-green-100 text-green-800'
													: submission.status === 'Processing'
														? 'bg-yellow-100 text-yellow-800'
														: submission.status === 'Cancelled'
															? 'bg-red-100 text-red-800'
															: submission.status === 'Expired'
																? 'bg-orange-100 text-orange-800'
																: 'bg-gray-100 text-gray-800'
											}`}>
												{submission.status}
											</span>
										</TableCell>
										<TableCell>
											<SubmissionDetailDialog submission={submission} />
										</TableCell>
									</TableRow>

									{expandedRows.has(submission.id) && (
										<TableRow className="bg-muted/30">
											<TableCell colSpan={10} className="p-6">
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
													{/* Token Details - Display ALL token fields */}
													{(submission.tokenName || submission.tokenTicker) && (
														<div className="space-y-2">
															<h4 className="font-semibold text-sm text-blue-700 border-b border-blue-200 pb-1">Token Information</h4>
															<div className="text-xs space-y-1">
																{submission.tokenName && <div><strong>Token Name:</strong> {submission.tokenName}</div>}
																{submission.tokenTicker && <div><strong>Ticker:</strong> {submission.tokenTicker}</div>}
																{submission.tokenChain && <div><strong>Chain:</strong> {submission.tokenChain}</div>}
																{submission.tokenDecimals && <div><strong>Decimals:</strong> {submission.tokenDecimals}</div>}
																{submission.targetPrice && <div><strong>Target Price:</strong> ${submission.targetPrice}</div>}
																{submission.treasuryAddress && (
																	<div><strong>Treasury:</strong> {submission.treasuryAddress.substring(0, 20)}...</div>
																)}
															</div>
														</div>
													)}

													{/* Token Features */}
													<div className="space-y-2">
														<h4 className="font-semibold text-sm text-green-700 border-b border-green-200 pb-1">Token Features</h4>
														<div className="text-xs space-y-1">
															<div><strong>Features Enabled:</strong> {submission.featuresEnabled ? '✓ Yes' : '✗ No'}</div>
															{submission.featuresGuidelines && (
																<div className="p-2 bg-muted rounded">
																	<strong>Guidelines:</strong> {submission.featuresGuidelines}
																</div>
															)}
															{submission.wantMoreFeatures && submission.wantMoreFeatures.length > 0 ? (
																<div>
																	<strong>Selected Features:</strong>
																	{submission.wantMoreFeatures.map((feature, index) => (
																		<div key={index}>• {feature}</div>
																	))}
																</div>
															) : (
																<div className="text-gray-500">No additional features selected</div>
															)}
														</div>
													</div>

													{/* KYC & Business Info (Knightsbridge) - Display ALL data with file downloads */}
													{submission.type === 'Knightsbridge' && (
														<div className="space-y-2">
															<h4 className="font-semibold text-sm text-purple-700 border-b border-purple-200 pb-1">KYC & Business</h4>
															<div className="text-xs space-y-1">
																{/* KYC Data with file attachments */}
																{submission.kycFullName && (
																	<div className="flex items-center justify-between">
																		<span><strong>KYC Name:</strong> {submission.kycFullName}</span>
																		{getDocumentByFieldName(submission, 'kycProofOfAddress') && (
																			<FileDownloadButton document={getDocumentByFieldName(submission, 'kycProofOfAddress')!} />
																		)}
																	</div>
																)}
																{submission.kycIdNumber && (
																	<div className="flex items-center justify-between">
																		<span><strong>ID Number:</strong> {submission.kycIdNumber}</span>
																		{getDocumentByFieldName(submission, 'kycProofOfIdentity') && (
																			<FileDownloadButton document={getDocumentByFieldName(submission, 'kycProofOfIdentity')!} />
																		)}
																	</div>
																)}
																{submission.kycDateOfBirth && <div><strong>Date of Birth:</strong> {submission.kycDateOfBirth}</div>}
																{submission.kycNationality && <div><strong>Nationality:</strong> {submission.kycNationality}</div>}
																{submission.kycAddress && <div><strong>Address:</strong> {submission.kycAddress}</div>}
																{submission.kycOccupation && <div><strong>Occupation:</strong> {submission.kycOccupation}</div>}
																{submission.kycEmployer && <div><strong>Employer:</strong> {submission.kycEmployer}</div>}
																{submission.kycIncomeSource && <div><strong>Income Source:</strong> {submission.kycIncomeSource}</div>}
																{submission.kycNetWorth && <div><strong>Net Worth:</strong> {submission.kycNetWorth}</div>}
																{submission.kycInvestmentExperience && <div><strong>Investment Experience:</strong> {submission.kycInvestmentExperience}</div>}
																{submission.kycRiskTolerance && <div><strong>Risk Tolerance:</strong> {submission.kycRiskTolerance}</div>}
																{submission.kycInvestmentObjectives && <div><strong>Investment Objectives:</strong> {submission.kycInvestmentObjectives}</div>}

																{/* Custodian Data */}
																{submission.custodianName && <div><strong>Custodian Name:</strong> {submission.custodianName}</div>}
																{submission.custodianContact && <div><strong>Custodian Contact:</strong> {submission.custodianContact}</div>}
																{submission.custodianRegistration && <div><strong>Custodian Registration:</strong> {submission.custodianRegistration}</div>}
																{submission.custodianAddress && <div><strong>Custodian Address:</strong> {submission.custodianAddress}</div>}
																{submission.custodianServices && <div><strong>Custodian Services:</strong> {submission.custodianServices}</div>}

																{/* Issuer Data */}
																{submission.issuerEntityName && <div><strong>Issuer Entity:</strong> {submission.issuerEntityName}</div>}
																{submission.issuerJurisdiction && <div><strong>Issuer Jurisdiction:</strong> {submission.issuerJurisdiction}</div>}
																{submission.issuerContactPerson && <div><strong>Issuer Contact:</strong> {submission.issuerContactPerson}</div>}
																{submission.issuerContactInfo && <div><strong>Issuer Contact Info:</strong> {submission.issuerContactInfo}</div>}
																{submission.issuerAddress && <div><strong>Issuer Address:</strong> {submission.issuerAddress}</div>}
																{submission.issuerBusinessType && <div><strong>Business Type:</strong> {submission.issuerBusinessType}</div>}
																{submission.issuerRegistrationNumber && <div><strong>Registration Number:</strong> {submission.issuerRegistrationNumber}</div>}

																{/* Business Plan Data with file attachment */}
																{submission.businessPlanType && <div><strong>Business Plan Type:</strong> {submission.businessPlanType}</div>}
																{submission.businessPlanGuidelines && (
																	<div className="flex items-center justify-between">
																		<span><strong>Business Plan Guidelines:</strong> {submission.businessPlanGuidelines}</span>
																		{getDocumentByFieldName(submission, 'businessPlanGuide') && (
																			<FileDownloadButton document={getDocumentByFieldName(submission, 'businessPlanGuide')!} />
																		)}
																	</div>
																)}
																{submission.businessPlanExecutiveSummary && <div><strong>Executive Summary:</strong> {submission.businessPlanExecutiveSummary}</div>}
																{submission.businessPlanMarketAnalysis && <div><strong>Market Analysis:</strong> {submission.businessPlanMarketAnalysis}</div>}
																{submission.businessPlanFinancialProjections && <div><strong>Financial Projections:</strong> {submission.businessPlanFinancialProjections}</div>}
															</div>
														</div>
													)}

													{/* Additional Services Section with file downloads */}
													<div className="space-y-2">
														<h4 className="font-semibold text-sm text-orange-700 border-b border-orange-200 pb-1">Additional Services</h4>
														<div className="text-xs space-y-2">
															<div>
																<div className="flex items-center justify-between">
																	<span><strong>Letterhead:</strong> {submission.letterheadEnabled ? '✓ Yes' : '✗ No'}</span>
																	{getDocumentByFieldName(submission, 'letterheadBrandGuide') && (
																		<FileDownloadButton document={getDocumentByFieldName(submission, 'letterheadBrandGuide')!} />
																	)}
																</div>
																{submission.letterheadEnabled && submission.letterheadGuidelines && (
																	<div className="mt-1 p-2 bg-muted rounded">
																		{submission.letterheadGuidelines}
																	</div>
																)}
															</div>
															<div>
																<strong>Raise Document:</strong> {submission.raiseDocumentEnabled ? '✓ Yes' : '✗ No'}
															</div>
															<div>
																<div className="flex items-center justify-between">
																	<span><strong>Website Plan:</strong> {submission.websitePlanEnabled ? '✓ Yes' : '✗ No'}</span>
																	{getDocumentByFieldName(submission, 'websitePlanDesignGuide') && (
																		<FileDownloadButton document={getDocumentByFieldName(submission, 'websitePlanDesignGuide')!} />
																	)}
																</div>
																{submission.websitePlanEnabled && submission.websitePlanGuidelines && (
																	<div className="mt-1 p-2 bg-muted rounded">
																		{submission.websitePlanGuidelines}
																	</div>
																)}
															</div>
															<div>
																<strong>WhitePaper:</strong> {submission.whitePaperEnabled ? '✓ Yes' : '✗ No'}
																{submission.whitePaperEnabled && submission.whitePaperPages && (
																	<div className="mt-1 text-muted-foreground">
																		Pages: {submission.whitePaperPages}
																	</div>
																)}
																{submission.whitePaperEnabled && submission.whitePaperGuidelines && (
																	<div className="mt-1 p-2 bg-muted rounded">
																		{submission.whitePaperGuidelines}
																	</div>
																)}
															</div>
															<div>
																<strong>Legal Documents:</strong> {submission.legalDocumentsEnabled ? '✓ Yes' : '✗ No'}
															</div>
															<div>
																<strong>Exchanges:</strong> {submission.exchangeListings && submission.exchangeListings.length > 0 ? submission.exchangeListings.join(', ') : 'None'}
															</div>
														</div>
													</div>

													{/* Documents Section */}
													<div className="space-y-2 md:col-span-2">
														<h4 className="font-semibold text-sm text-red-700 border-b border-red-200 pb-1">Documents</h4>
														<div className="text-xs space-y-3">
															{/* Raise Documents */}
															{submission.raiseDocumentRegions && submission.raiseDocumentRegions.length > 0 ? (
																<div>
																	<div><strong>Raise Documents - Regions:</strong> {submission.raiseDocumentRegions.join(', ')}</div>
																	<div className="ml-2 mt-1 space-y-0.5">
																		{submission.raiseDocumentCompany && <div><strong>Company Name:</strong> {submission.raiseDocumentCompany}</div>}
																		{submission.raiseDocumentContactName && <div><strong>Contact Name:</strong> {submission.raiseDocumentContactName}</div>}
																		{submission.raiseDocumentContactPerson && <div><strong>Contact Person:</strong> {submission.raiseDocumentContactPerson}</div>}
																		{submission.raiseDocumentPosition && <div><strong>Position in Company:</strong> {submission.raiseDocumentPosition}</div>}
																		{submission.raiseDocumentEmail && <div><strong>Email:</strong> {submission.raiseDocumentEmail}</div>}
																		{submission.raiseDocumentPhone && <div><strong>Phone No.:</strong> {submission.raiseDocumentPhone}</div>}
																		{submission.raiseDocumentAddress && <div><strong>Company Address:</strong> {submission.raiseDocumentAddress}</div>}
																		{submission.raiseDocumentWebsite && <div><strong>Website URL:</strong> {submission.raiseDocumentWebsite}</div>}
																	</div>
																</div>
															) : (
																<div>
																	<div><strong>Raise Documents:</strong> None</div>
																</div>
															)}

															{/* Legal Documents */}
															{submission.legalDocuments && submission.legalDocuments.length > 0 ? (
																<div>
																	<div><strong>Legal Documents:</strong></div>
																	{submission.legalDocumentsPreferences && (
																		<div className="mt-1 p-2 bg-muted rounded">
																			{submission.legalDocumentsPreferences}
																		</div>
																	)}
																	<div className="ml-2 mt-1 space-y-0.5">
																		{submission.legalDocuments.map((doc, index) => (
																			<div key={index}>• {doc}</div>
																		))}
																	</div>
																</div>
															) : (
																<div>
																	<div><strong>Legal Documents:</strong> None</div>
																</div>
															)}
														</div>
													</div>
												</div>
											</TableCell>
										</TableRow>
									)}
								</React.Fragment>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
					</div>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									onClick={(e) => {
										e.preventDefault();
										if (currentPage > 1) {
											handlePageChange(currentPage - 1);
										}
									}}
									className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
								/>
							</PaginationItem>

							{renderPaginationItems()}

							<PaginationItem>
								<PaginationNext
									href="#"
									onClick={(e) => {
										e.preventDefault();
										if (currentPage < totalPages) {
											handlePageChange(currentPage + 1);
										}
									}}
									className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
};
