'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Recaptcha } from '@/components/forms/recaptcha';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // honeypot field
  });
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpire = () => {
    setRecaptchaToken('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '', website: formData.website });
        setRecaptchaToken('');
        toast.success('Message sent successfully!');
      } else {
        toast.error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your message. I'll get back to you soon.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            disabled={isLoading}
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium">
          Subject *
        </label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="What's this about?"
          disabled={isLoading}
          required
        />
      </div>
      
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell me about your project or just say hello..."
          className="min-h-32"
          disabled={isLoading}
          required
        />
      </div>

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="flex justify-start">
        <Recaptcha
          onVerify={handleRecaptchaVerify}
          onExpire={handleRecaptchaExpire}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !recaptchaToken}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Send className="mr-2 h-4 w-4" />
        Send Message
      </Button>
    </form>
  );
}