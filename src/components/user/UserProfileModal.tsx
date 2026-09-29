import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  LogOut,
  X,
  Wallet,
  Sparkles,
  ExternalLink,
  Download,
} from 'lucide-react';
import { InstallAppModal } from '../common/InstallAppModal';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, logout, setPanel } = useApp();
  const [showInstallModal, setShowInstallModal] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
        {/* Header with avatar */}
        <div className="relative bg-gradient-to-tr from-emerald-600 to-teal-700 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 rounded-full bg-white text-emerald-800 font-black text-2xl flex items-center justify-center mx-auto shadow-xl ring-4 ring-white/30">
            {currentUser.name.charAt(0)}
          </div>
          <h3 className="font-extrabold text-lg mt-3">{currentUser.name}</h3>
          <p className="text-xs text-emerald-100 font-mono">@{currentUser.username}</p>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              {currentUser.role === 'admin' ? 'এডমিন (Admin)' : 'ইউজার (User)'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                currentUser.status === 'active'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-rose-400 text-slate-950'
              }`}
            >
              {currentUser.status === 'active' ? 'সক্রিয় (Active)' : 'ব্লকড'}
            </span>
          </div>
        </div>

        {/* Details List */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">ওয়ালেট ব্যালেন্স</span>
              <span className="text-base font-black text-emerald-600">
                ৳ {currentUser.walletBalance.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">রেফারেল কোড</span>
              <span className="text-base font-black font-mono text-slate-800">
                {currentUser.referralCode}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">{currentUser.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                যোগদানের তারিখ:{' '}
                <strong className="text-slate-800">
                  {new Date(currentUser.createdAt).toLocaleDateString('bn-BD')}
                </strong>
              </span>
            </div>
          </div>

          {/* Admin shortcut if admin */}
          {currentUser.role === 'admin' && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setPanel('admin');
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>এডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
              </button>
            </div>
          )}

          {/* Install App Trigger */}
          <div className="pt-2">
            <button
              onClick={() => setShowInstallModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>মোবাইলে অ্যাপটি ইনস্টল করুন (Install App)</span>
            </button>
          </div>

          {/* Logout Action */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট করুন (Logout)</span>
            </button>
          </div>
        </div>
      </div>

      {showInstallModal && <InstallAppModal onClose={() => setShowInstallModal(false)} />}
    </div>
  );
};
