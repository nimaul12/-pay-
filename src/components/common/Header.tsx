import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Bell,
  User,
  Shield,
  LogOut,
  Sparkles,
  ArrowRightLeft,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const {
    currentUser,
    logout,
    currentPanel,
    setPanel,
    notifications,
    settings,
    loginAsAdmin,
    loginAsDemoUser,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice if enabled */}
      {settings.noticeBanner && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs py-1.5 px-4 font-medium overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee">{settings.noticeBanner}</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPanel('user')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl">৳</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  টাকা পে <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">TakaPay</span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium">বাংলাদেশ রিওয়ার্ড প্ল্যাটফর্ম</p>
              </div>
            </button>

            {/* Quick Switcher */}
            <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200 text-xs">
              <span className="text-slate-400">সুইচ করুন:</span>
              <button
                onClick={loginAsAdmin}
                className="px-2 py-1 rounded bg-slate-900 text-amber-300 font-bold hover:bg-slate-800 flex items-center gap-1"
                title="এডমিন Niamul Molla"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span>এডমিন (Niamul Molla)</span>
              </button>
              <button
                onClick={loginAsDemoUser}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                title="সাধারণ ইউজার"
              >
                ইউজার (রহিম)
              </button>
            </div>
          </div>

          {/* Right Action Icons & Wallet */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton variant="header" />

            {currentUser ? (
              <>
                {/* Wallet Balance Chip */}
                <button
                  onClick={() => {
                    setPanel('user');
                    // navigate to wallet
                  }}
                  className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    ৳
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-emerald-700 uppercase font-semibold block leading-none">ব্যালেন্স</span>
                    <span className="text-sm font-bold tracking-tight text-emerald-900">
                      ৳ {currentUser.walletBalance.toFixed(2)}
                    </span>
                  </div>
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  aria-label="বিজ্ঞপ্তি"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Admin Switch Toggle (Visible if user is admin) */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setPanel(currentPanel === 'admin' ? 'user' : 'admin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                      currentPanel === 'admin'
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {currentPanel === 'admin' ? 'ইউজার প্যানেলে ফিরুন' : 'এডমিন প্যানেল'}
                    </span>
                  </button>
                )}

                {/* Profile Trigger */}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
                  title="প্রোফাইল দেখুন"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>লগইন / রেজিস্টার</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
