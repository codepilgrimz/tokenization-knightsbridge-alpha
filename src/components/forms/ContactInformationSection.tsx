
import React, { useEffect, useState } from 'react';
import { CategoryHeader } from '../ui/CategoryHeader';
import { FormInput } from '../ui/FormInput';
import { PhoneInput } from '../ui/PhoneInput';
import { useFormContext } from '../../contexts/FormContext';
import { UploadButton } from '../ui/UploadButton';
import { create } from 'domain';
import { createLEI } from '@/web3';
import { useToast } from '@/hooks/use-toast';

interface ContactInformationSectionProps {
  lei: string;
  isin: string;
  wallet: string;
}

export const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({ lei, isin, wallet }) => {

  const [ time, setTime] = useState<string>(new Date().toISOString());
  const [ isLoading, setIsLoading ] = useState(false);
	const { toast } = useToast();

  useEffect(()=>{
    if(lei){
      setTime(new Date().toISOString());
    }else{
      setTime("");
    }
 
  },[lei, isin, wallet]);

  const handleUpload = async () => {
    if(lei && wallet && time){
      setIsLoading(true);
      const {success, data} = await createLEI({lei, isins: isin? [isin]:[], address: wallet, time: new Date(time).getTime()});
      if(success){
				toast?.({ title: 'Transaction Confirmed', description: `Uploaded LEI(${lei}) data to blockchain. txId: ${data} `, variant: 'default' });
      }else{
        toast?.({ title: 'Transaction Failed', description: `LEI data uploading transaction was failed: ${data}`, variant: 'destructive' });
      }
      setIsLoading(false)
    }
  };

  return (
    <section className="box-border m-0 p-0">
      <CategoryHeader
        title="LEI - ISIN Mapping"
        description=" Legal Entity Identifier - International Securities Identification Number"
        rightContent={
          <button
            type="button"
            disabled={isLoading}
            onClick={handleUpload}
            className="box-border w-[271px] h-16 border flex items-center justify-center gap-8 m-0 p-0 rounded-xl border-solid border-input-border max-sm:w-full cursor-pointer hover:border-text-primary transition-colors"
          >
            <div className="box-border text-text-primary text-xl font-normal m-0 p-0">
              {isLoading ? 'Uploading...' : 'Upload to Blockchain'}
            </div>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-0 p-0 mb-6 pt-4">
        <div className="box-border">
          <FormInput
            disabled
            label="LEI"
            placeholder=""
            value={lei}
            onChange={(e) => {}}
          />
        </div>
        <div className="box-border">
          <FormInput
            label="ISIN"
            placeholder=""
            disabled
            value={isin}
            onChange={(e) => {}}
          />
        </div>
        <div className="box-border">
          <FormInput
            label="Wallet Address"
            placeholder=""
            disabled
            value={wallet}
            onChange={(e) => {}}
          />
        </div>
        <div className="box-border">
          <FormInput
            label="Verified Timestamp"
            placeholder=""
            value={time}
            disabled
            onChange={(e) => {}}
          />
        </div>
      </div>
    </section>
  );
};
