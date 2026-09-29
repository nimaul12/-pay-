import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WithdrawalMethod } from '../../types';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Smartphone,
  Info,
} from 'lucide-react';

export const WalletSection: React.FC = () => {
  const { currentUser, settings, requestWithdrawal, withdrawals } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<WithdrawalMethod>('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState<string>('100');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const balance = currentUser?.walletBalance || 0;
  const numAmount = parseFloat(amount) || 0;
  const fee = Number(((numAmount * settings.withdrawalFeePercent) / 100).toFixed(2));
  const netAmount = Math.max(0, Number((numAmount - fee).toFixed(2)));

  // User's own withdrawals list
  const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser?.uid);

  const validateAndPrepare = () => {
    setMessage(null);
    if (!settings.userWithdrawalEnabled) {
      setMessage({ text: 'উইথড্রয়াল বর্তমানে এডমিন দ্বারা সাময়িক স্থগিত আছে।', type: 'error' });
      return;
    }
    if (!accountNumber || accountNumber.length < 11) {
      setMessage({ text: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।', type: 'error' });
      return;
    }
    if (isNaN(numAmount) || numAmount < settings.minWithdrawal) {
      setMessage({
        text: `ন্যূনতম উইথড্রয়াল পরিমাণ ৳${settings.minWithdrawal} হতে হবে।`,
        type: 'error',
      });
      return;
    }
    if (numAmount > settings.maxWithdrawal) {
      setMessage({
        text: `সর্বোচ্চ একক উইথড্রয়াল সীমা ৳${settings.maxWithdrawal}।`,
        type: 'error',
      });
      return;
    }
    if (numAmount > balance) {
      setMessage({
        text: 'আপনার ওয়ালেটে পর্যাপ্ত পরিমাণ অর্থ নেই।',
        type: 'error',
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    setIsSubmitting(true);
    try {
      const res = await requestWithdrawal(paymentMethod, accountNumber, numAmount);
      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        setShowConfirmModal(false);
        setAccountNumber('');
        setAmount('100');
      } else {
        setMessage({ text: res.message, type: 'error' });
        setShowConfirmModal(false);
      }
    } catch (e) {
      setMessage({ text: 'রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে।', type: 'error' });
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Wallet Cards Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-lg shadow-emerald-700/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              বর্তমান ব্যালেন্স
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <div className="text-3xl font-black mt-2">৳ {balance.toFixed(2)}</div>
          <span className="text-[11px] text-emerald-100 mt-2 block font-medium">
            উইথড্র করার জন্য প্রস্তুত
          </span>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              পেন্ডিং উইথড্র
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            ৳ {(currentUser?.pendingWithdrawals || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">
            এডমিনের অনুমোদনের অপেক্ষায়
          </span>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              সর্বমোট আয়
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              +
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">
            ৳ {(currentUser?.totalEarnings || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">আজকের ও অতীতের মোট</span>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              মোট ক্যাশআউট
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ৳ {(currentUser?.totalWithdrawn || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">সফলভাবে পরিশোধিত</span>
        </div>
      </div>

      {/* Withdrawal Form Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">টাকা তোলার আবেদন (Withdraw Funds)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বিকাশ অথবা নগদ একাউন্টে সর্বনিম্ন ৳{settings.minWithdrawal} থেকে সর্বোচ্চ ৳
            {settings.maxWithdrawal} পর্যন্ত উইথড্র করতে পারবেন।
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Method Picker */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            পেমেন্ট মাধ্যম বেছে নিন:
          </label>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* bKash Button */}
            <button
              type="button"
              onClick={() => setPaymentMethod('bKash')}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'bKash'
                  ? 'border-pink-600 bg-pink-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                bKash
              </div>
              <div className="text-left">
                <span className="font-bold text-sm text-slate-900 block">বিকাশ (bKash)</span>
                <span className="text-[11px] text-pink-600 font-semibold">পার্সোনাল একাউন্ট</span>
              </div>
            </button>

            {/* Nagad Button */}
            <button
              type="button"
              onClick={() => setPaymentMethod('Nagad')}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'Nagad'
                  ? 'border-orange-600 bg-orange-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                নগদ
              </div>
              <div className="text-left">
                <span className="font-bold text-sm text-slate-900 block">নগদ (Nagad)</span>
                <span className="text-[11px] text-orange-600 font-semibold">পার্সোনাল একাউন্ট</span>
              </div>
            </button>
          </div>
        </div>

        {/* Account Number */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            {paymentMethod} একাউন্ট নম্বর:
          </label>
          <div className="relative">
            <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            সঠিক মোবাইল নম্বর প্রবেশ করান। ভুল নম্বরে টাকা চলে গেলে তা ফেরতযোগ্য নয়।
          </span>
        </div>

        {/* Amount Input & Preset Chips */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            উইথড্রয়াল পরিমাণ (BDT ৳):
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">
              ৳
            </span>
            <input
              type="number"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 mt-2.5">
            {[50, 100, 200, 500, 1000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val.toString())}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                ৳{val}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Preview Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>উইথড্রয়াল পরিমাণ:</span>
            <span className="font-bold">৳ {numAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>ক্যাশআউট সার্ভিস ফি ({settings.withdrawalFeePercent}%):</span>
            <span className="font-semibold text-rose-600">- ৳ {fee.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-900 font-black text-sm">
            <span>আপনি পাবেন (You will receive):</span>
            <span className="text-emerald-600 text-base">৳ {netAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={validateAndPrepare}
          disabled={balance < settings.minWithdrawal}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-md ${
            balance >= settings.minWithdrawal
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {balance >= settings.minWithdrawal ? 'উইথড্রয়াল আবেদন জমা দিন' : 'পর্যাপ্ত ব্যালেন্স নেই'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-lg font-bold text-slate-900">উইথড্রয়াল নিশ্চিতকরণ</h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">মাধ্যম:</span>
                <span className="font-bold text-slate-900">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">নম্বর:</span>
                <span className="font-bold text-slate-900">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মোট কাটা হবে:</span>
                <span className="font-bold text-slate-900">৳ {numAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-600 text-sm">
                <span>পেমেন্ট পাবেন:</span>
                <span>৳ {netAmount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              সাবমিট করার সাথে সাথে ব্যালেন্স থেকে এই অর্থ কেটে পেন্ডিং তালিকায় যুক্ত হবে।
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                disabled={isSubmitting}
                className="py-3 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/25"
              >
                {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'হ্যাঁ, নিশ্চিত'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User's Withdrawal History */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-base font-bold text-slate-900 mb-4">আপনার সাম্প্রতিক উইথড্রয়ালসমূহ</h4>
        {userWithdrawals.length > 0 ? (
          <div className="space-y-3">
            {userWithdrawals.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{req.paymentMethod}</span>
                    <span className="text-slate-500 font-mono">({req.accountNumber})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {new Date(req.createdAt).toLocaleDateString('bn-BD', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">৳ {req.netAmount.toFixed(2)}</div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      req.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : req.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {req.status === 'paid'
                      ? 'পরিশোধিত'
                      : req.status === 'pending'
                      ? 'পেন্ডিং'
                      : req.status === 'rejected'
                      ? 'বাতিল'
                      : 'প্রসেসিং'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            এখনও কোনো উইথড্রয়াল রিকোয়েস্ট জমা দেওয়া হয়নি।
          </div>
        )}
      </div>
    </div>
  );
};
