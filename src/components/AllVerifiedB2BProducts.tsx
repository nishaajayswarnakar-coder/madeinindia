import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80";

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
}

function SafeImage({ src, alt, className }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src && src.trim() !== '' ? src : DEFAULT_FALLBACK);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className || "w-full h-[100px] object-contain mb-2 rounded"}
      onError={() => setImgSrc(DEFAULT_FALLBACK)}
    />
  );
}

interface SubCategoryItem {
  name: string;
  image: string;
}

interface IndustryCategory {
  title: string;
  bannerImage: string;
  subCategories: string[];
  ribbonItems: SubCategoryItem[];
}

export default function AllVerifiedB2BProducts({ categories }: { categories: IndustryCategory[] }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Industrial Plants & Machinery');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber) {
      alert("Please enter a valid mobile number.");
      return;
    }
    navigate(`/post-requirement?category=${encodeURIComponent(selectedCategory)}&mobile=${encodeURIComponent(mobileNumber)}`);
  };

  return (
    <section className="bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          All Verified B2B Products
        </h2>

        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b-2 border-blue-600 inline-block pr-4">
              {cat.title}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {cat.ribbonItems.map((item, rIdx) => (
                <div key={rIdx} className="border border-slate-100 rounded-md p-3 text-center bg-white hover:-translate-y-1 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
                  <SafeImage src={item.image} alt={item.name} />
                  <p className="text-[13px] font-semibold text-slate-700 leading-tight m-0">{item.name}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <button className="px-6 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-sm font-medium rounded-md transition shadow-sm">
                View More {cat.title}
              </button>
            </div>
          </div>
        ))}

        {/* Lead Generation Form: "Get Quotes from Verified Suppliers" */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 mt-12 text-center max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            Get Quotes from Verified Suppliers
          </h3>
          <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="w-full sm:w-1/2 text-left">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Product / Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {categories.map((c, i) => (
                  <option key={i} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/2 text-left">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-md">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  maxLength={10}
                  className="w-full border border-slate-300 rounded-r-md p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="w-full sm:w-auto self-end mt-2 sm:mt-0">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-sm rounded-md transition shadow"
              >
                Submit Requirement
              </button>
            </div>
          </form>
          <p className="text-xs text-slate-400 mt-4">
            By submitting, you agree to the terms of <span className="font-semibold text-slate-600">Made in India | Made for the World</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
