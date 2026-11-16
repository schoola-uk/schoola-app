import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, ShieldCheck, Heart, Sparkles, Send } from 'lucide-react';

interface NewsletterSubscriptionProps {
  onSubscribeSuccess: (email: string, frequency: string) => void;
}

export function NewsletterSubscription({ onSubscribeSuccess }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [freq, setFreq] = useState<'ks1' | 'ks2-mid' | 'ks2-upper' | 'all'>('ks1');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const freqLabels = {
    ks1: 'Year 1–2 (KS1)',
    'ks2-mid': 'Year 3–4 (KS2)',
    'ks2-upper': 'Year 5–6 (KS2)',
    all: 'All Years'
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }

    setSubscribed(true);
    onSubscribeSuccess(email, freqLabels[freq]);
  };

  return (
    <section 
      id="newsletter-section" 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white p-8 md:p-12 shadow-xl border border-white/10"
    >
      {/* Decorative radial gradients matching raw HTML specs */}
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-radial from-indigo-500/20 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-radial from-emerald-500/15 to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left column info */}
        <div className="lg:col-span-6 flex flex-col text-left">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-[#fbbf24] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 w-fit select-none">
            <Sparkles className="w-3.5 h-3.5" />
            ✉️ Free Weekly Newsletter
          </div>
          
          <h2 className="font-heading font-black text-2xl md:text-3.5xl text-white leading-tight mb-4 tracking-tight">
            The <span className="italic bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">Schoola Weekly</span> <br />
            for parents who care
          </h2>
          
          <p className="text-sm font-medium text-slate-300 leading-relaxed mb-8 max-w-lg">
            Every Sunday evening, we send a concise, curriculum-focused digest: what your child is learning this week, one interactive activity to try at home, and a free printable worksheet — all matched perfectly to your child's year group.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap mt-auto">
            {[
              { label: 'No spam, ever', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
              { label: 'Unsubscribe anytime', icon: <Check className="w-4 h-4 text-emerald-400" /> },
              { label: '100% free, always', icon: <Heart className="w-4 h-4 text-emerald-400" /> }
            ].map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-300">
                <span className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  {item.icon}
                </span>
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right column subscription form card */}
        <div className="lg:col-span-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl text-left">
            
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="subscribe-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h3 className="font-black text-white text-lg flex items-center gap-2">
                      <span>📬</span> Get the Schoola Weekly
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Join thousands of UK parents — delivered every Sunday
                    </p>
                  </div>

                  {/* Frequency toggle group */}
                  <div className="flex flex-wrap gap-2">
                    {(['ks1', 'ks2-mid', 'ks2-upper', 'all'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFreq(key)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] font-black tracking-wide transition-all cursor-pointer ${
                          freq === key
                            ? 'border-[#fbbf24] text-[#fbbf24] bg-[#fbbf24]/10 shadow-xs'
                            : 'border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {freqLabels[key]}
                      </button>
                    ))}
                  </div>

                  {/* Input row */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white/10 text-white placeholder-slate-400/80 text-xs font-bold outline-hidden transition-all ${
                          error 
                            ? 'border-red-400/60 focus:border-red-400' 
                            : 'border-white/15 focus:border-[#fbbf24]/60'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#fbbf24] hover:scale-[1.02] text-[#1a1a2e] text-xs font-black rounded-xl shadow-lg border-2 border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Subscribe →
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    🔒 We respect your privacy. Unsubscribe at any time. No spam or commercial selling, guaranteed.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="subscribe-success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-6 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 text-[#2DC89A] flex items-center justify-center text-2xl shadow-md mb-4">
                    ✓
                  </div>
                  <h3 className="font-heading font-black text-white text-lg">
                    Subscription Activated!
                  </h3>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed max-w-xs mt-1.5">
                    Magnificent! We have registered <strong>{email}</strong> for the weekly Year Group digest: <strong className="text-[#fbbf24]">{freqLabels[freq]}</strong>.
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold mt-4">
                    ⚡ Sunday's revision scroll is on its way to your inbox!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}
