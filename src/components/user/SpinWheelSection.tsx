import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Disc, Sparkles, Trophy, RotateCcw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SpinWheelSection: React.FC = () => {
  const { currentUser, settings, spinWheel } = useApp();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [prizeResult, setPrizeResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const rewards = settings.spinRewards || [0.5, 1, 2, 3, 5, 10, 0, 15];
  const totalSlices = rewards.length;
  const sliceAngle = 360 / totalSlices;

  const spinsDone = currentUser?.spinsToday || 0;
  const dailyLimit = settings.spinDailyLimit || 5;
  const spinsLeft = Math.max(0, dailyLimit - spinsDone);

  // Slices colors palette
  const sliceColors = [
    '#10B981', // Emerald
    '#059669', // Dark Emerald
    '#F59E0B', // Amber
    '#D97706', // Dark Amber
    '#3B82F6', // Blue
    '#2563EB', // Dark Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
  ];

  const handleSpinClick = async () => {
    if (isSpinning) return;
    if (spinsLeft <= 0) {
      setErrorMessage(`আজকের সর্বোচ্চ ${dailyLimit}টি স্পিন শেষ হয়েছে। আগামীকাল আবার আসুন!`);
      return;
    }

    setErrorMessage('');
    setPrizeResult(null);
    setIsSpinning(true);

    try {
      // Call secure context spin generator
      const res = await spinWheel();

      // Find the index of the awarded prize in the slices
      let targetIndex = rewards.indexOf(res.reward);
      if (targetIndex === -1) targetIndex = 0;

      // Calculate rotation so that target slice lands right at the top indicator (270 deg or pointer position)
      // Extra 5 full rotations (1800 deg) for momentum excitement
      const extraSpins = 5 * 360;
      const targetAngle = 360 - (targetIndex * sliceAngle + sliceAngle / 2);
      const newTotalDegrees = rotationDegrees + extraSpins + (targetAngle - (rotationDegrees % 360));

      setRotationDegrees(newTotalDegrees);

      // Wait for spin animation (4 seconds)
      setTimeout(() => {
        setIsSpinning(false);
        setPrizeResult(res.message);

        if (res.reward > 0) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }, 4200);
    } catch (e) {
      setIsSpinning(false);
      setErrorMessage('স্পিন করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-amber-500/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>লাকি হুইল স্পিন অ্যান্ড উইন</span>
          </span>
        </div>
        <h2 className="text-2xl font-black">স্পিন ঘুরিয়ে জিতে নিন আকর্ষণীয় নগদ টাকা!</h2>
        <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
          প্রতিদিন বিনামূল্যে স্পিন করুন এবং সরাসরি আপনার মূল ব্যালেন্সে সর্বোচ্চ ৳১৫ পর্যন্ত যোগ করুন।
        </p>

        {/* Counter */}
        <div className="mt-4 inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-semibold">
          <span>আজকের অবশিষ্ট স্পিন:</span>
          <span className="text-yellow-300 font-extrabold text-sm">{spinsLeft} বার</span>
        </div>
      </div>

      {/* Interactive Wheel Area */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col items-center shadow-sm">
        {/* Wheel Container with Pointer */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
          {/* Top Pointer Indicator */}
          <div className="absolute -top-3 z-20 flex flex-col items-center">
            <div className="w-6 h-7 bg-rose-600 clip-pointer shadow-md filter drop-shadow-md" />
            <div className="w-3 h-3 rounded-full bg-white border-2 border-rose-600 -mt-1" />
          </div>

          {/* SVG Rotating Wheel */}
          <div
            className="w-full h-full rounded-full shadow-2xl border-8 border-slate-900 overflow-hidden relative"
            style={{
              transform: `rotate(${rotationDegrees}deg)`,
              transition: isSpinning
                ? 'transform 4s cubic-bezier(0.15, 0.85, 0.15, 1)'
                : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {rewards.map((val, idx) => {
                const startAngle = (idx * 360) / totalSlices;
                const endAngle = ((idx + 1) * 360) / totalSlices;

                // SVG Arc Path
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const textAngle = startAngle + sliceAngle / 2;
                const textX = 50 + 33 * Math.cos((Math.PI * textAngle) / 180);
                const textY = 50 + 33 * Math.sin((Math.PI * textAngle) / 180);

                return (
                  <g key={idx}>
                    <path
                      d={pathData}
                      fill={sliceColors[idx % sliceColors.length]}
                      stroke="#0f172a"
                      strokeWidth="0.7"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {val > 0 ? `৳${val}` : 'শূন্য'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub Button */}
          <div className="absolute w-16 h-16 rounded-full bg-slate-900 border-4 border-amber-400 text-amber-300 flex items-center justify-center font-black text-xs shadow-lg z-10">
            স্পিন
          </div>
        </div>

        {/* Feedback Message */}
        {prizeResult && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center text-sm font-bold animate-bounce-subtle max-w-sm mt-3">
            {prizeResult}
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-center text-xs font-semibold max-w-sm mt-3 flex items-center gap-1.5 justify-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Spin Trigger Button */}
        <div className="mt-6 w-full max-w-xs">
          <button
            onClick={handleSpinClick}
            disabled={isSpinning || spinsLeft <= 0}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
              !isSpinning && spinsLeft > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30 cursor-pointer scale-[1.02]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'হুইল ঘুরছে...' : 'স্পিন করুন (Spin Now)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
