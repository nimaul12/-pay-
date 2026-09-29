import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WithdrawalRequest, WithdrawalStatus } from '../../types';
import {
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Filter,
  Search,
  Check,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

export const AdminWithdrawals: React.FC = () => {
  const { withdrawals, updateWithdrawalStatus } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReq, setSelectedReq] = useState<WithdrawalRequest | null>(null);
  const [modalMode, setModalMode] = useState<'pay' | 'reject' | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [txIdInput, setTxIdInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = withdrawals.filter((w) => {
    const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
    const matchesSearch =
      w.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.accountNumber.includes(searchQuery) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenAction = (req: WithdrawalRequest, mode: 'pay' | 'reject') => {
    setSelectedReq(req);
    setModalMode(mode);
    setNoteInput(mode === 'pay' ? 'বিকাশ/নগদ এজেন্ট দিয়ে পাঠানো হয়েছে' : 'ভুল নম্বর / অসম্পূর্ণ তথ্য');
    setTxIdInput(mode === 'pay' ? `TXN${Math.floor(10000000 + Math.random() * 90000000)}` : '');
  };

  const handleExecuteAction = async () => {
    if (!selectedReq || !modalMode) return;
    setIsProcessing(true);

    if (modalMode === 'pay') {
      await updateWithdrawalStatus(selectedReq.id, 'paid', noteInput, txIdInput);
    } else {
      await updateWithdrawalStatus(selectedReq.id, 'rejected', noteInput);
    }

    setIsProcessing(false);
    setSelectedReq(null);
    setModalMode(null);
  };

  const handleApprove = async (id: string) => {
    await updateWithdrawalStatus(id, 'approved', 'এডমিন দ্বারা অনুমোদিত');
  };

  const handleProcessing = async (id: string) => {
    await updateWithdrawalStatus(id, 'processing', 'পেমেন্ট পাঠানো হচ্ছে');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            উইথড্রয়াল অনুমোদন ও পেমেন্ট প্রসেসিং
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            বিকাশ ও নগদ পেমেন্ট রিকোয়েস্ট পর্যালোচনা করুন এবং টাকা পাঠিয়ে পেইড মার্ক করুন
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'সবগুলো' },
            { id: 'pending', label: 'পেন্ডিং' },
            { id: 'processing', label: 'প্রসেসিং' },
            { id: 'paid', label: 'পরিশোধিত' },
            { id: 'rejected', label: 'বাতিল' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === item.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="নম্বর, নাম বা রিকোয়েস্ট আইডি দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">রিকোয়েস্ট আইডি</th>
                <th className="px-5 py-3.5">ইউজার বিবরণ</th>
                <th className="px-5 py-3.5">মাধ্যম</th>
                <th className="px-5 py-3.5">একাউন্ট নম্বর</th>
                <th className="px-5 py-3.5">পরিমাণ (BDT)</th>
                <th className="px-5 py-3.5">ফি</th>
                <th className="px-5 py-3.5">প্রাপ্য নেট (BDT)</th>
                <th className="px-5 py-3.5">স্ট্যাটাস</th>
                <th className="px-5 py-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-700">{req.id}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 block">{req.userName}</span>
                    <span className="text-slate-400 text-[11px] block">{req.userPhone}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        req.paymentMethod === 'bKash'
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {req.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-800 text-sm">
                    {req.accountNumber}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    ৳ {req.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-slate-400">৳ {req.fee.toFixed(2)}</td>
                  <td className="px-5 py-4 font-black text-emerald-600 text-sm">
                    ৳ {req.netAmount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${
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
                    {req.paymentTxId && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        Tx: {req.paymentTxId}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleProcessing(req.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 text-[11px]"
                        >
                          প্রসেসিং
                        </button>
                        <button
                          onClick={() => handleOpenAction(req, 'pay')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px] shadow-xs"
                        >
                          পেইড মার্ক
                        </button>
                        <button
                          onClick={() => handleOpenAction(req, 'reject')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 text-[11px]"
                        >
                          বাতিল ও রিফান্ড
                        </button>
                      </>
                    )}

                    {req.status === 'processing' && (
                      <>
                        <button
                          onClick={() => handleOpenAction(req, 'pay')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px] shadow-xs"
                        >
                          পেইড নিশ্চিত করুন
                        </button>
                        <button
                          onClick={() => handleOpenAction(req, 'reject')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 text-[11px]"
                        >
                          বাতিল ও রিফান্ড
                        </button>
                      </>
                    )}

                    {req.status === 'paid' && (
                      <span className="text-emerald-600 font-bold text-[11px] inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> পরিশোধিত
                      </span>
                    )}

                    {req.status === 'rejected' && (
                      <span className="text-rose-500 font-semibold text-[11px]">টাকা ফেরত দেওয়া হয়েছে</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal (Pay or Reject) */}
      {selectedReq && modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {modalMode === 'pay' ? 'পেমেন্ট সম্পন্ন নিশ্চিতকরণ' : 'উইথড্রয়াল বাতিল ও অর্থ ফেরত'}
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">গ্রাহক:</span>
                <span className="font-bold text-slate-900">{selectedReq.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পেমেন্ট মেথড:</span>
                <span className="font-bold text-slate-900">{selectedReq.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">নম্বর:</span>
                <span className="font-bold font-mono text-slate-900">
                  {selectedReq.accountNumber}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-600">
                <span>পাঠাতে হবে:</span>
                <span>৳ {selectedReq.netAmount.toFixed(2)}</span>
              </div>
            </div>

            {modalMode === 'pay' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    বিকাশ / নগদ ট্রানজেকশন আইডি (TxID)
                  </label>
                  <input
                    type="text"
                    value={txIdInput}
                    onChange={(e) => setTxIdInput(e.target.value)}
                    placeholder="যেমন: BKSH99120AX9"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">এডমিন নোট</label>
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    বাতিল করলে গ্রাহকের কাটা টাকা (৳{selectedReq.amount}) স্বয়ংক্রিয়ভাবে মূল ওয়ালেটে
                    ফেরত চলে যাবে।
                  </span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">বাতিলের কারণ লিখুন *</label>
                  <input
                    type="text"
                    required
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedReq(null);
                  setModalMode(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={isProcessing}
                className={`py-2.5 px-4 rounded-xl text-white text-xs font-bold ${
                  modalMode === 'pay'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25'
                }`}
              >
                {isProcessing
                  ? 'প্রসেসিং হচ্ছে...'
                  : modalMode === 'pay'
                  ? 'পেইড নিশ্চিত করুন'
                  : 'টাকা ফেরত দিন ও বাতিল করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
