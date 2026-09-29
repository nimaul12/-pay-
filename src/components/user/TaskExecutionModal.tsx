import React, { useState, useEffect, useRef } from 'react';
import { TaskItem } from '../../types';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Play,
  ShieldCheck,
} from 'lucide-react';

interface TaskExecutionModalProps {
  task: TaskItem;
  onClose: () => void;
  onSuccess: () => void;
}

type StepState = 'AD_PRE_ROLL' | 'TASK_RUNNING' | 'COMPLETED' | 'INTERRUPTED';

export const TaskExecutionModal: React.FC<TaskExecutionModalProps> = ({
  task,
  onClose,
  onSuccess,
}) => {
  const { ads, completeTask, settings } = useApp();

  // Find the configured pre-roll ad
  const preRollAd = ads.find((a) => a.placement === 'task_preroll' && a.status === 'active');
  const adTotalSeconds = task.adDurationSeconds || settings.defaultTaskAdSeconds || 10;
  const taskTotalSeconds = task.timerDuration || 30;

  const [currentStep, setCurrentStep] = useState<StepState>('AD_PRE_ROLL');
  const [adSecondsRemaining, setAdSecondsRemaining] = useState<number>(adTotalSeconds);
  const [taskSecondsRemaining, setTaskSecondsRemaining] = useState<number>(taskTotalSeconds);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rewardClaimed, setRewardClaimed] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Phase 1: Mandatory Ad Countdown
  useEffect(() => {
    if (currentStep === 'AD_PRE_ROLL') {
      timerRef.current = setInterval(() => {
        setAdSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStep]);

  // Phase 2: Task Duration Countdown
  useEffect(() => {
    if (currentStep === 'TASK_RUNNING') {
      timerRef.current = setInterval(() => {
        setTaskSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleTaskFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStep]);

  const handleTaskFinish = async () => {
    setIsProcessing(true);
    try {
      const res = await completeTask(task.id);
      if (res.success) {
        setRewardClaimed(res.reward);
        setCurrentStep('COMPLETED');
        // Fire celebration confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
        });
        onSuccess();
      } else {
        setErrorMessage(res.message);
        setCurrentStep('INTERRUPTED');
      }
    } catch (err) {
      setErrorMessage('টাস্ক সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setCurrentStep('INTERRUPTED');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartTaskTimer = () => {
    if (adSecondsRemaining > 0) return;
    setCurrentStep('TASK_RUNNING');
    // If the task has an external url, open it in background or prompt
    if (task.externalUrl) {
      window.open(task.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCancel = () => {
    if (currentStep === 'AD_PRE_ROLL' && adSecondsRemaining > 0) {
      if (
        window.confirm(
          'বিজ্ঞাপন শেষ না করে বের হলে কোনো টাকা পাওয়া যাবে না এবং টাস্কটি বাতিল হবে। আপনি কি নিশ্চিত?'
        )
      ) {
        onClose();
      }
    } else if (currentStep === 'TASK_RUNNING' && taskSecondsRemaining > 0) {
      if (
        window.confirm(
          'টাস্ক চলাকালীন সময়ে বন্ধ করলে আপনার সময় নষ্ট হবে এবং কোনো রিওয়ার্ড পাবেন না। নিশ্চিত?'
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ৳
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {task.titleBn || task.title}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold">
                রিওয়ার্ড: ৳ {task.rewardAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Mandatory Ad Countdown */}
          {currentStep === 'AD_PRE_ROLL' && (
            <div className="space-y-5 text-center">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-amber-900">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    বাধ্যতামূলক স্পন্সর বিজ্ঞাপন
                  </span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  টাস্ক শুরু করার আগে স্পন্সরের বিজ্ঞাপনটি দেখুন। বিজ্ঞাপন শেষ হলে{' '}
                  <strong className="font-semibold text-amber-900">"টাস্কে যান"</strong> বাটনটি চালু
                  হবে।
                </p>
              </div>

              {/* Advertisement Creative Display */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-inner flex flex-col items-center">
                {preRollAd?.adCode ? (
                  <div className="w-full flex flex-col items-center justify-center">
                    <iframe
                      title="Task Ad"
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <base target="_blank">
                          <style>
                            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
                          </style>
                        </head>
                        <body>
                          ${preRollAd.adCode}
                        </body>
                        </html>
                      `}
                      style={{ width: '100%', height: '300px', border: 'none', overflow: 'hidden' }}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <h4 className="text-emerald-400 font-bold text-lg mb-2">🔥 স্পন্সর রিওয়ার্ড অফার!</h4>
                    <p className="text-xs text-slate-300">বিজ্ঞাপন দেখা শেষ হতে অপেক্ষা করুন</p>
                  </div>
                )}

                {/* Direct Sponsor Click Link */}
                <div className="pt-2 w-full text-center">
                  <a
                    href="https://www.profitableratecpmnetwork.com/pbt2uwgcaf?key=be8f8a3b7099681eb48e151cfdf2c0f1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 px-4 py-1.5 rounded-xl border border-amber-400/30 transition-colors"
                  >
                    <span>স্পন্সর অফার দেখুন (Click to View Offer)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Countdown Tracker */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-100 flex items-center justify-center bg-emerald-50">
                    <span className="text-3xl font-extrabold text-emerald-700">
                      {adSecondsRemaining}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium mt-2">
                  {adSecondsRemaining > 0
                    ? `বিজ্ঞাপন শেষ হতে আর ${adSecondsRemaining} সেকেন্ড বাকি...`
                    : '✅ বিজ্ঞাপন দেখা সফল হয়েছে! এখন টাস্ক শুরু করুন।'}
                </span>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleStartTaskTimer}
                disabled={adSecondsRemaining > 0}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  adSecondsRemaining === 0
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25 cursor-pointer scale-[1.01]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {adSecondsRemaining > 0 ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>অপেক্ষা করুন ({adSecondsRemaining}s)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>টাস্কে যান (Continue Task)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2: Task Running Timer */}
          {currentStep === 'TASK_RUNNING' && (
            <div className="space-y-6 text-center py-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>টাস্ক চালু রয়েছে</span>
                </div>
                <p className="text-xs text-emerald-700">
                  নিচের সময়টি শেষ হওয়া পর্যন্ত পেজটি ওপেন রাখুন। কোনো রিফ্রেশ বা ব্যাক বাটনে চাপবেন
                  না।
                </p>
              </div>

              {/* Large Clock Display */}
              <div className="py-2">
                <div className="text-5xl font-black text-slate-900 tracking-wider font-mono">
                  {formatTime(taskSecondsRemaining)}
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${((taskTotalSeconds - taskSecondsRemaining) / taskTotalSeconds) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 font-medium mt-2">
                  মোট সময়: {taskTotalSeconds} সেকেন্ড
                </p>
              </div>

              {/* Instructions & External Link */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  টাস্কের নির্দেশিকা:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
                {task.externalUrl && (
                  <div className="pt-2">
                    <a
                      href={task.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>ওয়েবসাইট ভিজিট করুন (নতুন ট্যাবে খুলবে)</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Completed Celebration */}
          {currentStep === 'COMPLETED' && (
            <div className="text-center py-6 space-y-5 animate-scaleUp">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">টাস্ক সফল হয়েছে!</h3>
                <p className="text-sm text-slate-500 mt-1">অভিনন্দন! আপনার ব্যালেন্সে যোগ হয়েছে</p>
                <div className="text-4xl font-extrabold text-emerald-600 mt-3">
                  + ৳ {rewardClaimed.toFixed(2)}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md cursor-pointer"
                >
                  অন্যান্য টাস্ক দেখুন
                </button>
              </div>
            </div>
          )}

          {/* Error / Interrupted */}
          {currentStep === 'INTERRUPTED' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">টাস্কটি অসম্পূর্ণ</h3>
              <p className="text-xs text-rose-600">{errorMessage}</p>
              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
              >
                ফিরে যান
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
