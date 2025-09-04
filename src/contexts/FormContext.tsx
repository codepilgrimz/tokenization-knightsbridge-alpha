import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';

interface FormData {
  // Contact Information
  contactEmail: string;
  contactPhone: string;
  
  // KYC Information
  kycFullName: string;
  kycIdNumber: string;
  kycDateOfBirth: string;
  kycNationality: string;
  kycAddress: string;
  kycOccupation: string;
  kycEmployer: string;
  kycIncomeSource: string;
  kycNetWorth: string;
  kycInvestmentExperience: string;
  kycRiskTolerance: string;
  kycInvestmentObjectives: string;
  
  // Custodian Information
  custodianName: string;
  custodianContact: string;
  custodianRegistration: string;
  custodianAddress: string;
  custodianServices: string;
  
  // Issuer Information
  issuerEntityName: string;
  issuerJurisdiction: string;
  issuerContactPerson: string;
  issuerContactInfo: string;
  issuerAddress: string;
  issuerBusinessType: string;
  issuerRegistrationNumber: string;
  
  // Business Plan
  businessPlanType: {
    utility?: boolean;
    security?: boolean;
    governance?: boolean;
    payment?: boolean;
    reward?: boolean;
  };
  businessPlanGuidelines: string;
  businessPlanExecutiveSummary: string;
  businessPlanMarketAnalysis: string;
  businessPlanFinancialProjections: string;

  // Savings Plan
  savingsPlanGuidelines: string;

  // Pension Plan
  pensionPlanGuidelines: string;
  
  // Token Information
  tokenName: string;
  tokenTicker: string;
  tokenChain: string;
  tokenDecimals: string;
  targetPrice: string;
  treasuryAddress: string;
  isStablecoin: boolean;
  
  // Features
  featuresEnabled: boolean;
  tokenFeatures: string[];
  featuresGuidelines: string;
  
  // Services
  letterheadEnabled: boolean;
  letterheadGuidelines: string;
  
  // Raise Document
  raiseDocumentEnabled: boolean;
  raiseDocumentRegion: string;
  raiseDocumentCompany: string;
  raiseDocumentContactName: string;
  raiseDocumentContactPerson: string;
  raiseDocumentPosition: string;
  raiseDocumentEmail: string;
  raiseDocumentPhone: string;
  raiseDocumentAddress: string;
  raiseDocumentWebsite: string;
  
  // White Paper
  whitePaperEnabled: boolean;
  whitePaperPages: string;
  whitePaperGuidelines: string;
  
  // Website Plan
  websitePlanEnabled: boolean;
  websitePlanGuidelines: string;
  
  // Exchange Listings
  exchangeListingEnabled: boolean;
  exchangeListings: string[];
  exchangeListingsPreferences: string;
  
  // Legal Documents
  legalDocumentsEnabled: boolean;
  legalDocuments: string[];
  legalDocumentsPreferences: string;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
  updateArrayField: (field: string, value: string, checked: boolean) => void;
  fileUpload: ReturnType<typeof useFileUpload>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialFormData: FormData = {
  // Contact Information
  contactEmail: '',
  contactPhone: '',
  
  // KYC Information
  kycFullName: '',
  kycIdNumber: '',
  kycDateOfBirth: '',
  kycNationality: '',
  kycAddress: '',
  kycOccupation: '',
  kycEmployer: '',
  kycIncomeSource: '',
  kycNetWorth: '',
  kycInvestmentExperience: '',
  kycRiskTolerance: '',
  kycInvestmentObjectives: '',
  
  // Custodian Information
  custodianName: '',
  custodianContact: '',
  custodianRegistration: '',
  custodianAddress: '',
  custodianServices: '',
  
  // Issuer Information
  issuerEntityName: '',
  issuerJurisdiction: '',
  issuerContactPerson: '',
  issuerContactInfo: '',
  issuerAddress: '',
  issuerBusinessType: '',
  issuerRegistrationNumber: '',
  
  // Business Plan
  businessPlanType: {},
  businessPlanGuidelines: '',
  businessPlanExecutiveSummary: '',
  businessPlanMarketAnalysis: '',
  businessPlanFinancialProjections: '',

  // Savings Plan
  savingsPlanGuidelines: '',

  // Pension Plan
  pensionPlanGuidelines: '',
  
  // Token Information
  tokenName: '',
  tokenTicker: '',
  tokenChain: '',
  tokenDecimals: '',
  targetPrice: '',
  treasuryAddress: '',
  isStablecoin: false,
  
  // Features
  featuresEnabled: false,
  tokenFeatures: [],
  featuresGuidelines: '',
  
  // Services
  letterheadEnabled: false,
  letterheadGuidelines: '',
  
  // Raise Document
  raiseDocumentEnabled: false,
  raiseDocumentRegion: '',
  raiseDocumentCompany: '',
  raiseDocumentContactName: '',
  raiseDocumentContactPerson: '',
  raiseDocumentPosition: '',
  raiseDocumentEmail: '',
  raiseDocumentPhone: '',
  raiseDocumentAddress: '',
  raiseDocumentWebsite: '',
  
  // White Paper
  whitePaperEnabled: false,
  whitePaperPages: '',
  whitePaperGuidelines: '',
  
  // Website Plan
  websitePlanEnabled: false,
  websitePlanGuidelines: '',
  
  // Exchange Listings
  exchangeListingEnabled: false,
  exchangeListings: [],
  exchangeListingsPreferences: '',
  
  // Legal Documents
  legalDocumentsEnabled: false,
  legalDocuments: [],
  legalDocumentsPreferences: '',
};

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const fileUpload = useFileUpload();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof FormData] as string[]), value]
        : (prev[field as keyof FormData] as string[]).filter(item => item !== value)
    }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, updateArrayField, fileUpload }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
