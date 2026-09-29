import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AdPlacement } from '../../types';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const { ads } = useApp();

  // Find active ad for this placement
  const activeAd = ads.find((a) => a.placement === placement && a.status === 'active');

  const adHeight = useMemo(() => {
    switch (placement) {
      case 'banner_top':
        return '110px';
      case 'dashboard':
        return '75px';
      case 'task_preroll':
        return '320px';
      case 'banner_bottom':
        return '130px';
      default:
        return '90px';
    }
  }, [placement]);

  if (!activeAd) {
    return null;
  }

  // Construct isolated srcdoc for scripts (atOptions, highrevenueformat, profitableratecpmnetwork)
  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <base target="_blank">
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          font-family: system-ui, -apple-system, sans-serif;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      ${activeAd.adCode}
    </body>
    </html>
  `;

  return (
    <div className={`my-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs ${className}`}>
      <div className="flex items-center justify-between px-3 py-1 bg-slate-50 border-b border-slate-200/60 text-[10px] text-slate-500 font-medium">
        <span className="flex items-center gap-1 uppercase tracking-wider font-semibold text-emerald-800">
          <Sparkles className="w-3 h-3 text-amber-500" /> স্পন্সর বিজ্ঞাপন
        </span>
        <span className="truncate max-w-[200px]">{activeAd.name}</span>
      </div>

      <div className="p-2 sm:p-3 flex flex-col items-center justify-center">
        {activeAd.type === 'image_banner' && activeAd.imageUrl ? (
          <a
            href={activeAd.targetUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative overflow-hidden rounded-xl w-full"
          >
            <img
              src={activeAd.imageUrl}
              alt={activeAd.name}
              className="w-full h-auto max-h-48 object-cover rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
            />
          </a>
        ) : (
          <div className="w-full flex justify-center items-center overflow-hidden">
            <iframe
              title={activeAd.name}
              srcDoc={iframeSrcDoc}
              style={{
                width: '100%',
                height: adHeight,
                border: 'none',
                overflow: 'hidden',
              }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        )}

        {/* Sponsor Direct Link Button */}
        {activeAd.targetUrl && (
          <div className="pt-2 w-full flex justify-end">
            <a
              href={activeAd.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors"
            >
              <span>বিজ্ঞাপন দেখুন ও বোনাস নিন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
