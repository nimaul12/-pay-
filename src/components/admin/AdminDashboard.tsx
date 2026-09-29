import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  PlayCircle,
  Disc,
  Clock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { allUsers, tasks, withdrawals, transactions } = useApp();

  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter((u) => u.status === 'active').length;
  const blockedUsers = allUsers.filter((u) => u.status === 'blocked').length;

  const totalDistributedRewards = allUsers.reduce((sum, u) => sum + (u.totalEarnings || 0), 0);
  const pendingWithdrawalAmount = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);
  const completedWithdrawalAmount = withdrawals
    .filter((w) => w.status === 'paid')
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  const totalTasksCompleted = tasks.reduce((sum, t) => sum + (t.totalCompletions || 0), 0);
  const todayTasksCompleted = tasks.reduce((sum, t) => sum + (t.completionsToday || 0), 0);

  const totalReferralEarnings = allUsers.reduce((sum, u) => sum + (u.referralEarnings || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
            সুপার এডমিন ওভারভিউ
          </span>
          <h2 className="text-2xl font-black">টাকা পে প্ল্যাটফর্ম পারফরম্যান্স অ্যানালিটিক্স</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            রিয়েল-টাইম ইউজার আর্নিং, উইথড্রয়াল প্রসেসিং এবং টাস্ক অ্যাক্টিভিটি মনিটর করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('withdrawals')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>উইথড্রয়াল প্রসেস করুন ({pendingWithdrawalsCount})</span>
          </button>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>নতুন টাস্ক তৈরি</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              মোট নিবন্ধিত ইউজার
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalUsers} জন</div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
            <span className="text-emerald-600 font-semibold">{activeUsers} সক্রিয়</span>
            <span>•</span>
            <span className="text-rose-600 font-semibold">{blockedUsers} ব্লকড</span>
          </div>
        </div>

        {/* Total Earnings Distributed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              মোট বিতরিত রিওয়ার্ড
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            ৳ {totalDistributedRewards.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">
            টাস্ক, স্পিন ও বিজ্ঞাপন বাবদ
          </span>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              পেন্ডিং ক্যাশআউট
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            ৳ {pendingWithdrawalAmount.toFixed(2)}
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-2 block">
            {pendingWithdrawalsCount} টি রিকোয়েস্ট অপেক্ষমাণ
          </span>
        </div>

        {/* Completed Withdrawals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              পরিশোধিত ক্যাশআউট
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ৳ {completedWithdrawalAmount.toFixed(2)}
          </div>
          <span className="text-[11px] text-teal-600 font-medium mt-2 block">
            বিকাশ ও নগদে সফল প্রেরিত
          </span>
        </div>
      </div>

      {/* Activity Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Task Activity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">টাস্ক পরিসংখ্যান</h4>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">মোট সক্রিয় টাস্ক:</span>
              <span className="font-bold text-slate-900">{tasks.length} টি</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">আজকের সম্পন্ন:</span>
              <span className="font-bold text-emerald-600">{todayTasksCompleted} বার</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">সর্বমোট সম্পন্ন:</span>
              <span className="font-bold text-slate-900">{totalTasksCompleted} বার</span>
            </div>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">রেফারেল কমিশন</h4>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">মোট রেফারেল পেইড:</span>
              <span className="font-bold text-blue-600">৳ {totalReferralEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">রেফারার ইউজার সংখ্যা:</span>
              <span className="font-bold text-slate-900">
                {allUsers.filter((u) => u.totalReferrals > 0).length} জন
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">সিস্টেম স্ট্যাটাস:</span>
              <span className="font-bold text-emerald-600">সক্রিয় (Active)</span>
            </div>
          </div>
        </div>

        {/* Spin & Ad Activity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">স্পিন ও ভিডিও অ্যাক্টিভিটি</h4>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">আজকের মোট স্পিন:</span>
              <span className="font-bold text-slate-900">
                {allUsers.reduce((s, u) => s + (u.spinsToday || 0), 0)} বার
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">আজকের ভিডিও দেখা:</span>
              <span className="font-bold text-slate-900">
                {allUsers.reduce((s, u) => s + (u.adsWatchedToday || 0), 0)} বার
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">সার্ভার স্ট্যাটাস:</span>
              <span className="font-bold text-emerald-600">অনলাইন (Live)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Withdrawals Quick Action Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              জরুরি উইথড্রয়াল অনুরোধসমূহ ({pendingWithdrawalsCount})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              বিকাশ ও নগদে টাকা পাঠিয়ে পেইড মার্ক করুন
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('withdrawals')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            সবগুলো দেখুন →
          </button>
        </div>

        {withdrawals.filter((w) => w.status === 'pending').length > 0 ? (
          <div className="divide-y divide-slate-100">
            {withdrawals
              .filter((w) => w.status === 'pending')
              .slice(0, 4)
              .map((w) => (
                <div key={w.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{w.userName}</span>
                    <span className="text-slate-500 ml-2">
                      ({w.paymentMethod} - {w.accountNumber})
                    </span>
                    <span className="text-slate-400 block text-[11px] mt-0.5">ID: {w.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm block">
                      ৳ {w.netAmount.toFixed(2)}
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                      পেন্ডিং
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            বর্তমানে কোনো পেন্ডিং উইথড্রয়াল নেই।
          </div>
        )}
      </div>
    </div>
  );
};
