import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  CheckSquare,
  PlayCircle,
  Disc,
  Users,
  ArrowUpRight,
  History,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { AdBanner } from '../common/AdBanner';
import { TaskCard } from './TaskCard';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface UserDashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectTask: (taskId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onNavigateTab,
  onSelectTask,
}) => {
  const { currentUser, tasks, settings, withdrawals } = useApp();

  const activeTasks = tasks.filter((t) => t.status === 'active').slice(0, 3);
  const pendingCount = withdrawals.filter(
    (w) => w.userId === currentUser?.uid && w.status === 'pending'
  ).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Welcome & Balance Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-700/20">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>স্বাগতম, {currentUser?.name || 'ব্যবহারকারী'}!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              দৈনিক টাস্ক ও স্পিন করে সহজে টাকা আয় করুন
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg leading-relaxed">
              টাকা পে বাংলাদেশের অন্যতম বিশ্বস্ত রিওয়ার্ড প্ল্যাটফর্ম। বিকাশ ও নগদে দ্রুত ক্যাশআউট সুবিধা।
            </p>
          </div>

          {/* Big Balance Box */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 sm:min-w-[240px] text-center md:text-right shrink-0">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold block">
              মূল ওয়ালেট ব্যালেন্স
            </span>
            <div className="text-3xl sm:text-4xl font-black mt-1 tracking-tight text-white flex items-center justify-center md:justify-end gap-1.5">
              <span>৳</span>
              <span>{(currentUser?.walletBalance || 0).toFixed(2)}</span>
            </div>
            <div className="mt-3 flex items-center justify-center md:justify-end gap-2">
              <button
                onClick={() => onNavigateTab('wallet')}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>টাকা তুলুন (Withdraw)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent App Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Top Banner Advertisement Placement */}
      <AdBanner placement="banner_top" />

      {/* Metrics Row (Total Earnings, Today Earnings, Referrals, Completed Tasks) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">আজকের আয়</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ৳ {(currentUser?.todayEarnings || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">আজকের অর্জিত অর্থ</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">সর্বমোট আয়</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ৳ {(currentUser?.totalEarnings || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium block mt-1">শুরু থেকে আজ পর্যন্ত</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">রেফারেল আর্নিং</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ৳ {(currentUser?.referralEarnings || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-amber-600 font-medium block mt-1">
            {currentUser?.totalReferrals || 0} জন বন্ধু রেফার্ড
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">সম্পূর্ণ টাস্ক</span>
            <CheckSquare className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {currentUser?.completedTasksCount || 0} টি
          </div>
          <span className="text-[11px] text-purple-600 font-medium block mt-1">সফল সম্পন্ন হয়েছে</span>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
          <span>আয়ের প্রধান মাধ্যমসমূহ (Quick Actions)</span>
          <span className="text-xs text-slate-400 font-normal">ট্যাপ করে শুরু করুন</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Action 1: Tasks */}
          <button
            onClick={() => onNavigateTab('tasks')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900">টাস্ক পূরণ</span>
            <span className="text-[10px] text-slate-400 mt-0.5">প্রতিটিতে ৳৫ - ৳২০</span>
          </button>

          {/* Action 2: Video Ads */}
          <button
            onClick={() => onNavigateTab('ads')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-rose-400 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900">ভিডিও দেখুন</span>
            <span className="text-[10px] text-slate-400 mt-0.5">৳১.৫০ প্রতি ভিডিও</span>
          </button>

          {/* Action 3: Spin Wheel */}
          <button
            onClick={() => onNavigateTab('spin')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Disc className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900">লাকি স্পিন</span>
            <span className="text-[10px] text-slate-400 mt-0.5">সর্বোচ্চ ৳১৫ রিওয়ার্ড</span>
          </button>

          {/* Action 4: Referral */}
          <button
            onClick={() => onNavigateTab('referral')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900">রেফার প্রোগ্রাম</span>
            <span className="text-[10px] text-slate-400 mt-0.5">১০% কমিশন + ৳৫</span>
          </button>

          {/* Action 5: Withdraw */}
          <button
            onClick={() => onNavigateTab('wallet')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900">উইথড্রয়াল</span>
            <span className="text-[10px] text-slate-400 mt-0.5">বিকাশ / নগদ</span>
          </button>

          {/* Action 6: History */}
          <button
            onClick={() => onNavigateTab('history')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900">লেনদেন ইতিহাস</span>
            <span className="text-[10px] text-slate-400 mt-0.5">সকল রেকর্ড</span>
          </button>
        </div>
      </div>

      {/* Featured Tasks Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">জনপ্রিয় টাস্কসমূহ</h3>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>সবগুলো দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTasks.map((t) => (
            <TaskCard key={t.id} task={t} onSelect={() => onSelectTask(t.id)} />
          ))}
        </div>
      </div>

      {/* Bottom Dashboard Ad Banner */}
      <AdBanner placement="banner_bottom" />
    </div>
  );
};
