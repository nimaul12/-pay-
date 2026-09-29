import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PlayCircle, Clock, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VideoAdsSection: React.FC = () => {
  const { currentUser, settings, ads, watchVideoAd } = useApp();

  const videoAd = ads.find((a) => a.placement === 'video_ads' && a.status === 'active');
  const adDuration = settings.videoAdDuration || 15;
  const rewardAmount = settings.videoAdReward || 1.5;
  const dailyLimit = settings.videoAdsDailyLimit || 10;
  const watchedCount = currentUser?.adsWatchedToday || 0;
  const canWatch = watchedCount < dailyLimit;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(adDuration);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            finishAdWatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const startAd = () => {
    if (!canWatch) {
      setStatusMessage('আজকের ভিডিও দেখার লিমিট শেষ হয়েছে।');
      return;
    }
    setSecondsLeft(adDuration);
    setIsCompleted(false);
    setStatusMessage('');
    setIsPlaying(true);
  };

  const finishAdWatch = async () => {
    setIsPlaying(false);
    setIsCompleted(true);

    const res = await watchVideoAd(videoAd?.id || 'video-ad-default');
    if (res.success) {
      setStatusMessage(`🎉 অভিনন্দন! ৳${res.reward.toFixed(2)} টাকা আপনার ওয়ালেটে জমা হয়েছে!`);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      setStatusMessage(res.message);
    }
  };

  const handleInterrupt = () => {
    if (isPlaying) {
      if (
        window.confirm(
          'ভিডিও শেষ হওয়ার পূর্বে কেটে দিলে কোনো টাকা পাওয়া যাবে না। আপনি কি নিশ্চিত?'
        )
      ) {
        setIsPlaying(false);
        setSecondsLeft(adDuration);
        setStatusMessage('ভিডিওটি অসম্পূর্ণ থেকে গেছে। পুরো সময় দেখুন।');
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-3xl p-6 text-white shadow-lg shadow-rose-600/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1.5">
            <PlayCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>ভিডিও অ্যাড রিওয়ার্ড</span>
          </span>
        </div>
        <h2 className="text-2xl font-black">ভিডিও দেখুন এবং প্রতিটিতে ৳ {rewardAmount.toFixed(2)} আয় করুন</h2>
        <p className="text-rose-100 text-xs sm:text-sm mt-1 max-w-xl">
          প্রতিদিন সর্বোচ্চ {dailyLimit} টি ভিডিও দেখে আয় করতে পারবেন। কোনো স্কিপ না করে পুরো সময়
          দেখলে সরাসরি ওয়ালেটে টাকা যোগ হবে।
        </p>

        {/* Counter Pill */}
        <div className="mt-4 inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-semibold">
          <span>আজকের অগ্রগতি:</span>
          <span className="text-amber-300 font-extrabold text-sm">
            {watchedCount} / {dailyLimit}
          </span>
          <span>টি ভিডিও সম্পন্ন</span>
        </div>
      </div>

      {/* Main Video Box / Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        {isPlaying ? (
          <div className="space-y-4">
            {/* Player Container */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white border border-slate-800 shadow-inner">
              {videoAd?.imageUrl ? (
                <img
                  src={videoAd.imageUrl}
                  alt="Video Ad Sponsor"
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
              ) : null}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs" />

              {/* Countdown overlay */}
              <div className="relative z-10 text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse font-mono text-2xl font-black">
                  {secondsLeft}s
                </div>
                <div className="text-sm font-bold tracking-tight">ভিডিও বিজ্ঞাপন চলছে...</div>
                <p className="text-xs text-slate-300">
                  অনুগ্রহ করে পেজটি বন্ধ বা রিফ্রেশ করবেন না
                </p>
              </div>

              {/* Bottom Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-800">
                <div
                  className="bg-rose-500 h-full transition-all duration-1000"
                  style={{
                    width: `${((adDuration - secondsLeft) / adDuration) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> সিকিউর সেশন ভ্যালিডেশন
              </span>
              <button
                onClick={handleInterrupt}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50"
              >
                বিজ্ঞাপন বাতিল করুন
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <PlayCircle className="w-10 h-10" />
            </div>

            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">ভিডিও বিজ্ঞাপন শুরু করতে প্রস্তুত?</h3>
              <p className="text-xs text-slate-500 mt-1">
                ভিডিওর দৈর্ঘ্য {adDuration} সেকেন্ড। সম্পন্ন হওয়া মাত্রই ৳ {rewardAmount.toFixed(2)}{' '}
                আপনার অ্যাকাউন্টে যোগ হবে।
              </p>
            </div>

            {statusMessage && (
              <div
                className={`p-3 rounded-2xl text-xs font-semibold max-w-md mx-auto ${
                  isCompleted ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {statusMessage}
              </div>
            )}

            <div>
              <button
                onClick={startAd}
                disabled={!canWatch}
                className={`py-3.5 px-8 rounded-2xl font-bold text-sm transition-all shadow-md ${
                  canWatch
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 cursor-pointer scale-[1.02]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {canWatch ? 'ভিডিও বিজ্ঞাপন দেখুন (Watch Ad)' : 'আজকের লিমিট শেষ'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
