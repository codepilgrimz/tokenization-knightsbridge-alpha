
import { z } from "zod";

export const KnightsbridgeSchema = z.object({
  type: z.literal('Knightsbridge'),
  
  // Contact Information
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
  
  // KYC Information
  kycFullName: z.string().min(1),
  kycIdNumber: z.string().min(1),
  kycDateOfBirth: z.string().min(1),
  kycNationality: z.string().min(1),
  kycAddress: z.string().min(1),
  kycOccupation: z.string().min(1),
  kycEmployer: z.string().min(1),
  kycIncomeSource: z.string().min(1),
  kycNetWorth: z.string().min(1),
  kycInvestmentExperience: z.string().min(1),
  kycRiskTolerance: z.string().min(1),
  kycInvestmentObjectives: z.string().min(1),
  
  // Custodian Information
  custodianName: z.string().min(1),
  custodianContact: z.string().min(1),
  custodianRegistration: z.string().min(1),
  custodianAddress: z.string().min(1),
  custodianServices: z.string().min(1),
  
  // Issuer Information
  issuerEntityName: z.string().min(1),
  issuerJurisdiction: z.string().min(1),
  issuerContactPerson: z.string().min(1),
  issuerContactInfo: z.string().min(1),
  issuerAddress: z.string().min(1),
  issuerBusinessType: z.string().min(1),
  issuerRegistrationNumber: z.string().min(1),
  
  // Business Plan
  businessPlanType: z.string().min(1),
  businessPlanGuidelines: z.string().optional(),
  businessPlanExecutiveSummary: z.string().optional(),
  businessPlanMarketAnalysis: z.string().optional(),
  businessPlanFinancialProjections: z.string().optional(),
  
  // Token Information
  tokenName: z.string().min(1),
  tokenTicker: z.string().min(1),
  tokenChain: z.string().min(1),
  tokenDecimals: z.string().min(1),
  targetPrice: z.string().min(1),
  treasuryAddress: z.string().min(1),
  
  // Services
  features: z.array(z.string()).optional(),
  letterheadEnabled: z.boolean().optional(),
  letterheadGuidelines: z.string().optional(),
  raiseDocumentRegions: z.array(z.string()).optional(),
  raiseDocumentCompany: z.string().optional(),
  raiseDocumentContactName: z.string().optional(),
  raiseDocumentContactPerson: z.string().optional(),
  raiseDocumentPosition: z.string().optional(),
  raiseDocumentEmail: z.string().optional(),
  raiseDocumentPhone: z.string().optional(),
  raiseDocumentAddress: z.string().optional(),
  raiseDocumentWebsite: z.string().optional(),
  whitePaperPages: z.string().optional(),
  whitePaperGuidelines: z.string().optional(),
  websitePlanEnabled: z.boolean().optional(),
  websitePlanGuidelines: z.string().optional(),
  exchangeListings: z.array(z.string()).optional(),
  legalDocuments: z.array(z.string()).optional(),
  legalDocumentsPreferences: z.string().optional(),
  
  // Payment
  paymentAmount: z.number(),
  
  // Uploaded documents
  uploadedDocuments: z.record(z.object({
    originalFilename: z.string(),
    filePath: z.string(),
    fileSize: z.number(),
    mimeType: z.string()
  })).optional()
});

export const DecentralizedSchema = z.object({
  type: z.literal('Decentralized'),
  
  // Contact Information
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
  
  // Token Information
  tokenName: z.string().min(1),
  tokenTicker: z.string().min(1),
  tokenChain: z.string().min(1),
  tokenDecimals: z.string().min(1),
  targetPrice: z.string().min(1),
  treasuryAddress: z.string().min(1),
  
  // Services
  features: z.array(z.string()).optional(),
  letterheadEnabled: z.boolean().optional(),
  letterheadGuidelines: z.string().optional(),
  raiseDocumentRegions: z.array(z.string()).optional(),
  raiseDocumentCompany: z.string().optional(),
  raiseDocumentContactName: z.string().optional(),
  raiseDocumentContactPerson: z.string().optional(),
  raiseDocumentPosition: z.string().optional(),
  raiseDocumentEmail: z.string().optional(),
  raiseDocumentPhone: z.string().optional(),
  raiseDocumentAddress: z.string().optional(),
  raiseDocumentWebsite: z.string().optional(),
  whitePaperPages: z.string().optional(),
  whitePaperGuidelines: z.string().optional(),
  websitePlanEnabled: z.boolean().optional(),
  websitePlanGuidelines: z.string().optional(),
  exchangeListings: z.array(z.string()).optional(),
  legalDocuments: z.array(z.string()).optional(),
  legalDocumentsPreferences: z.string().optional(),
  
  // Payment
  paymentAmount: z.number(),
  
  // Uploaded documents
  uploadedDocuments: z.record(z.object({
    originalFilename: z.string(),
    filePath: z.string(),
    fileSize: z.number(),
    mimeType: z.string()
  })).optional()
});
