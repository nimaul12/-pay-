import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, X, ExternalLink, Sparkles } from 'lucide-react';

export const SocialBar: React.FC = () => {
  const { ads } = useApp();
  const [dismissed, setDismissed] = useState(false);

  const socialAd = ads.find((a) => a.placement === 'social_bar' && a.status === 'active');
  const popunderAd = ads.find((a) => a.placement === 'popunder' && a.status === 'active');

  // Inject external network scripts dynamically into document
  useEffect(() => {
    // 1. Social bar script from user
    const scriptSrcSocial = 'https://pl31315953.profitableratecpmnetwork.com/0a/06/55/0a065518953dacf835058902cf937356.js';
    let scriptSocial = document.querySelector(`script[src="${scriptSrcSocial}"]`) as HTMLScriptElement;
    if (!scriptSocial) {
      scriptSocial = document.createElement('script');
      scriptSocial.src = scriptSrcSocial;
      scriptSocial.async = true;
      document.body.appendChild(scriptSocial);
    }

    // 2. Popunder script from user
    const scriptSrcPopunder = 'https://pl31315956.profitableratecpmnetwork.com/bb/93/c9/bb93c9bcf3eb77f0a05e5ece073c48d0.js';
    let scriptPop = document.querySelector(`script[src="${scriptSrcPopunder}"]`) as HTMLScriptElement;
    if (!scriptPop) {
      scriptPop = document.createElement('script');
      scriptPop.src = scriptSrcPopunder;
      scriptPop.async = true;
      document.body.appendChild(scriptPop);
    }
  }, []);

  if (dismissed) return null;

  const targetLink =
    socialAd?.targetUrl ||
    'https://www.profitableratecpmnetwork.com/pbt2uwgcaf?key=be8f8a3b7099681eb48e151cfdf2c0f1';

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-30 max-w-md bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-bounce-subtle">
      <a
        href={targetLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 overflow-hidden flex-1 group"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-xs text-slate-200">
          <span className="font-bold text-amber-300 block text-[11px]">
            🔥 স্পন্সর অফার ও রিচার্জ ক্যাশব্যাক!
          </span>
          <span className="text-slate-300 group-hover:underline text-[11px] flex items-center gap-1">
            ক্লিক করে অফারটি সক্রিয় করুন <ExternalLink className="w-3 h-3 text-emerald-400" />
          </span>
        </div>
      </a>

      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors shrink-0"
        aria-label="বন্ধ করুন"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
