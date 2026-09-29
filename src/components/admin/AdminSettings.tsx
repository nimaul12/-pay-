import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Coins,
  Settings,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [formData, setFormData] = useState({
    appName: settings.appName,
    currencySymbol: settings.currencySymbol,
    minWithdrawal: settings.minWithdrawal.toString(),
    maxWithdrawal: settings.maxWithdrawal.toString(),
    withdrawalFeePercent: settings.withdrawalFeePercent.toString(),
    referralCommissionFixed: settings.referralCommissionFixed.toString(),
    referralCommissionPercent: settings.referralCommissionPercent.toString(),
    defaultTaskAdSeconds: settings.defaultTaskAdSeconds.toString(),
    videoAdReward: settings.videoAdReward.toString(),
    videoAdDuration: settings.videoAdDuration.toString(),
    videoAdsDailyLimit: settings.videoAdsDailyLimit.toString(),
    spinDailyLimit: settings.spinDailyLimit.toString(),
    spinRewardsStr: settings.spinRewards ? settings.spinRewards.join(', ') : '0.5, 1, 2, 3, 5, 10, 0, 15',
    maintenanceMode: settings.maintenanceMode,
    userWithdrawalEnabled: settings.userWithdrawalEnabled,
    registrationEnabled: settings.registrationEnabled,
    noticeBanner: settings.noticeBanner || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rewardsArr = formData.spinRewardsStr
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));

    updateSettings({
      appName: formData.appName,
      currencySymbol: formData.currencySymbol,
      minWithdrawal: parseFloat(formData.minWithdrawal) || 50,
      maxWithdrawal: parseFloat(formData.maxWithdrawal) || 5000,
      withdrawalFeePercent: parseFloat(formData.withdrawalFeePercent) || 2,
      referralCommissionFixed: parseFloat(formData.referralCommissionFixed) || 5,
      referralCommissionPercent: parseFloat(formData.referralCommissionPercent) || 10,
      defaultTaskAdSeconds: parseInt(formData.defaultTaskAdSeconds) || 10,
      videoAdReward: parseFloat(formData.videoAdReward) || 1.5,
      videoAdDuration: parseInt(formData.videoAdDuration) || 15,
      videoAdsDailyLimit: parseInt(formData.videoAdsDailyLimit) || 10,
      spinDailyLimit: parseInt(formData.spinDailyLimit) || 5,
      spinRewards: rewardsArr.length > 0 ? rewardsArr : [0.5, 1, 2, 3, 5, 10],
      maintenanceMode: formData.maintenanceMode,
      userWithdrawalEnabled: formData.userWithdrawalEnabled,
      registrationEnabled: formData.registrationEnabled,
      noticeBanner: formData.noticeBanner,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            প্ল্যাটফর্ম ও রিওয়ার্ড কনফিগারেশন (Platform Settings)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            কোড পরিবর্তন ছাড়াই রিওয়ার্ড পরিমাণ, উইথড্রয়াল সীমা ও রেফারেল কমিশন পরিবর্তন করুন
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: General Platform & Currency */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>সাধারণ প্ল্যাটফর্ম সেটিংস</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">প্ল্যাটফর্মের নাম</label>
              <input
                type="text"
                value={formData.appName}
                onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">মুদ্রা চিহ্ন (Currency Symbol)</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              নোটিশ বার বার্তা (Scrolling Notice Banner)
            </label>
            <input
              type="text"
              value={formData.noticeBanner}
              onChange={(e) => setFormData({ ...formData, noticeBanner: e.target.value })}
              placeholder="শীর্ষে প্রদর্শিত স্ক্রলিং টেক্সট..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* Section 2: Withdrawals Configuration */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Coins className="w-4 h-4 text-teal-600" />
            <span>উইথড্রয়াল পলিসি ও সীমা (bKash / Nagad)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ন্যূনতম উইথড্রয়াল (Min BDT ৳)
              </label>
              <input
                type="number"
                value={formData.minWithdrawal}
                onChange={(e) => setFormData({ ...formData, minWithdrawal: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                সর্বোচ্চ একক উইথড্রয়াল (Max BDT ৳)
              </label>
              <input
                type="number"
                value={formData.maxWithdrawal}
                onChange={(e) => setFormData({ ...formData, maxWithdrawal: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">ক্যাশআউট সার্ভিস ফি (%)</label>
              <input
                type="number"
                step="0.5"
                value={formData.withdrawalFeePercent}
                onChange={(e) => setFormData({ ...formData, withdrawalFeePercent: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Referral Commission Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>রেফারেল ইনকাম সেটিংস (Referral Commission)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                নির্দিষ্ট রেফারেল জয়েনিং বোনাস (Fixed ৳ BDT)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.referralCommissionFixed}
                onChange={(e) =>
                  setFormData({ ...formData, referralCommissionFixed: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                টাস্ক কমিশন পার্সেন্টেজ (%)
              </label>
              <input
                type="number"
                step="1"
                value={formData.referralCommissionPercent}
                onChange={(e) =>
                  setFormData({ ...formData, referralCommissionPercent: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Video Ads & Spin Wheel Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>ভিডিও বিজ্ঞাপন ও লাকি হুইল রিওয়ার্ড সেটিংস</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">প্রতি ভিডিও রিওয়ার্ড (৳)</label>
              <input
                type="number"
                step="0.5"
                value={formData.videoAdReward}
                onChange={(e) => setFormData({ ...formData, videoAdReward: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ভিডিও দৈর্ঘ্য সময় (সেকেন্ড)
              </label>
              <input
                type="number"
                value={formData.videoAdDuration}
                onChange={(e) => setFormData({ ...formData, videoAdDuration: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">দৈনিক ভিডিও লিমিট</label>
              <input
                type="number"
                value={formData.videoAdsDailyLimit}
                onChange={(e) => setFormData({ ...formData, videoAdsDailyLimit: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">দৈনিক ফ্রি স্পিন লিমিট</label>
              <input
                type="number"
                value={formData.spinDailyLimit}
                onChange={(e) => setFormData({ ...formData, spinDailyLimit: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                স্পিন হুইল রিওয়ার্ড মান (কমা দিয়ে লিখুন)
              </label>
              <input
                type="text"
                value={formData.spinRewardsStr}
                onChange={(e) => setFormData({ ...formData, spinRewardsStr: e.target.value })}
                placeholder="0.5, 1, 2, 3, 5, 10, 0, 15"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Security & Platform Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>সিস্টেম কন্ট্রোল ও মেইনটেনেন্স সুইচ</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block">ব্যবহারকারী উইথড্রয়াল সক্ষম</span>
                <span className="text-[11px] text-slate-500">
                  বন্ধ করলে ব্যবহারকারীরা ক্যাশআউট রিকোয়েস্ট করতে পারবে না
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.userWithdrawalEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, userWithdrawalEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block">নতুন রেজিস্ট্রেশন উন্মুক্ত</span>
                <span className="text-[11px] text-slate-500">
                  বন্ধ করলে নতুন কেউ একাউন্ট খুলতে পারবে না
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.registrationEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, registrationEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-rose-50/60 rounded-xl border border-rose-200">
              <div>
                <span className="font-bold text-rose-900 block">মেইনটেনেন্স মোড (Maintenance Mode)</span>
                <span className="text-[11px] text-rose-700">
                  চালু করলে সাধারণ ইউজারদের জন্য সাইট রক্ষণাবেক্ষণ মোড দেখাবে
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-rose-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সকল সেটিংস সংরক্ষণ করুন (Save Platform Settings)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
