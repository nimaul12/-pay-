import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  Check,
  X,
  Globe,
  Video,
  Send,
  Smartphone,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';

export const AdminTasks: React.FC = () => {
  const { tasks, createTask, updateTask, deleteTask } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [description, setDescription] = useState('');
  const [rewardAmount, setRewardAmount] = useState('5.0');
  const [timerDuration, setTimerDuration] = useState('30');
  const [dailyLimit, setDailyLimit] = useState('3');
  const [totalLimit, setTotalLimit] = useState('1000');
  const [category, setCategory] = useState<'visit' | 'video' | 'app' | 'social' | 'survey'>('visit');
  const [externalUrl, setExternalUrl] = useState('');
  const [adRequired, setAdRequired] = useState(true);
  const [adDurationSeconds, setAdDurationSeconds] = useState('10');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const openCreateModal = () => {
    setEditingTaskId(null);
    setTitle('');
    setTitleBn('');
    setDescription('');
    setRewardAmount('5.0');
    setTimerDuration('30');
    setDailyLimit('3');
    setTotalLimit('1000');
    setCategory('visit');
    setExternalUrl('https://');
    setAdRequired(true);
    setAdDurationSeconds('10');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setTitleBn(task.titleBn || '');
    setDescription(task.description);
    setRewardAmount(task.rewardAmount.toString());
    setTimerDuration(task.timerDuration.toString());
    setDailyLimit(task.dailyLimit.toString());
    setTotalLimit(task.totalLimit.toString());
    setCategory(task.category);
    setExternalUrl(task.externalUrl || '');
    setAdRequired(task.adRequired);
    setAdDurationSeconds(task.adDurationSeconds.toString());
    setStatus(task.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numReward = parseFloat(rewardAmount) || 5;
    const numTimer = parseInt(timerDuration) || 30;
    const numDailyLimit = parseInt(dailyLimit) || 3;
    const numTotalLimit = parseInt(totalLimit) || 1000;
    const numAdDuration = parseInt(adDurationSeconds) || 10;

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title,
        titleBn,
        description,
        rewardAmount: numReward,
        timerDuration: numTimer,
        dailyLimit: numDailyLimit,
        totalLimit: numTotalLimit,
        category,
        externalUrl,
        adRequired,
        adDurationSeconds: numAdDuration,
        status,
      });
    } else {
      createTask({
        title,
        titleBn,
        description,
        rewardAmount: numReward,
        timerDuration: numTimer,
        dailyLimit: numDailyLimit,
        totalLimit: numTotalLimit,
        category,
        externalUrl,
        adRequired,
        adDurationSeconds: numAdDuration,
        status,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি "${name}" টাস্কটি স্থায়ীভাবে মুছে ফেলতে চান?`)) {
      deleteTask(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">টাস্ক ম্যানেজমেন্ট (Tasks)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ব্যবহারকারীদের জন্য আনলিমিটেড টাস্ক তৈরি, রিওয়ার্ড ও টাইমার পরিবর্তন করুন
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন টাস্ক তৈরি করুন</span>
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">টাস্ক বিবরণ</th>
                <th className="px-5 py-3.5">ক্যাটাগরি</th>
                <th className="px-5 py-3.5">রিওয়ার্ড (BDT)</th>
                <th className="px-5 py-3.5">টাইমার</th>
                <th className="px-5 py-3.5">বিজ্ঞাপন</th>
                <th className="px-5 py-3.5">লিমিট</th>
                <th className="px-5 py-3.5">স্ট্যাটাস</th>
                <th className="px-5 py-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 block text-sm">
                      {task.titleBn || task.title}
                    </span>
                    <span className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                      {task.title}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold capitalize">
                      {task.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-black text-emerald-600 text-sm">
                    ৳ {task.rewardAmount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-semibold">
                    {task.timerDuration}s
                  </td>
                  <td className="px-5 py-4">
                    {task.adRequired ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        ১০s বাধ্যতামূলক
                      </span>
                    ) : (
                      <span className="text-slate-400">না</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {task.completionsToday || 0} / {task.dailyLimit} দৈনিক
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        updateTask(task.id, {
                          status: task.status === 'active' ? 'inactive' : 'active',
                        })
                      }
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                        task.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {task.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
                      title="এডিট করুন"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id, task.titleBn || task.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingTaskId ? 'টাস্ক এডিট করুন' : 'নতুন টাস্ক তৈরি করুন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    টাস্ক নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ওয়েবসাইট ভিজিট করুন ৩০ সেকেন্ড"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    টাস্ক নাম (ইংরেজি) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Visit Website 30s"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">টাস্ক বিবরণ ও নির্দেশিকা *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="ব্যবহারকারীকে কী করতে হবে বিস্তারিত লিখুন..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">রিওয়ার্ড (৳ BDT) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">টাইমার (সেকেন্ড) *</label>
                  <input
                    type="number"
                    required
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">দৈনিক লিমিট *</label>
                  <input
                    type="number"
                    required
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">মোট লিমিট *</label>
                  <input
                    type="number"
                    required
                    value={totalLimit}
                    onChange={(e) => setTotalLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="visit">ওয়েবসাইট (Website Visit)</option>
                    <option value="video">ভিডিও (Video Watch)</option>
                    <option value="social">সোশ্যাল মিডিয়া (Telegram/FB)</option>
                    <option value="app">মোবাইল অ্যাপ (App Install)</option>
                    <option value="survey">জরিপ (Survey)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">এক্সটার্নাল লিঙ্ক (URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Mandatory 10s Ad Countdown Setting */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">বাধ্যতামূলক প্রি-রোল বিজ্ঞাপন</span>
                  <span className="text-[11px] text-amber-700">
                    টাস্ক শুরুর আগে ব্যবহারকারীকে ১০ সেকেন্ড বিজ্ঞাপন দেখতে বাধ্য করা হবে
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={adRequired}
                  onChange={(e) => setAdRequired(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/25"
                >
                  {editingTaskId ? 'আপডেট সংরক্ষণ করুন' : 'টাস্ক পাবলিশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
