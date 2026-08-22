import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './auth/AuthContext';

interface ProductOffer {
  id: string;
  category: string;
  is_gst_verified: boolean;
  created_at: string;
  image_url: string;
  title: string;
  location: string;
  quantity: string;
  description: string;
  seller_name: string;
  seller_company: string;
  seller_phone: string;
  seller_email: string;
}

export default function LatestSellOffers() {
  const [products, setProducts] = useState<ProductOffer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductOffer | null>(null);
  const postsPerPage = 20;

  const { user } = useAuth();

  useEffect(() => {
    fetchProductOffers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleRefresh = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newPostId = customEvent.detail?.newPostId;
      const isSellerOffer = customEvent.detail?.isSellerOffer;
      
      if (!isSellerOffer) return; // Only listen for Sell Offers

      // Force refresh page 1
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchProductOffers(1).then(() => {
          if (newPostId) {
            setTimeout(() => {
              const targetCard = document.getElementById(`card-${newPostId}`);
              if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                const borderColor = '#059669';
                const shadowColor = 'rgba(5, 150, 105, 0.4)';
                
                targetCard.style.border = `2px solid ${borderColor}`;
                targetCard.style.boxShadow = `0 0 15px ${shadowColor}`;
                
                setTimeout(() => {
                  targetCard.style.border = '1px solid #e2e8f0';
                  targetCard.style.boxShadow = 'none';
                }, 4000);
              }
            }, 300);
          }
        });
      }
    };
    
    window.addEventListener('refreshFeed', handleRefresh);
    return () => window.removeEventListener('refreshFeed', handleRefresh);
  }, [currentPage]);

  const fetchProductOffers = async (page: number) => {
    try {
      const from = (page - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      const { data, error, count } = await supabase
        .from('sell_offers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      setProducts(data || []);
      setTotalPages(Math.ceil((count || 0) / postsPerPage) || 1);
    } catch (err) {
      console.error("Failed to fetch product grid:", err);
    }
  };

  const changePage = (increment: number) => {
    setCurrentPage(prev => Math.max(1, Math.min(prev + increment, totalPages)));
  };

  const openProductModal = (product: ProductOffer) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // formatting time
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <section className="container mx-auto px-4 py-12" id="sell-offers-section">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Latest Sell Offers from Sellers</h2>
      </div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5" id="product-grid-container">
        {products.map((item) => (
          <div 
            key={item.id}
            id={`card-${item.id}`}
            onClick={() => openProductModal(item)}
            className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-slate-100 text-teal-600 text-[11px] font-bold px-2 py-1 rounded">
                  {item.category}
                </span>
                {item.is_gst_verified && (
                  <span className="text-emerald-600 text-[11px] font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> GST Verified
                  </span>
                )}
                <span className="text-[11px] text-slate-400">Posted {timeAgo(item.created_at)}</span>
              </div>

              <div className="w-full h-40 flex items-center justify-center mb-4 overflow-hidden rounded">
                <img src={item.image_url} alt={item.title} className="max-h-full max-w-full object-contain" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-4">{item.title}</h3>
            </div>
            
            <div className="flex justify-between border-t border-slate-100 pt-3 text-[13px]">
              <div>
                <span className="text-slate-500">Location</span><br />
                <strong className="text-slate-900">{item.location}</strong>
              </div>
              <div>
                <span className="text-slate-500">Quantity</span><br />
                <strong className="text-slate-900">{item.quantity}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8" id="pagination-controls">
          <button 
            onClick={() => changePage(-1)}
            disabled={currentPage === 1}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none py-2 px-4 rounded-md cursor-pointer font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-slate-700 font-medium">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => changePage(1)}
            disabled={currentPage === totalPages}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none py-2 px-4 rounded-md cursor-pointer font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Item Detail Modal Popup */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeProductModal}>
          <div 
            className="bg-white w-full max-w-[550px] max-h-[85vh] rounded-2xl p-6 overflow-y-auto relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors border-none cursor-pointer text-slate-500 hover:text-slate-900"
              onClick={closeProductModal}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="pt-2">
              <span className="bg-slate-100 text-teal-600 text-[11px] font-bold px-2 py-1 rounded inline-block mb-2">
                {selectedProduct.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{selectedProduct.title}</h2>
              
              <div className="text-center mb-4 bg-slate-50 rounded-lg p-2">
                <img src={selectedProduct.image_url} alt={selectedProduct.title} className="max-h-[220px] rounded-lg mx-auto" />
              </div>

              <div className="flex justify-between bg-slate-50 p-3 rounded-lg mb-4 text-sm">
                <div>
                  <span className="text-slate-500">Quantity</span><br />
                  <strong className="text-slate-900">{selectedProduct.quantity}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Dispatch City</span><br />
                  <strong className="text-slate-900">{selectedProduct.location}</strong>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Contact Information Box Based on Role */}
              {user && (user.user_metadata?.role === 'seller' || user.user_metadata?.role === 'buyer' || user.user_metadata?.role === 'supplier' || user.user_metadata?.role === 'admin') ? (
                <div className="bg-emerald-50 p-4 rounded-lg mt-5 border border-emerald-200 text-sm">
                  <h4 className="text-emerald-800 font-bold mb-2 uppercase tracking-wide">Seller Contact Info</h4>
                  <div className="space-y-1.5 text-slate-700">
                    <p><strong>Name:</strong> {selectedProduct.seller_name}</p>
                    <p><strong>Company:</strong> {selectedProduct.seller_company}</p>
                    <p><strong>Phone:</strong> <a href={`tel:${selectedProduct.seller_phone}`} className="text-blue-600 hover:underline">{selectedProduct.seller_phone}</a></p>
                    <p><strong>Email:</strong> <a href={`mailto:${selectedProduct.seller_email}`} className="text-blue-600 hover:underline">{selectedProduct.seller_email}</a></p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 p-3 rounded-lg mt-5 text-red-800 text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5">🔒</span>
                  <div>
                    <strong>Contact Info Restricted:</strong> Full contact information is visible only to logged-in users.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
