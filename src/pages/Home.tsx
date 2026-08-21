import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import RequirementsList from '../components/RequirementsList';
import AllVerifiedB2BProducts from '../components/AllVerifiedB2BProducts';
import TrendingProducts from '../components/TrendingProducts';
import { categoryData } from '../data/categories';
import { tendersData } from '../data/tenders';
import { Loader2 } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleSyncTenders = async () => {
    setIsSyncing(true);
    setNotification(null);

    try {
      // Simulate frontend delay before network request for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await fetch('/api/tenders/sync-cppp-gem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer fake-auth-token`
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      // Mock success for now since no backend is connected
      setNotification({ type: 'success', message: 'Tenders synced successfully!' });
      
    } catch (error) {
      console.error('Tender Sync Failed:', error);
      setNotification({ 
        type: 'error', 
        message: 'Unable to fetch GeM/CPPP feeds. Please check API credentials or network connectivity.' 
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Hero Section */}
      <section className="bg-[#004d40] text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-sm border border-yellow-400/30 rounded-full px-3 py-1 bg-yellow-400/10">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Made in India | Made for the World
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Source Products &amp; Get <span className="text-yellow-400">Best Wholesale Quotes</span> Fast
            </h1>
            
            <p className="text-lg text-green-100 max-w-2xl">
              Post your business requirement once and receive verified competitive quotations from verified suppliers with genuine GST certificates and TrustSEAL assurance.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-green-100 pt-4">
              <span className="font-semibold text-white">Popular:</span>
              <Link to="/" className="hover:text-yellow-400">CNC Machines</Link>
              <Link to="/" className="hover:text-yellow-400">SS 304 Pipes</Link>
              <Link to="/" className="hover:text-yellow-400">550W Solar Panels</Link>
              <Link to="/" className="hover:text-yellow-400">Screw Compressor</Link>
              <Link to="/" className="hover:text-yellow-400">Cotton Yarns</Link>
              <Link to="/" className="hover:text-yellow-400">ICU Beds</Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-green-800/50">
              <div className="flex items-center gap-2">
                 <span className="text-green-400">✔</span> 100% GST Verified
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-green-400">✔</span> TrustSEAL Assured
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-green-400">✔</span> Instant RFQ Dispatch
              </div>
            </div>
          </div>

          {/* Post Requirement Box */}
          <div className="w-full lg:w-[450px] bg-white rounded-xl p-6 text-slate-900 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Post Buy Requirement</h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">FREE RFQ</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">Get multiple quotes from verified suppliers in 15 mins</p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">What product or service do you need?</label>
                <Input placeholder="e.g. 500 Kg Stainless Steel Pipes or CNC Machine" className="bg-slate-50" />
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1"><span className="text-green-600">✓</span> Zero Commission</span>
                <span className="flex items-center gap-1"><span className="text-green-600">✓</span> Direct Supplier Calls</span>
              </div>
              
              <Button type="button" onClick={() => navigate('/post-requirement')} className="w-full bg-[#004d40] hover:bg-[#003d33] text-white text-base py-6 font-bold group">
                Post Requirement &amp; Get Quotes 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </form>
          </div>
          
        </div>
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </section>
            {/* Promotional Banner */}
      <section className="bg-slate-50 py-6 mt-4">
        <div className="container mx-auto px-4">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-6 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between shadow-sm max-w-[1200px] mx-auto gap-6 text-center md:text-left">
            <div>
              <span className="text-[12px] font-extrabold text-[#166534] tracking-[1px] uppercase mb-2 block">
                Unbeatable B2B Marketing Value
              </span>
              <h2 className="text-[28px] md:text-[36px] font-black text-[#064e3b] mb-3 leading-[1.15] uppercase tracking-tight">
                Promote Your<br className="hidden md:block" />
                Business <span className="text-[#059669]">@ 1 Cup Of</span><br className="hidden md:block" />
                <span className="text-[#059669]">Tea</span> (<span className="text-[#dc2626]">INR 10</span>) Per Day
              </h2>
              <p className="text-[15px] text-[#334155] max-w-[650px] m-0 leading-relaxed font-medium">
                Connect your products with thousands of verified wholesale buyers globally at an unbeatable daily cost of just ₹10/day.
              </p>
            </div>
            <div>
              <a href="#promote" className="inline-block bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 px-8 rounded flex-shrink-0 transition-colors shadow-md text-[15px] uppercase tracking-wide">
                Promote Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Buy Requirements */}
      <section className="container mx-auto px-4 pt-8">
        <div id="latest-buy-requirements" className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-slate-900">Latest Buy Requirements</h2>
            <button className="text-sm font-semibold text-emerald-700 hover:underline" onClick={() => navigate('/post-requirement')}>+ Post RFQ / Screenshot</button>
          </div>
          <RequirementsList />
        </div>
      </section>

      {/* Verified Products Section */}
      <TrendingProducts />
      <AllVerifiedB2BProducts categories={categoryData} />

      {/* Govt & PSU Requirements */}
      <section className="container mx-auto px-4 mt-12 mb-12">
        <div id="cppp-gem-feed" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
          
          {/* Notification Overlay/Banner */}
          {notification && (
            <div className={`absolute top-0 left-0 right-0 px-4 py-2 text-sm font-medium text-center transition-all ${
              notification.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-b border-emerald-200' : 'bg-red-100 text-red-800 border-b border-red-200'
            }`}>
              {notification.message}
            </div>
          )}
          
          <div className={`flex items-center justify-between border-b pb-4 mb-4 ${notification ? 'pt-8' : ''}`}>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xl font-bold text-slate-900">Government Procurement (India) | CPPP & GeM Feed</h2>
            </div>
            <div className="flex space-x-2">
              <button 
                id="sync-tenders-btn"
                onClick={handleSyncTenders}
                disabled={isSyncing}
                className="flex items-center gap-1.5 text-xs px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isSyncing && <Loader2 className="w-3 h-3 animate-spin" />}
                {isSyncing ? 'Syncing Tenders...' : 'Sync Tenders'}
              </button>
              <button onClick={() => navigate('/post-requirement')} className="text-xs px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded shadow-sm">Post B2B Requirement</button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Explore high-value public active tenders, EOI inquiries, and bulk procurement contracts from central ministries, state utilities, and Maharatna/Navratna PSUs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {tendersData.map((tender) => (
              <div key={tender.id} className="border border-slate-200 rounded-lg p-4 hover:border-emerald-600 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded ${
                      tender.source === 'CPPP' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tender.source === 'CPPP' ? 'CPPP (GOVT OF INDIA)' : 'GeM PORTAL (GOVT E-MARKETPLACE)'}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-800">Val: {tender.value}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {tender.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">Location: {tender.location}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-red-600 font-medium">Closing: {tender.closingDate}</span>
                  <button className="text-emerald-700 font-semibold hover:underline">View Tender ↗</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
