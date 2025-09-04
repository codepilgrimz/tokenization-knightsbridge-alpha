
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const submissionId = searchParams.get('submissionId');
    if (submissionId) {
      // Update payment status to completed
      supabase.functions.invoke('update-payment-status', {
        body: {
          submissionId,
          status: 'completed'
        }
      }).catch(error => {
        console.error('Failed to update payment status:', error);
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-bg-secondary border border-border-primary rounded-3xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-text-primary text-2xl font-semibold mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-text-secondary mb-6">
          Your cryptocurrency payment has been completed successfully. We'll process your token services request and contact you shortly.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-text-primary text-bg-primary hover:bg-text-secondary"
          >
            Return to Home
          </Button>
          
          <Button 
            onClick={() => navigate('/decentralized')}
            variant="outline"
            className="w-full border-border-primary text-text-primary hover:bg-bg-primary"
          >
            Create Another Token
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
