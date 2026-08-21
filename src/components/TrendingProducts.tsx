import React, { useState } from 'react';

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80";

function SafeImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState<string>(src && src.trim() !== '' ? src : DEFAULT_FALLBACK);
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className || "w-16 h-16 object-cover rounded-full"}
      onError={() => setImgSrc(DEFAULT_FALLBACK)}
    />
  );
}

export const trendingData = [
  { name: "Electric Scooter", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=150&auto=format&fit=crop&q=80" },
  { name: "Aromatic Incense Sticks", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=150&auto=format&fit=crop&q=80" },
  { name: "Kamadhenu Cow and Calf Statue", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&auto=format&fit=crop&q=80" },
  { name: "Dupion Silk", image: "https://images.unsplash.com/photo-1584031976074-672535a3962b?w=150&auto=format&fit=crop&q=80" },
  { name: "Income Tax Consultant", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=80" },
  { name: "Air Hose Pipe", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=150&auto=format&fit=crop&q=80" },
  { name: "Printed Labels", image: "https://images.unsplash.com/photo-1587304192667-005d43615467?w=150&auto=format&fit=crop&q=80" },
  { name: "Ammonium Bromide", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=150&auto=format&fit=crop&q=80" },
  { name: "TMT Bars", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80" },
  { name: "Disposable Toothbrushes", image: "https://images.unsplash.com/photo-1608248597260-84a1d48c8b67?w=150&auto=format&fit=crop&q=80" },
  { name: "Acrylic Crockery", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=150&auto=format&fit=crop&q=80" },
  { name: "Aluminium False Ceilings", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&auto=format&fit=crop&q=80" },
  { name: "Air Regulators", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80" },
  { name: "AC Power Supply", image: "https://images.unsplash.com/photo-1558234857-4b72688463c2?w=150&auto=format&fit=crop&q=80" },
  { name: "Stainless Steel Wire", image: "https://images.unsplash.com/photo-1558234857-4b72688463c2?w=150&auto=format&fit=crop&q=80" },
  { name: "Custom Flag", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80" },
  { name: "Wicker Chair", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=80" },
  { name: "Coconut Tree Climber", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80" }
];

export default function TrendingProducts() {
  return (
    <section className="bg-indigo-600 py-8 text-white w-full">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Trending on Made in India</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition-shadow border border-indigo-400">
              <div className="w-16 h-16 mb-3 flex items-center justify-center overflow-hidden">
                <SafeImage src={item.image} alt={item.name} />
              </div>
              <span className="text-[13px] font-semibold text-slate-800 leading-tight">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
