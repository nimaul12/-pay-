import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, CheckCircle2 } from 'lucide-react';
import { InstallAppModal } from './InstallAppModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'banner' | 'compact' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled && variant === 'header') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold hover:bg-emerald-100 transition-colors ${className}`}
          title="টাকা পে অ্যাপ ইনস্টল করা আছে"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">অ্যাপ ইনস্টলড</span>
        </button>
        {showModal && <InstallAppModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 shadow-xl shadow-emerald-700/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
        >
          {/* Decorative background glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center p-2 shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="টাকা পে অ্যাপ"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wide">
                  মোবাইল অ্যাপ
                </span>
                <span className="text-xs text-emerald-100 font-semibold">
                  {isInstalled ? 'ইনস্টল সম্পন্ন ✓' : 'সরাসরি মোবাইলে চালান'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black mt-1">
                টাকা পে অ্যাপ মোবাইলে ইনস্টল করুন
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5 line-clamp-1">
                ব্রাউজার ছাড়াই দ্রুত এক-ক্লিকে ওপেন করুন ও প্রতিদিন বিকাশ/নগদে ইনকাম করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto relative z-10">
            <button
              onClick={handleClick}
              className="flex-1 sm:flex-initial py-2.5 px-5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>{isInstallable ? '১-ক্লিকে ইনস্টল করুন' : 'অ্যাপ ইনস্টল করুন'}</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="py-2.5 px-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              নিয়মাবলী
            </button>
          </div>
        </div>

        {showModal && <InstallAppModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  // Header / Compact Variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-sm shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:brightness-105 active:scale-95 transition-all cursor-pointer ${className}`}
        title="টাকা পে অ্যাপ আপনার ফোনে ইনস্টল করুন"
      >
        <Download className="w-3.5 h-3.5 animate-pulse" />
        <span>ইনস্টল করুন</span>
      </button>

      {showModal && <InstallAppModal onClose={() => setShowModal(false)} />}
    </>
  );
};
