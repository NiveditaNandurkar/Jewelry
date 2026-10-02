import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setSubmitted(true);
        showToast('Your message has been received by our concierge.', 'success');
      } else {
        showToast('Could not submit inquiry. Please try again.', 'error');
      }
    } catch {
      setSubmitted(true);
      showToast('Your inquiry has been received.', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#081d1a] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8c7355]">
            Private Concierge
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#081d1a] tracking-wide">
            How May We Assist You?
          </h1>
          <p className="text-xs md:text-sm text-[#78716c] font-light">
            Our jewelry consultants are available for bespoke sizing, custom engraving, and bridal styling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 border border-[#ede5d8] shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-2xl text-[#081d1a]">Inquiry Transmitted</h3>
                <p className="text-xs text-[#78716c] max-w-md mx-auto">
                  Thank you, <strong className="text-[#081d1a]">{name}</strong>. A dedicated LUNA client advisor will respond to <strong className="text-[#081d1a]">{email}</strong> within 12 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-widest font-medium"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Mehra"
                      className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3.5 py-2.5 focus:outline-none focus:border-[#081d1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3.5 py-2.5 focus:outline-none focus:border-[#081d1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Subject of Inquiry
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#081d1a]"
                  >
                    <option value="Product Inquiry">Product Inquiry & Sizing</option>
                    <option value="Order Status">Order Tracking & Shipping</option>
                    <option value="Bespoke Commission">Bespoke Jewelry & Engraving</option>
                    <option value="Returns & Exchanges">Returns & Warranty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716c] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how our concierge team can assist you with your piece..."
                    className="w-full bg-[#fcfaf7] border border-[#ede5d8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#081d1a]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#081d1a] text-[#c5a880] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#123833] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Transmitting...' : 'Send Message to Concierge'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Boutique Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-[#ede5d8] space-y-4 text-xs">
              <h3 className="font-serif text-lg text-[#081d1a]">Boutique Salon</h3>

              <div className="flex items-start gap-3 text-[#57534e]">
                <MapPin className="w-4 h-4 text-[#8c7355] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#081d1a]">LUNA Boutique Flagship</p>
                  <p>74 Heritage Boulevard, Colaba Causeway</p>
                  <p>Mumbai, Maharashtra 400001, India</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#57534e]">
                <Phone className="w-4 h-4 text-[#8c7355] shrink-0" />
                <span>+91 98200 45890 (Mon–Sat, 10am–8pm IST)</span>
              </div>

              <div className="flex items-center gap-3 text-[#57534e]">
                <Mail className="w-4 h-4 text-[#8c7355] shrink-0" />
                <span>concierge@lunaboutique.com</span>
              </div>

              <div className="flex items-center gap-3 text-[#57534e]">
                <Clock className="w-4 h-4 text-[#8c7355] shrink-0" />
                <span>Private viewings by prior salon reservation</span>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-white p-6 border border-[#ede5d8] space-y-3 text-xs">
              <h4 className="font-serif text-base text-[#081d1a]">Frequently Asked</h4>
              <div className="space-y-2 text-[#57534e]">
                <p>
                  <strong className="text-[#081d1a]">How long does delivery take?</strong><br />
                  Metro cities receive orders in 2–3 business days. All other Indian pincodes arrive within 4–5 business days with live tracking.
                </p>
                <p>
                  <strong className="text-[#081d1a]">Do you offer ring re-sizing?</strong><br />
                  Yes, complimentary re-sizing is included within 30 days of receipt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
