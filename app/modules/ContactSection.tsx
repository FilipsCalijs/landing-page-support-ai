'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function ContactSection() {
  const t = useTranslations('Main');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', plan: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Label and input styles
  const labelStyles = "block text-center text-sm font-bold text-[#1A1A1A] mb-2";
  const inputStyles = "w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-base shadow-sm";

  return (
    // Added centering and background
    <section id="contact-us" className="w-full mt-32 px-4 flex justify-center bg-[url('/bg-pattern.png')] bg-repeat">
      <div className="w-full max-w-[784px] mx-auto text-center">
         <Typography 
              variant="h2" 
              weight="bold" 
            >
              {t('ContactUs.title')}
            </Typography>
        <Card 
          variant="default" 
          className="w-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <CardContent padding="lg" className="p-8 md:p-16">

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="space-y-2">
                <label className={labelStyles}>{t('ContactUs.name')}</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('ContactUs.entername')} 
                  className={inputStyles}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={labelStyles}>{t('ContactUs.email')}</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('ContactUs.enterEmail')} 
                  className={inputStyles}
                  required
                />
              </div>

              {/* Choose Plan */}
              <div className="space-y-2">
                <label className={labelStyles}>{t('ContactUs.plan')}</label>
                <div className="relative">
                  <select 
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    className={cn(inputStyles, "appearance-none cursor-pointer pr-10", !formData.plan && "text-gray-500")}
                    required
                  >
                    <option value="" disabled>{t('ContactUs.choosePlan')}</option>
                    <option value="starter">Starter</option>
                    <option value="business">Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className={labelStyles}>{t('ContactUs.message')}</label>
                <textarea 
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t('ContactUs.enterMessage')} 
                  className={cn(inputStyles, "resize-none")}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit"
                  variant="primary" 
                  size="md" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : t('ContactUs.sumbit')}
                </Button>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-sm mt-2 text-center">Message sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-sm mt-2 text-center">Failed to send message. Please try again.</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}