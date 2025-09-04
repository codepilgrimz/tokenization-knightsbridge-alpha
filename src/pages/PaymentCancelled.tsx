
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { XCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const submissionId = searchParams.get('submissionId');
    if (submissionId) {
      // Update payment status to cancelled
      supabase.functions.invoke('update-payment-status', {
        body: {
          submissionId,
          status: 'cancelled'
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
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        
        <h1 className="text-text-primary text-2xl font-semibold mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-text-secondary mb-6">
          Your payment was cancelled. No charges were made. You can try again or choose a different payment method.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/decentralized')}
            className="w-full bg-text-primary text-bg-primary hover:bg-text-secondary"
          >
            Try Again
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full border-border-primary text-text-primary hover:bg-bg-primary"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
