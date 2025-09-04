
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../utils/supabase';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-text-secondary">Loading messages...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="text-sm">
                      {formatDate(message.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {message.name}
                    </TableCell>
                    <TableCell>
                      {message.email}
                    </TableCell>
                    <TableCell>
                      {message.subject}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={message.message}>
                        {message.message}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {messages.length === 0 && (
              <div className="text-center py-8 text-text-secondary">
                No contact messages found.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
