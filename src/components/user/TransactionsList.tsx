import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Gift,
  PlayCircle,
  Disc,
  Clock,
  Filter,
} from 'lucide-react';

export const TransactionsList: React.FC = () => {
  const { currentUser, transactions } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  // Filter for current user
  const userTransactions = transactions.filter((t) => t.userId === currentUser?.uid);

  const filtered = userTransactions.filter((tx) => {
    if (filterType === 'all') return true;
    if (filterType === 'rewards')
      return ['task_reward', 'ad_reward', 'spin_reward'].includes(tx.type);
    if (filterType === 'withdrawals') return tx.type === 'withdrawal';
    if (filterType === 'referrals') return tx.type === 'referral_reward';
    return true;
  });

  const getTxIcon = (type: TransactionType) => {
    switch (type) {
      case 'task_reward':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'ad_reward':
        return <PlayCircle className="w-4 h-4 text-rose-600" />;
      case 'spin_reward':
        return <Disc className="w-4 h-4 text-amber-600" />;
      case 'referral_reward':
        return <Gift className="w-4 h-4 text-blue-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-slate-800" />;
      default:
        return <Clock className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">লেনদেনের ইতিহাস (Transactions)</h2>
          <p className="text-xs text-slate-500 mt-0.5">আপনার সকল আয় ও ক্যাশআউটের সম্পূর্ণ বিবরণ</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'সবগুলো' },
            { id: 'rewards', label: 'রিওয়ার্ড' },
            { id: 'withdrawals', label: 'উইথড্র' },
            { id: 'referrals', label: 'রেফারেল' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === item.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((tx) => {
              const isCredit = tx.amount > 0;
              return (
                <div key={tx.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCredit ? 'bg-emerald-50' : 'bg-slate-100'
                      }`}
                    >
                      {getTxIcon(tx.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                        {tx.description}
                      </h4>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {new Date(tx.createdAt).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-black text-sm sm:text-base block ${
                        isCredit ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? '+' : ''} ৳ {Math.abs(tx.amount).toFixed(2)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        tx.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tx.status === 'completed' ? 'সম্পন্ন' : tx.status === 'pending' ? 'পেন্ডিং' : 'ব্যর্থ'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-400 font-medium">
            কোনো লেনদেন রেকর্ড পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
};
