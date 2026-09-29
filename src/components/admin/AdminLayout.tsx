import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  ArrowUpRight,
  Users,
  Megaphone,
  Settings,
  FileText,
  LogOut,
  ArrowLeft,
  Shield,
  Bell,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  const { currentUser, setPanel, logout, withdrawals } = useApp();

  const pendingWithdrawalCount = withdrawals.filter((w) => w.status === 'pending').length;

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'tasks', label: 'টাস্ক পরিচালনা', icon: CheckSquare },
    {
      id: 'withdrawals',
      label: 'উইথড্রয়াল অনুমোদন',
      icon: ArrowUpRight,
      badge: pendingWithdrawalCount > 0 ? pendingWithdrawalCount : null,
    },
    { id: 'users', label: 'ইউজার ম্যানেজমেন্ট', icon: Users },
    { id: 'ads', label: 'বিজ্ঞাপন সেটিংস', icon: Megaphone },
    { id: 'settings', label: 'সিস্টেম ও রিওয়ার্ড', icon: Settings },
    { id: 'logs', label: 'এডমিন অডিট লগ', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Bar */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
                ৳
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  টাকা পে <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">এডমিন</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-mono">Control Center</p>
              </div>
            </div>
          </div>

          {/* Admin Role Identity Banner */}
          <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-200 block truncate">{currentUser?.name}</span>
                <span className="text-[10px] text-slate-400 font-mono truncate block">
                  UID: {currentUser?.uid.slice(0, 16)}...
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setPanel('user')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ইউজার প্যানেলে যান</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-slate-900 capitalize">
              {menuItems.find((m) => m.id === activeTab)?.label || 'এডমিন প্যানেল'}
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              সিস্টেম সচল (Active)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPanel('user')}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ইউজার ভিউ দেখুন</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};
