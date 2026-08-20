import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import RequirementsList from '../components/RequirementsList';

export const Home = () => {
  const navigate = useNavigate();
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

      {/* Verified Products Section */}
      <section className="container mx-auto px-4 pt-8">
         <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">All Verified B2B Products</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* Mock Card 1 */}
           <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
             <div className="h-48 bg-slate-100 p-4 flex items-center justify-center">
                <img src="https://placehold.co/300x200/e2e8f0/64748b?text=Machine" alt="Product" className="object-cover w-full h-full rounded" />
             </div>
             <div className="p-4 space-y-3">
               <h3 className="font-semibold text-slate-900 line-clamp-2">High Precision CNC Vertical Machining Center (VMC 850)</h3>
               <div className="flex items-end gap-2">
                 <span className="text-xl font-bold text-slate-900">₹ 18,50,000</span>
                 <span className="text-sm text-slate-500">/ Set</span>
               </div>
               <div className="flex justify-between text-xs text-slate-600">
                 <span>Material: Steel</span>
                 <span>MOQ: 1 Set</span>
               </div>
               <div className="border-t border-slate-100 pt-3">
                 <p className="font-medium text-sm text-[#004d40]">Precision Tech Machineries Pvt Ltd</p>
                 <p className="text-xs text-slate-500">Pune, Maharashtra <span className="ml-2 text-yellow-600 font-bold">★ 4.8</span></p>
               </div>
               <div className="flex gap-2 pt-2">
                 <Button onClick={() => navigate('/post-requirement')} className="flex-1 bg-white border border-green-600 text-green-700 hover:bg-green-50" size="sm">Get Best Price</Button>
                 <Button onClick={() => navigate('/post-requirement')} className="flex-1 bg-green-50 text-green-700 hover:bg-green-100" size="sm">WhatsApp</Button>
               </div>
             </div>
           </div>

           {/* Mock Card 2 */}
           <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
             <div className="h-48 bg-slate-100 p-4 flex items-center justify-center">
                <img src="https://placehold.co/300x200/e2e8f0/64748b?text=Pipes" alt="Product" className="object-cover w-full h-full rounded" />
             </div>
             <div className="p-4 space-y-3">
               <h3 className="font-semibold text-slate-900 line-clamp-2">Stainless Steel 304 Seamless Industrial Pipes & Tubes</h3>
               <div className="flex items-end gap-2">
                 <span className="text-xl font-bold text-slate-900">₹ 140</span>
                 <span className="text-sm text-slate-500">/ Kg</span>
               </div>
               <div className="flex justify-between text-xs text-slate-600">
                 <span>Outer Diameter: 50mm</span>
                 <span>MOQ: 250 Kg</span>
               </div>
               <div className="border-t border-slate-100 pt-3">
                 <p className="font-medium text-sm text-[#004d40]">Gujarat Alloys & Steel Tubes LLP</p>
                 <p className="text-xs text-slate-500">Ahmedabad, Gujarat <span className="ml-2 text-yellow-600 font-bold">★ 4.9</span></p>
               </div>
               <div className="flex gap-2 pt-2">
                 <Button onClick={() => navigate('/post-requirement')} className="flex-1 bg-white border border-green-600 text-green-700 hover:bg-green-50" size="sm">Get Best Price</Button>
                 <Button onClick={() => navigate('/post-requirement')} className="flex-1 bg-green-50 text-green-700 hover:bg-green-100" size="sm">WhatsApp</Button>
               </div>
             </div>
           </div>

           {/* Mock Card 3 */}
           <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
             <div className="h-48 bg-slate-100 p-4 flex items-center justify-center">
                <img src="https://placehold.co/300x200/e2e8f0/64748b?text=Solar" alt="Product" className="object-cover w-full h-full rounded" />
             </div>
             <div className="p-4 space-y-3">
               <h3 className="font-semibold text-slate-900 line-clamp-2">550W Monocrystalline PERC Bifacial Solar PV Panels</h3>
               <div className="flex items-end gap-2">
                 <span className="text-xl font-bold text-slate-900">₹ 9,000</span>
                 <span className="text-sm text-slate-500">/ Piece</span>
               </div>
               <div className="flex justify-between text-xs text-slate-600">
                 <span>Cell Type: Mono PERC</span>
                 <span>MOQ: 10 Piece</span>
               </div>
               <div className="border-t border-slate-100 pt-3">
                 <p className="font-medium text-sm text-[#004d40]">Surya Shakti Green Energy Corp</p>
                 <p className="text-xs text-slate-500">Jaipur, Rajasthan <span className="ml-2 text-yellow-600 font-bold">★ 4.7</span></p>
               </div>
               <div className="flex gap-2 pt-2">
                 <Button onClick={() => navigate('/post-requirement')} className="flex-1 bg-white border border-green-600 text-green-700 hover:bg-green-50" size="sm">Get Best Price</Button>
                 <Button onClick={() => navigate('/post-requirement')} className="flex-1 bg-green-50 text-green-700 hover:bg-green-100" size="sm">WhatsApp</Button>
               </div>
             </div>
           </div>

           {/* Mock Card 4 */}
           <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
             <div className="h-48 bg-slate-100 p-4 flex items-center justify-center">
                <img src="https://placehold.co/300x200/e2e8f0/64748b?text=Cotton" alt="Product" className="object-cover w-full h-full rounded" />
             </div>
             <div className="p-4 space-y-3">
               <h3 className="font-semibold text-slate-900 line-clamp-2">100% Combed Cotton Ring Spun Yarns (Ne 30s & 40s)</h3>
               <div className="flex items-end gap-2">
                 <span className="text-xl font-bold text-slate-900">₹ 285</span>
                 <span className="text-sm text-slate-500">/ Kg</span>
               </div>
               <div className="flex justify-between text-xs text-slate-600">
                 <span>Yarn Count: 30s</span>
                 <span>MOQ: 500 Kg</span>
               </div>
               <div className="border-t border-slate-100 pt-3">
                 <p className="font-medium text-sm text-[#004d40]">Balaji Spinners & Texfab India</p>
                 <p className="text-xs text-slate-500">Surat, Gujarat <span className="ml-2 text-yellow-600 font-bold">★ 4.6</span></p>
               </div>
               <div className="flex gap-2 pt-2">
                 <Button onClick={() => navigate('/post-requirement')} className="flex-1 bg-white border border-green-600 text-green-700 hover:bg-green-50" size="sm">Get Best Price</Button>
                 <Button onClick={() => navigate('/post-requirement')} className="flex-1 bg-green-50 text-green-700 hover:bg-green-100" size="sm">WhatsApp</Button>
               </div>
             </div>
           </div>
         </div>
      </section>
      
      {/* Tea Cup Banner */}
      <section className="container mx-auto px-4 mt-8">
        <div className="border-2 border-teal-500 rounded-2xl p-8 bg-gradient-to-r from-white to-teal-50 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
           <div className="flex gap-6 items-center">
              <div className="w-24 h-24 bg-yellow-100 rounded flex items-center justify-center text-center p-2 font-bold text-yellow-800 shadow-inner">
                 HOT TEA GLASS
              </div>
              <span className="text-3xl font-bold text-slate-300">=</span>
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 shadow-inner border-4 border-slate-300">
                 ₹10 COIN
              </div>
           </div>
           
           <div className="flex-1 text-center md:text-left">
             <p className="text-teal-800 font-bold uppercase tracking-widest text-xs mb-2">Unbeatable B2B Marketing Value</p>
             <h2 className="text-2xl md:text-4xl font-black text-[#004d40] mb-3">PROMOTE YOUR BUSINESS <span className="text-teal-600">@ 1 CUP OF TEA</span> <span className="text-red-600">(INR 10)</span> PER DAY</h2>
             <p className="text-slate-600">Connect your products with thousands of verified wholesale buyers globally at an unbeatable daily cost of just ₹10/day.</p>
           </div>
           
           <div className="flex flex-col items-center md:items-end gap-3 min-w-[200px]">
             <Button onClick={() => navigate('/')} className="bg-[#004d40] hover:bg-[#003d33] text-white w-full rounded-full h-12 text-lg font-bold shadow-lg group">
                FREE JOURNEY <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
             </Button>
             <span className="text-xs text-slate-500 text-center">Click to explore catalog, search products, post requirements, and access dashboard.</span>
           </div>
        </div>
      </section>

      {/* Latest Buy Requirements */}
      <section className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">Latest Buy Requirements</h2>
        <RequirementsList />
      </section>

      {/* Govt & PSU Requirements */}
      <section className="container mx-auto px-4 mt-12 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">
              <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-[10px]">🏛</span>
              Government Procurement (India) | CPPP & GeM Feed
            </div>
            <h2 className="text-2xl font-bold text-[#002b24]">Live Government & PSU Buyer Requirements</h2>
            <p className="text-sm text-slate-600 mt-1">Explore high-value public active tenders, EOI inquiries, and bulk procurement contracts from central ministries, state utilities, and Maharatna/Navratna PSUs.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button onClick={() => navigate('/')} variant="outline" className="border-slate-300 text-slate-700">Sync Tenders</Button>
            <Button onClick={() => navigate('/post-requirement')} className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold">Post B2B Requirement</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2 gap-4">
          <div className="relative min-w-[250px]">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <Input className="pl-9 bg-slate-50" placeholder="Search tender title, organization, ref no..." />
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <button className="px-4 py-2 border-b-2 border-[#004d40] text-[#004d40] whitespace-nowrap">All</button>
            <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap">Industrial Machinery</button>
            <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap">Electrical & Energy</button>
            <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap">Civil & Infrastructure</button>
            <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap">IT & Telecom</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tender Card 1 */}
          <div className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors bg-slate-50/50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                 <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">CPPP (Govt of India)</span>
                 <span className="text-xs text-slate-500 font-medium">Electrical & Energy</span>
              </div>
              <span className="bg-green-100 text-green-800 font-bold text-sm px-2 py-1 rounded">Val: ₹ 1.85 Cr</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Procurement of Heavy-Duty 33kV Electrical Step-Down Transformers for Power Sub-Station Grid Expansion</h3>
            <div className="flex items-start gap-2 mt-3 text-sm">
              <span className="text-slate-400 mt-0.5">🏢</span>
              <div>
                <p className="font-semibold text-slate-700">Maharashtra State Electricity Distribution Co.</p>
                <p className="text-slate-500 text-xs">Location: Nagpur / Pune, MH</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
               <div>
                 <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">CLOSING DEADLINE</p>
                 <p className="text-red-600 font-semibold text-sm">28-Aug-2026 05:00 PM</p>
               </div>
               <Button onClick={() => navigate('/')} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">View Tender ↗</Button>
            </div>
          </div>

          {/* Tender Card 2 */}
          <div className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors bg-slate-50/50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                 <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">GeM Portal (Govt e-Marketplace)</span>
                 <span className="text-xs text-slate-500 font-medium">IT & Telecom</span>
              </div>
              <span className="bg-green-100 text-green-800 font-bold text-sm px-2 py-1 rounded">Val: ₹ 92.5 Lakhs</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Supply, Commissioning and 3-Year Onsite AMC of Cloud-Ready Rack Server Blades & Industrial Firewall</h3>
            <div className="flex items-start gap-2 mt-3 text-sm">
              <span className="text-slate-400 mt-0.5">🏢</span>
              <div>
                <p className="font-semibold text-slate-700">National Informatics Centre (NIC / MeitY)</p>
                <p className="text-slate-500 text-xs">Location: New Delhi, DL</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
               <div>
                 <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">CLOSING DEADLINE</p>
                 <p className="text-red-600 font-semibold text-sm">02-Sep-2026 03:30 PM</p>
               </div>
               <Button onClick={() => navigate('/')} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">View Tender ↗</Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
