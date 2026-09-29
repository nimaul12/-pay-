import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/user/BottomNav';
import { SocialBar } from './components/common/SocialBar';
import { UserDashboard } from './components/user/UserDashboard';
import { TasksList } from './components/user/TasksList';
import { VideoAdsSection } from './components/user/VideoAdsSection';
import { SpinWheelSection } from './components/user/SpinWheelSection';
import { ReferralSection } from './components/user/ReferralSection';
import { WalletSection } from './components/user/WalletSection';
import { TransactionsList } from './components/user/TransactionsList';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/user/UserProfileModal';
import { NotificationModal } from './components/user/NotificationModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminTasks } from './components/admin/AdminTasks';
import { AdminWithdrawals } from './components/admin/AdminWithdrawals';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminAds } from './components/admin/AdminAds';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminLogs } from './components/admin/AdminLogs';
import { TaskExecutionModal } from './components/user/TaskExecutionModal';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentPanel,
    activeTab,
    setActiveTab,
    currentUser,
    settings,
    tasks,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<string | null>(null);

  // If maintenance mode enabled and not an admin
  if (settings.maintenanceMode && currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black">প্ল্যাটফর্ম রক্ষণাবেক্ষণ চলছে</h2>
          <p className="text-xs text-slate-300">
            টাকা পে সিস্টেম আপডেটের জন্য সাময়িকভাবে বন্ধ রয়েছে। খুব শীঘ্রই আমরা পুনরায় উন্মুক্ত
            করব। সাময়িক অসুবিধার জন্য আন্তরিকভাবে দুঃখিত।
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="text-xs text-emerald-400 underline font-semibold"
          >
            এডমিন লগইন
          </button>
        </div>
        {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
      </div>
    );
  }

  // ADMIN PANEL INTERFACE
  if (currentPanel === 'admin') {
    return (
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
        {activeTab === 'tasks' && <AdminTasks />}
        {activeTab === 'withdrawals' && <AdminWithdrawals />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'ads' && <AdminAds />}
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'logs' && <AdminLogs />}
      </AdminLayout>
    );
  }

  const executingTask = tasks.find((t) => t.id === selectedTaskForModal);

  // USER PANEL INTERFACE
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenNotifications={() => setNotificationModalOpen(true)}
      />

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <UserDashboard
            onNavigateTab={setActiveTab}
            onSelectTask={(id) => setSelectedTaskForModal(id)}
          />
        )}
        {activeTab === 'tasks' && <TasksList />}
        {activeTab === 'ads' && <VideoAdsSection />}
        {activeTab === 'spin' && <SpinWheelSection />}
        {activeTab === 'wallet' && <WalletSection />}
        {activeTab === 'referral' && <ReferralSection />}
        {activeTab === 'history' && <TransactionsList />}
        {activeTab === 'profile' && (
          <div className="max-w-md mx-auto">
            <UserProfileModal onClose={() => setActiveTab('home')} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 text-center text-xs text-slate-500 mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              ৳
            </div>
            <span className="font-bold text-slate-800">টাকা পে (TakaPay)</span>
            <span>— বাংলাদেশের শীর্ষস্থানীয় রিওয়ার্ড প্ল্যাটফর্ম</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>সুরক্ষিত লেনদেন (bKash & Nagad)</span>
            <span>•</span>
            <span>গোপনীয়তা ও শর্তাবলী</span>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Social Bar */}
      <SocialBar />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
      {profileModalOpen && <UserProfileModal onClose={() => setProfileModalOpen(false)} />}
      {notificationModalOpen && (
        <NotificationModal onClose={() => setNotificationModalOpen(false)} />
      )}

      {/* Direct Task Execution Trigger from Dashboard */}
      {executingTask && (
        <TaskExecutionModal
          task={executingTask}
          onClose={() => setSelectedTaskForModal(null)}
          onSuccess={() => setSelectedTaskForModal(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
