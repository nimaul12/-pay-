import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Copy,
  Check,
  Share2,
  DollarSign,
  Gift,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ReferralSection: React.FC = () => {
  const { currentUser, settings } = useApp();
  const [copied, setCopied] = useState(false);

  const refCode = currentUser?.referralCode || 'TKP-882910';
  const origin = window.location.origin;
  const referralLink = `${origin}/?ref=${refCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 টাকা পে (TakaPay) অ্যাপে রেজিস্ট্রেশন করে প্রতিদিন টাস্ক ও স্পিন করে বিকাশ ও নগদে টাকা আয় করুন! আমার রেফারেল কোড: ${refCode}\nজয়েন লিংক: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareViaTelegram = () => {
    const text = encodeURIComponent(
      `টাকা পে-তে প্রতিদিন ৫০-২০০ টাকা বিকাশ/নগদে ক্যাশআউট নিন! কোড: ${refCode}`
    );
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`,
      '_blank'
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>রেফারেল ইনকাম প্রোগ্রাম</span>
          </span>
        </div>
        <h2 className="text-2xl font-black">বন্ধুদের আমন্ত্রণ জানান এবং আনলিমিটেড আয় করুন!</h2>
        <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
          প্রতিটি ভ্যালিড ফ্রেন্ড রেফারেলের জন্য পান ৳{settings.referralCommissionFixed.toFixed(2)}{' '}
          তাৎক্ষণিক বোনাস + তাদের প্রতিটি সম্পন্ন টাস্কের ওপর {settings.referralCommissionPercent}%
          আজীবন কমিশন।
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs text-slate-400 block font-medium">মোট রেফার</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
            {currentUser?.totalReferrals || 0} জন
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs text-slate-400 block font-medium">সক্রিয় রেফার</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block">
            {currentUser?.totalReferrals || 0} জন
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs text-slate-400 block font-medium">রেফারেল আয়</span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 mt-1 block">
            ৳ {(currentUser?.referralEarnings || 0).toFixed(2)}
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs text-slate-400 block font-medium">কমিশন রেট</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">
            {settings.referralCommissionPercent}%
          </span>
        </div>
      </div>

      {/* Referral Code Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">আপনার ইউনিক রেফারেল লিংক ও কোড</h3>
          <p className="text-xs text-slate-500 mt-1">
            নিচের কোডটি বা লিংকটি কপি করে ফেসবুক, হোয়াটসঅ্যাপ ও টেলিগ্রাম গ্রুপে শেয়ার করুন।
          </p>
        </div>

        {/* Code display */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              #
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">রেফার কোড</span>
              <div className="font-mono text-lg font-black text-slate-900 tracking-wider">
                {refCode}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={copyToClipboard}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}</span>
            </button>
          </div>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="pt-2">
          <span className="text-xs text-slate-500 font-semibold block mb-3">দ্রুত শেয়ার করুন:</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareViaWhatsApp}
              className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে শেয়ার</span>
            </button>
            <button
              onClick={shareViaTelegram}
              className="py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>টেলিগ্রামে শেয়ার</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rules Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6">
        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" /> রেফারেল নীতি ও নিয়মাবলী:
        </h4>
        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
          <li>একই ডিভাইস বা আইপি থেকে নিজে নিজে রেফার করা কঠোরভাবে নিষিদ্ধ।</li>
          <li>রেফারকৃত ব্যবহারকারী একাউন্ট খুলে সক্রিয় হলেই বোনাস গণনা করা হবে।</li>
          <li>ভুয়া অ্যাকাউন্ট তৈরি করলে অ্যাকাউন্ট ব্লক করা হতে পারে।</li>
        </ul>
      </div>
    </div>
  );
};
