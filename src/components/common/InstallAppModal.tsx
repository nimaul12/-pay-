import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  X,
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  MoreVertical,
  PlusSquare,
  Sparkles,
  Laptop,
  Apple,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InstallAppModalProps {
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : 'android'
  );
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const handleDirectInstall = async () => {
    setIsInstalling(true);
    const success = await install();
    setIsInstalling(false);
    if (success) {
      setInstallSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 pb-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center p-1.5 shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="টাকা পে লোগো"
                className="w-full h-full rounded-xl object-contain"
                onError={(e) => {
                  // Fallback to SVG if png not loaded
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  অফিসিয়াল অ্যাপ
                </span>
                <span className="text-xs text-emerald-100 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> ভেরিফাইড
                </span>
              </div>
              <h3 className="text-xl font-black mt-0.5">টাকা পে (TakaPay) ইনস্টল</h3>
              <p className="text-xs text-emerald-100 font-medium">
                হোমস্ক্রিনে যুক্ত করে ফুল-স্ক্রিন অ্যাপের মতো ব্যবহার করুন
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="p-5 pb-3 border-b border-slate-100 bg-slate-50/70">
          {installSuccess || isInstalled ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">অভিনন্দন! অ্যাপটি সফলভাবে ইনস্টল হয়েছে 🎉</p>
                <p className="text-[11px] text-emerald-700">
                  এখন আপনার মোবাইল হোমস্ক্রিন বা অ্যাপ ড্রয়ার থেকে সরাসরি ওপেন করতে পারবেন।
                </p>
              </div>
            </div>
          ) : isInstallable ? (
            <button
              onClick={handleDirectInstall}
              disabled={isInstalling}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>{isInstalling ? 'ইনস্টল হচ্ছে...' : '📲 ১-ক্লিকে এখনই ইনস্টল করুন (Install Now)'}</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold">সরাসরি হোমস্ক্রিনে ইনস্টল করার সহজ নিয়ম:</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  নিচে আপনার ডিভাইসের ধাপগুলো দেখে ১ মিনিটে অ্যাপটি সেভ করে নিন।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* OS Platform Tabs */}
        <div className="flex border-b border-slate-200 px-4 pt-2 bg-white">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 pb-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'android'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>অ্যান্ড্রয়েড (Android)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 pb-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'ios'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>আইফোন (iPhone)</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 pb-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'desktop'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>কম্পিউটার (PC)</span>
          </button>
        </div>

        {/* Step-by-Step Instructions Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'android' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ১
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    ক্রোম ব্রাউজার মেন্যু চাপুন
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">
                      <MoreVertical className="w-3 h-3" /> ৩-ডট
                    </span>
                  </p>
                  <p className="text-slate-500 mt-1">
                    মোবাইলের Chrome বা Samsung Internet ব্রাউজারের উপরে ডান কোণায় থাকা ৩-ডট (⋮) অপশনে ট্যাপ করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ২
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    "Install app" অথবা "Add to Home screen" নির্বাচন করুন
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                  </p>
                  <p className="text-slate-500 mt-1">
                    মেন্যু তালিকার নিচের দিকে থাকা <strong className="text-slate-800">"Install app"</strong> অথবা <strong className="text-slate-800">"হোম স্ক্রিনে যোগ করুন"</strong> অপশনে ক্লিক করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ৩
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    "ইনস্টল" বাটনে ক্লিক করুন
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </p>
                  <p className="text-slate-500 mt-1">
                    পপ-আপে <strong>"Install"</strong> বাটনে ক্লিক করলেই ৫ সেকেন্ডের মধ্যে আপনার মোবাইলে টাকা পে অ্যাপ ইনস্টল হয়ে যাবে!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ১
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    Safari ব্রাউজারের শেয়ার বাটন চাপুন
                    <Share2 className="w-3.5 h-3.5 text-blue-500" />
                  </p>
                  <p className="text-slate-500 mt-1">
                    আইফোনে Safari ব্রাউজারের নিচের মাঝখানে থাকা <strong className="text-slate-800">শেয়ার (Share ⎋)</strong> আইকনটিতে ট্যাপ করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ২
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    "Add to Home Screen" অপশন চাপুন
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-600" />
                  </p>
                  <p className="text-slate-500 mt-1">
                    শেয়ার শিটের অপশনগুলো একটু নিচে স্ক্রল করে <strong className="text-slate-800">"Add to Home Screen" (+)</strong> বাটনে চাপুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ৩
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    উপরে ডানে "Add" চাপুন
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </p>
                  <p className="text-slate-500 mt-1">
                    ডানদিকের কোণে <strong className="text-slate-800">"Add"</strong> বাটনে ক্লিক করলেই আপনার iPhone/iPad এর হোমস্ক্রিনে অ্যাপ আইকন সেট হয়ে যাবে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ১
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900">এড্রেস বার (URL Bar) লক্ষ্য করুন</p>
                  <p className="text-slate-500 mt-1">
                    Google Chrome বা Microsoft Edge ব্রাউজারের এড্রেস বারের ডানপাশে ছোট <strong>ইনস্টল আইকন (App Available / ⊕)</strong> দেখতে পাবেন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ২
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900">Install বাটনে ক্লিক করুন</p>
                  <p className="text-slate-500 mt-1">
                    আইকনে ক্লিক করে "Install" সিলেক্ট করলেই এটি আলাদা ফুল-স্ক্রিন উইন্ডোতে ডেস্কটপ অ্যাপ হিসেবে ওপেন হবে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              কেন টাকা পে অ্যাপ ইনস্টল করবেন?
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-900">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>মেমোরি খরচ নেই (0 MB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>সুপার ফাস্ট টাস্ক লোডিং</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>ব্রাউজার ছাড়া সরাসরি ওপেন</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>দ্রুত উইথড্রাল নোটিফিকেশন</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">ভার্সন v2.4 (লেটেস্ট রিলিজ)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
