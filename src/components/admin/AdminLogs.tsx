import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Search, Shield, Clock, Filter } from 'lucide-react';

export const AdminLogs: React.FC = () => {
  const { adminLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = adminLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.adminId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            এডমিন অডিট ও অ্যাকশন লগ (Admin Audit Trail)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            উইথড্রয়াল অনুমোদন, ব্যালেন্স পরিবর্তন, টাস্ক তৈরি এবং সেটিংস পরিবর্তনের পূর্ণ স্বচ্ছ রেকর্ড
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="অ্যাকশন, টার্গেট বা বিবরণ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">অ্যাকশন টাইপ</th>
                <th className="px-5 py-3.5">টার্গেট অবজেক্ট</th>
                <th className="px-5 py-3.5">বিস্তারিত বিবরণ</th>
                <th className="px-5 py-3.5">এডমিন আইডি</th>
                <th className="px-5 py-3.5 text-right">সময় ও তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-slate-900 px-2 py-0.5 rounded-md bg-slate-100 inline-block text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-800">{log.target}</td>
                  <td className="px-5 py-4 text-slate-600 max-w-xs">{log.details}</td>
                  <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                    <span className="truncate max-w-[140px] block" title={log.adminId}>
                      {log.adminId}
                    </span>
                    {log.adminEmail && (
                      <span className="text-[10px] text-slate-400 block">{log.adminEmail}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString('bn-BD', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
