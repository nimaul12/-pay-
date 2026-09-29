import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskExecutionModal } from './TaskExecutionModal';
import { AdBanner } from '../common/AdBanner';
import { Search, Filter, Sparkles, Layers } from 'lucide-react';

export const TasksList: React.FC = () => {
  const { tasks } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

  // Active tasks only
  const activeTasks = tasks.filter((t) => t.status === 'active');

  const filteredTasks = activeTasks.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.titleBn && t.titleBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'সবগুলো' },
    { id: 'visit', label: 'ওয়েবসাইট' },
    { id: 'video', label: 'ভিডিও' },
    { id: 'social', label: 'সোশ্যাল মিডিয়া' },
    { id: 'app', label: 'অ্যাপ ইনস্টল' },
    { id: 'survey', label: 'জরিপ' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Page Title & Highlight */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-700/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>লাইভ আর্নিং টাস্ক</span>
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight">টাস্ক পূরণ করে টাকা আয় করুন</h2>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
          প্রতিটি টাস্কের আগে ১০ সেকেন্ডের বাধ্যতামূলক বিজ্ঞাপন দেখুন এবং নির্দিষ্ট সময় শেষ করে
          তাত্ক্ষণিক ওয়ালেটে টাকা বুঝে নিন।
        </p>
      </div>

      {/* Mid Banner Ad */}
      <AdBanner placement="dashboard" />

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="টাস্ক অনুসন্ধান করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={(t) => setActiveTask(t)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-700">কোনো টাস্ক পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-400 mt-1">অন্য ক্যাটাগরি বেছে নিন অথবা একটু পর চেক করুন।</p>
        </div>
      )}

      {/* Execution Modal */}
      {activeTask && (
        <TaskExecutionModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onSuccess={() => {
            // refreshed through context
          }}
        />
      )}
    </div>
  );
};
