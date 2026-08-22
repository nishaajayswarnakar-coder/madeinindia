import React, { useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { supabase } from '../lib/supabase';

export default function PostSellOfferSection() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Industrial Machinery',
    quantity: '',
    location: '',
    price_range: '',
    image_url: '',
    description: ''
  });

  const handlePostSellOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("🔒 Please log in to post a sell offer.");
      return;
    }

    const metadata = user.user_metadata || {};
    const userRole = metadata.role;
    
    if (userRole !== 'seller' && userRole !== 'supplier' && userRole !== 'admin') {
      alert("⛔ Access Restricted: Buyers are not permitted to post Sell Offers. Please log in with a Seller account.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        quantity: formData.quantity,
        location: formData.location,
        price_range: formData.price_range || 'Contact for Price',
        description: formData.description || '',
        image_url: formData.image_url || 'https://placehold.co/400x300/e2e8f0/475569?text=Product',
        is_gst_verified: metadata.is_gst_verified || false,
        seller_id: user.id, // Must match auth.users ID
        seller_name: metadata.full_name || user.email || 'Verified Seller',
        seller_company: metadata.company_name || 'N/A',
        seller_phone: metadata.phone || 'N/A',
        seller_email: user.email || 'N/A'
      };

      // Insert into Supabase and log raw response
      const { data, error } = await supabase
        .from('sell_offers')
        .insert([payload])
        .select();

      if (error) {
        console.error('DATABASE INSERT ERROR:', error);
        alert(`Failed to save offer: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      console.log('Successfully inserted into Supabase:', data);
      alert('Sell offer published successfully!');

      const newOfferId = data[0].id;

      // Reset Form UI
      setFormData({
        title: '',
        category: 'Industrial Machinery',
        quantity: '',
        location: '',
        price_range: '',
        image_url: '',
        description: ''
      });

      // Dispatch event to trigger feed refresh and scrolling
      const refreshEvent = new CustomEvent('refreshFeed', { detail: { newPostId: newOfferId, isSellerOffer: true } });
      window.dispatchEvent(refreshEvent);

    } catch (error) {
      console.error('Error posting sell offer:', error);
      alert('Failed to publish offer. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="post-sell-offer-section" className="bg-emerald-50 py-16 mt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">Post Your Sell Offer (Sellers Only)</h2>
          <p className="text-emerald-700">Showcase your industrial products to verified wholesale buyers nationwide.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-6 md:p-8">
          <form id="sell-offer-form" onSubmit={handlePostSellOffer} className="space-y-6">
            
            <div>
              <label htmlFor="sell-title" className="block text-sm font-semibold text-slate-700 mb-2">Product Name / Title *</label>
              <input 
                type="text" 
                id="sell-title" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Stainless Steel Cartridge Heater" 
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sell-category" className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select 
                  id="sell-category" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                >
                  <option value="Industrial Machinery">Industrial Machinery</option>
                  <option value="Heating Elements">Heating Elements</option>
                  <option value="Electrical Supplies">Electrical Supplies</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label htmlFor="sell-quantity" className="block text-sm font-semibold text-slate-700 mb-2">Available Stock / Min Order Qty *</label>
                <input 
                  type="text" 
                  id="sell-quantity" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  placeholder="e.g., 100 Pieces" 
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sell-location" className="block text-sm font-semibold text-slate-700 mb-2">Dispatch Location (City, State) *</label>
                <input 
                  type="text" 
                  id="sell-location" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Ahmedabad, Gujarat" 
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="sell-price" className="block text-sm font-semibold text-slate-700 mb-2">Estimated Price Range (Optional)</label>
                <input 
                  type="text" 
                  id="sell-price" 
                  value={formData.price_range}
                  onChange={e => setFormData({...formData, price_range: e.target.value})}
                  placeholder="e.g., Rs. 1,000 - 2,500 / Piece" 
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sell-image" className="block text-sm font-semibold text-slate-700 mb-2">Product Image (Optional URL)</label>
              <input 
                type="url" 
                id="sell-image" 
                value={formData.image_url}
                onChange={e => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://..." 
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="sell-desc" className="block text-sm font-semibold text-slate-700 mb-2">Technical Specifications & Details</label>
              <textarea 
                id="sell-desc" 
                rows={4} 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Specify wattage, voltage, material grade, warranty, etc."
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                id="submit-sell-btn" 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? 'Publishing Offer...' : 'Publish Sell Offer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
