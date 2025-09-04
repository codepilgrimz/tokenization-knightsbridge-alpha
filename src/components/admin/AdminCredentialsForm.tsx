
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../utils/supabase';

export const AdminCredentialsForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentCredentials();
  }, []);

  const fetchCurrentCredentials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-credentials', {
        method: 'GET'
      });

      if (error) throw error;

      if (data.success) {
        setCurrentEmail(data.credentials.email);
        setEmail(data.credentials.email);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch current credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        body: { email, password }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: "Admin credentials updated successfully",
        });
        setCurrentEmail(email);
        setPassword('');
      } else {
        throw new Error(data.error || 'Failed to update credentials');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update credentials",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Admin Credentials</CardTitle>
        <p className="text-sm text-text-secondary">
          Current email: {currentEmail}
        </p>
      </CardHeader>
      <CardContent>
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
          <Button 
            type="submit" 
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Updating...' : 'Update Credentials'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
