import React from 'react';
import { TaskItem } from '../../types';
import {
  Globe,
  Video,
  Send,
  Smartphone,
  CheckSquare,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  onSelect: (task: TaskItem) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect }) => {
  const getCategoryIcon = () => {
    switch (task.category) {
      case 'visit':
        return <Globe className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'social':
        return <Send className="w-5 h-5 text-sky-600" />;
      case 'app':
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      default:
        return <CheckSquare className="w-5 h-5 text-amber-600" />;
    }
  };

  const getCategoryLabel = () => {
    switch (task.category) {
      case 'visit':
        return 'ওয়েবসাইট';
      case 'video':
        return 'ভিডিও';
      case 'social':
        return 'সোশ্যাল';
      case 'app':
        return 'মোবাইল অ্যাপ';
      default:
        return 'জরিপ';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all hover:border-emerald-300 flex flex-col justify-between group">
      <div>
        {/* Category & Reward Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              {getCategoryIcon()}
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {getCategoryLabel()}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">রিওয়ার্ড</span>
            <span className="text-base sm:text-lg font-black text-emerald-600">
              ৳ {task.rewardAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Task Title & Description */}
        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {task.titleBn || task.title}
        </h4>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Footer Info & Start Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {task.timerDuration}s
          </span>
          <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-semibold text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-500" /> ১০s অ্যাড
          </span>
        </div>

        <button
          onClick={() => onSelect(task)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs shadow-emerald-600/20 group-hover:gap-2 cursor-pointer"
        >
          <span>শুরু করুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
