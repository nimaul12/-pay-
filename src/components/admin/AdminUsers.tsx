import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserStatus } from '../../types';
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  Coins,
  ArrowUpDown,
  X,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { allUsers, updateUserStatus, adjustUserBalance } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [adjustingUser, setAdjustingUser] = useState<UserProfile | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('50');
  const [adjustReason, setAdjustReason] = useState('বিশেষ রিওয়ার্ড বোনাস');
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');

  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);

  const filteredUsers = allUsers.filter((u) => {
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.uid.toLowerCase().includes(q) ||
      u.referralCode.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser) return;
    const num = parseFloat(adjustAmount) || 0;
    if (num <= 0) return;

    const finalAmount = adjustType === 'credit' ? num : -num;
    adjustUserBalance(adjustingUser.uid, finalAmount, adjustReason);

    setAdjustingUser(null);
    setAdjustAmount('50');
    setAdjustReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            ইউজার ম্যানেজমেন্ট ও ব্যালেন্স সমন্বয়
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            নিবন্ধিত ইউজারদের তালিকা অনুসন্ধান করুন, ব্যালেন্স অ্যাড/কাটুন এবং একাউন্ট স্ট্যাটাস নিয়ন্ত্রণ
            করুন
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5">
          {['all', 'active', 'suspended', 'blocked'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'all'
                ? 'সবগুলো'
                : s === 'active'
                ? 'সক্রিয়'
                : s === 'suspended'
                ? 'স্থগিত'
                : 'ব্লকড'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="নাম, ইউজারনেম, ইমেইল, ফোন, UID বা রেফার কোড দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:border-emerald-500 shadow-2xs"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">ইউজার প্রোফাইল</th>
                <th className="px-5 py-3.5">যোগাযোগ</th>
                <th className="px-5 py-3.5">রেফার কোড</th>
                <th className="px-5 py-3.5">বর্তমান ব্যালেন্স</th>
                <th className="px-5 py-3.5">মোট আয়</th>
                <th className="px-5 py-3.5">স্ট্যাটাস</th>
                <th className="px-5 py-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{user.name}</span>
                        <span className="text-slate-400 text-[11px] block">@{user.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-800 block">{user.phone}</span>
                    <span className="text-slate-400 text-[11px] block">{user.email}</span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-700">
                    {user.referralCode}
                  </td>
                  <td className="px-5 py-4 font-black text-emerald-600 text-sm">
                    ৳ {user.walletBalance.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    ৳ {user.totalEarnings.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : user.status === 'suspended'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {user.status === 'active'
                        ? 'সক্রিয়'
                        : user.status === 'suspended'
                        ? 'স্থগিত'
                        : 'ব্লকড'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* View Details */}
                    <button
                      onClick={() => setSelectedUserDetail(user)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      title="বিস্তারিত দেখুন"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Adjust Balance */}
                    <button
                      onClick={() => setAdjustingUser(user)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 text-[11px]"
                    >
                      ব্যালেন্স সমন্বয়
                    </button>

                    {/* Status actions */}
                    {user.status === 'active' ? (
                      <button
                        onClick={() => updateUserStatus(user.uid, 'blocked')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 text-[11px]"
                      >
                        ব্লক করুন
                      </button>
                    ) : (
                      <button
                        onClick={() => updateUserStatus(user.uid, 'active')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px]"
                      >
                        আনব্লক
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              ব্যালেন্স সমন্বয়: {adjustingUser.name}
            </h3>
            <p className="text-xs text-slate-500">
              বর্তমান ওয়ালেট ব্যালেন্স: <strong>৳{adjustingUser.walletBalance.toFixed(2)}</strong>
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('credit')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    adjustType === 'credit'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  + ব্যালেন্স যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('debit')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    adjustType === 'debit'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  - ব্যালেন্স কাটুন
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">পরিমাণ (BDT ৳) *</label>
                <input
                  type="number"
                  step="1"
                  required
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  সমন্বয়ের কারণ লিখুন (অডিট লগ রেকর্ড হবে) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রেফারেল মিসিং বোনাস / নিয়ম লঙ্ঘনের জরিমানা"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingUser(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">ইউজার বিস্তারিত প্রোফাইল</h3>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">নাম:</span>
                <span className="font-bold text-slate-900">{selectedUserDetail.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ইউজারনেম:</span>
                <span className="font-mono text-slate-900">@{selectedUserDetail.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ইমেইল:</span>
                <span className="text-slate-900">{selectedUserDetail.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মোবাইল:</span>
                <span className="font-mono font-bold text-slate-900">{selectedUserDetail.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ইউজার আইডি (UID):</span>
                <span className="font-mono text-[10px] text-slate-600 truncate max-w-[200px]">
                  {selectedUserDetail.uid}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-slate-700">বর্তমান ব্যালেন্স:</span>
                <span className="text-emerald-600 text-sm">
                  ৳ {selectedUserDetail.walletBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মোট রেফারেল:</span>
                <span className="font-bold text-blue-600">
                  {selectedUserDetail.totalReferrals} জন
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">সম্পন্ন টাস্ক:</span>
                <span className="font-bold text-purple-600">
                  {selectedUserDetail.completedTasksCount} টি
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserDetail(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
