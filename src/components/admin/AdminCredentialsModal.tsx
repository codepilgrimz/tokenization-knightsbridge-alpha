
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../utils/supabase';

interface AdminCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCredentialsModal: React.FC<AdminCredentialsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [currentEmail, setCurrentEmail] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // useEffect(() => {
  //   if (isOpen) {
  //     fetchCurrentCredentials();
  //   }
  // }, [isOpen]);

  // const fetchCurrentCredentials = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data, error } = await supabase.functions.invoke('admin-credentials', {
  //       method: 'GET'
  //     });

  //     if (error) {
  //       console.error('Fetch error:', error);
  //       throw error;
  //     }

  //     if (data?.success) {
  //       setCurrentEmail(data.credentials.email);
  //       setEmail(data.credentials.email);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch credentials:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch current credentials",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-credentials', {
        method: 'PUT',
        body: {
          email,
          password
        }
      });

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Success",
          description: "Admin credentials updated successfully",
        });
        // setCurrentEmail(email);
        setPassword('');
        onClose();
      } else {
        throw new Error(data?.error || 'Failed to update credentials');
      }
    } catch (error) {
      console.error('Failed to update credentials:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update credentials",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Admin Credentials</DialogTitle>
          {/* {currentEmail && (
            <p className="text-sm text-text-secondary">
              Current email: {currentEmail}
            </p>
          )} */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">New Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new admin email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new admin password"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isUpdating}
              className="flex-1"
            >
              {isUpdating ? 'Updating...' : 'Update Credentials'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
