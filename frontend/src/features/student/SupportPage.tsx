import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SupportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">How can we help you?</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Have questions about your application? Our support team is here to assist you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Contact Support</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Fill out the form below and we'll get back to you shortly.</p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Message Sent Successfully!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Ticket #TK-2024-892 has been created. We will respond to your registered email within 2-3 working hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category*</label>
                    <select 
                      required 
                      defaultValue=""
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all invalid:text-slate-400"
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="Application Issue">Application Issue</option>
                      <option value="Payment Problem">Payment Problem</option>
                      <option value="Document Verification">Document Verification</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority*</label>
                    <select 
                      required 
                      defaultValue=""
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all invalid:text-slate-400"
                    >
                      <option value="" disabled>Select priority</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Please describe your issue in detail..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>Our support team typically responds within 24 hours. For urgent matters, please use the helpline.</p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg" isLoading={isSubmitting} className="min-w-[150px]">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-brand-600 dark:bg-brand-700 rounded-2xl p-8 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-brand-100 text-sm font-medium mb-1">Call us</p>
                  <p className="font-semibold">+91 1800-123-4567</p>
                  <p className="text-xs text-brand-200 mt-1">Mon-Fri, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-brand-100 text-sm font-medium mb-1">Email us</p>
                  <p className="font-semibold">support@uniapply.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-brand-100 text-sm font-medium mb-1">Visit us</p>
                  <p className="font-semibold">UniApply HQ, Tech Park</p>
                  <p className="text-xs text-brand-200 mt-1">Gurugram, Haryana - 122018</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300 cursor-pointer list-none text-sm">
                  <span>How do I track my application?</span>
                  <span className="transition-transform group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                  You can track your application status from the Dashboard or My Applications page. We also send email updates.
                </p>
              </details>
              <hr className="border-slate-100 dark:border-slate-800" />
              <details className="group">
                <summary className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300 cursor-pointer list-none text-sm">
                  <span>Can I edit my application?</span>
                  <span className="transition-transform group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                  Once submitted, applications can only be edited if an admin requests changes.
                </p>
              </details>

              <hr className="border-slate-100 dark:border-slate-800" />
              <details className="group">
                <summary className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300 cursor-pointer list-none text-sm">
                  <span>Can I withdraw my application after successful payment?</span>
                  <span className="transition-transform group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                  Once paid, applications can only be withdrawed manually by system engineers after admin approval. Refund will be handled by accounts. Contact support if you made a critical error.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};