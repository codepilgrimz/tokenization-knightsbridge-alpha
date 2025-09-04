
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../utils/supabase';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Contact: React.FC<ContactProps> = ({ isDarkMode, onThemeToggle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
          }
        ]);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error saving contact message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full min-h-screen relative overflow-x-hidden bg-bg-primary ${!isDarkMode ? 'light' : ''}`}>
      <Header isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />
      
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-text-primary text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Get in touch with our team. We're here to help with your tokenization journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 md:p-8">
            <h2 className="text-text-primary text-2xl font-medium mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-text-primary font-medium mb-1">Email</h3>
                  <p className="text-text-secondary">Help@kxco.io</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-text-primary font-medium mb-1">Phone</h3>
                  <p className="text-text-secondary">+66840041393</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-text-primary font-medium mb-1">Address</h3>
                  <p className="text-text-secondary">
                    622 Emporium Tower<br />
                    Bangkok, Thailand, 10110
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-primary">
              <h3 className="text-text-primary font-medium mb-3">Business Hours</h3>
              <div className="space-y-1 text-text-secondary">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 md:p-8">
            <h2 className="text-text-primary text-2xl font-medium mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-text-primary text-sm font-medium mb-2">
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-bg-primary border-border-primary text-text-primary"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-text-primary text-sm font-medium mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-bg-primary border-border-primary text-text-primary"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-text-primary text-sm font-medium mb-2">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-bg-primary border-border-primary text-text-primary"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-text-primary text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-bg-primary border-border-primary text-text-primary resize-none"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
