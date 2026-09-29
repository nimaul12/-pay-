import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdvertisementItem, AdPlacement } from '../../types';
import {
  Megaphone,
  Plus,
  Edit2,
  Code,
  Image,
  Eye,
  CheckCircle,
  XCircle,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';

export const AdminAds: React.FC = () => {
  const { ads, saveAd } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdvertisementItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [placement, setPlacement] = useState<AdPlacement>('task_preroll');
  const [type, setType] = useState<'html_script' | 'image_banner' | 'video'>('image_banner');
  const [adCode, setAdCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const placementsList: { id: AdPlacement; label: string; desc: string }[] = [
    {
      id: 'task_preroll',
      label: 'টাস্ক প্রি-রোল অ্যাড (১০ সেকেন্ড)',
      desc: 'টাস্ক শুরু করার পূর্বে ব্যবহারকারীকে বাধ্যতামূলক ১০ সেকেন্ড প্রদর্শিত হয়',
    },
    {
      id: 'banner_top',
      label: 'হেডার ব্যানার (Top Banner)',
      desc: 'হোমপেজ ও ড্যাশবোর্ডের একদম উপরে প্রদর্শিত ব্যানার',
    },
    {
      id: 'banner_bottom',
      label: 'ফুটার ব্যানার (Bottom Banner)',
      desc: 'পেজের একদম নিচে প্রদর্শিত বিজ্ঞাপন',
    },
    {
      id: 'dashboard',
      label: 'ড্যাশবোর্ড মিডিয়াম অ্যাড',
      desc: 'টাস্ক তালিকার মাঝখানে প্রদর্শিত ব্যানার',
    },
    {
      id: 'video_ads',
      label: 'ভিডিও অ্যাড আর্নিং সেকশন',
      desc: 'ভিডিও বিজ্ঞাপন দেখার পেইজের স্পন্সর বিজ্ঞাপন',
    },
    {
      id: 'social_bar',
      label: 'সোশ্যাল বার (Social Bar Notification)',
      desc: 'স্ক্রিনের কোণায় ভাসমান নোটিফিকেশন বার',
    },
    {
      id: 'popunder',
      label: 'পপ-আন্ডার অ্যাড (Popunder Script)',
      desc: 'ব্যবহারকারী সাইটে ক্লিক করলে ব্যাকগ্রাউন্ডে স্পনসর সাইট ওপেন হয়',
    },
  ];

  const openNewAdModal = () => {
    setEditingAd(null);
    setName('');
    setPlacement('task_preroll');
    setType('image_banner');
    setAdCode('');
    setImageUrl('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=60');
    setTargetUrl('https://bkash.com');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (ad: AdvertisementItem) => {
    setEditingAd(ad);
    setName(ad.name);
    setPlacement(ad.placement);
    setType(ad.type);
    setAdCode(ad.adCode || '');
    setImageUrl(ad.imageUrl || '');
    setTargetUrl(ad.targetUrl || '');
    setStatus(ad.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const adToSave: AdvertisementItem = {
      id: editingAd ? editingAd.id : `ad-${Date.now()}`,
      name,
      placement,
      type,
      adCode,
      imageUrl: type === 'image_banner' ? imageUrl : undefined,
      targetUrl: type === 'image_banner' ? targetUrl : undefined,
      status,
      createdAt: editingAd ? editingAd.createdAt : new Date().toISOString(),
    };

    saveAd(adToSave);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            বিজ্ঞাপন ও নেটওয়ার্ক সেটিংস (Ads Management)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adsterra, Monetag, Google AdSense বা নিজস্ব ব্যানার অ্যাড কোড পেস্ট করুন
          </p>
        </div>

        <button
          onClick={openNewAdModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিজ্ঞাপন যোগ করুন</span>
        </button>
      </div>

      {/* Guide Card on Where to Paste Code */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 text-amber-900">
        <div className="flex items-center gap-2 font-bold text-sm mb-1 text-amber-800">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>বিজ্ঞাপন কোড কোথায় বসাবেন? (How Ad Placement Works)</span>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          আপনার অ্যাড নেটওয়ার্ক (যেমন: Adsterra, PropellerAds, Monetag) থেকে প্রাপ্ত স্ক্রিপ্ট বা HTML
          ট্যাগ নিচের বিজ্ঞাপন সেটিংসে <strong>"Ad Code / HTML"</strong> ফিল্ডে পেস্ট করে সেভ করুন।
          বিশেষ করে <strong>টাস্ক প্রি-রোল অ্যাড</strong> প্রতিটি টাস্ক শুরু হওয়ার আগে ১০ সেকেন্ড
          অটোমেটিক চলবে।
        </p>
      </div>

      {/* Placements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => {
          const placementInfo = placementsList.find((p) => p.id === ad.placement);
          return (
            <div
              key={ad.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {ad.placement}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ad.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {ad.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{ad.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {placementInfo?.desc || 'কাস্টম বিজ্ঞাপন প্লেসমেন্ট'}
                </p>

                {/* Preview Image if image banner */}
                {ad.type === 'image_banner' && ad.imageUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
                    <img
                      src={ad.imageUrl}
                      alt={ad.name}
                      className="w-full h-24 object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* Script indicator */}
                {ad.type === 'html_script' && (
                  <div className="mt-3 p-2 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono line-clamp-2">
                    {ad.adCode || '<!-- Custom Script / Ad Tag -->'}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  টাইপ: {ad.type === 'image_banner' ? 'ব্যানার ছবি' : 'HTML স্ক্রিপ্ট'}
                </span>
                <button
                  onClick={() => openEditModal(ad)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>এডিট কোড</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Ad Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingAd ? 'বিজ্ঞাপন কোড আপডেট করুন' : 'নতুন বিজ্ঞাপন কনফিগারেশন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">বিজ্ঞাপনের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Adsterra Task Pre-Roll Banner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">প্লেসমেন্ট (স্থান) *</label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {placementsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">বিজ্ঞাপন টাইপ *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="image_banner">ছবি ব্যানার ও লিংক (Image Banner)</option>
                    <option value="html_script">কাস্টম HTML / JavaScript কোড</option>
                    <option value="video">ভিডিও বিজ্ঞাপন (Video Ad)</option>
                  </select>
                </div>
              </div>

              {type === 'image_banner' ? (
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      ব্যানার ছবির লিংক (Image URL) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      টার্গেট লিংক (ক্লিক করলে যেখানে যাবে) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    কাস্টম অ্যাড কোড বা স্ক্রিপ্ট পেস্ট করুন [ADMIN PASTES AD CODE HERE] *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder={`<script type="text/javascript">\n  // Your Ad Network Tag (Adsterra / Monetag)\n</script>`}
                    value={adCode}
                    onChange={(e) => setAdCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-700 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">স্ট্যাটাস (সক্রিয় / বন্ধ)</span>
                <button
                  type="button"
                  onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    status === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {status === 'active' ? 'সক্রিয় (Active)' : 'বন্ধ (Inactive)'}
                </button>
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
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
