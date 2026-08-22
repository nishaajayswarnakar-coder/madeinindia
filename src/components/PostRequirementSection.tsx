import React, { useState } from 'react';

export default function PostRequirementSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Industrial Machinery',
    quantity: '',
    location: '',
    image_url: '',
    description: ''
  });

  const handlePostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock session check
      const isLoggedIn = true;
      if (!isLoggedIn) {
        alert("Please log in or register before posting a requirement.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to post requirement');
      }

      const data = await response.json();
      const newPostId = data.item._id;

      // Trigger WhatsApp Alerts
      await fetch('/api/notify-requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          quantity: formData.quantity,
          location: formData.location,
          buyerPhone: '9876543210', // Mock data fallback
          buyerName: 'Verified Buyer', // Mock data fallback
          sellerPhones: ['9999999999', '8888888888'] // Mock array of sellers
        })
      }).catch(err => console.error('WhatsApp alert dispatch failed:', err));

      // Reset Form UI
      setFormData({
        title: '',
        category: 'Industrial Machinery',
        quantity: '',
        location: '',
        image_url: '',
        description: ''
      });

      // Dispatch event to trigger feed refresh and scrolling
      const refreshEvent = new CustomEvent('refreshFeed', { detail: { newPostId } });
      window.dispatchEvent(refreshEvent);

    } catch (error) {
      console.error('Error posting requirement:', error);
      alert('Failed to post requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="post-requirement-section" className="bg-slate-50 py-16 mt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Post Your Buy Requirement</h2>
          <p className="text-slate-600">Connect with thousands of verified sellers instantly.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <form id="requirement-form" onSubmit={handlePostRequirement} className="space-y-6">
            
            <div>
              <label htmlFor="req-title" className="block text-sm font-semibold text-slate-700 mb-2">Product / Requirement Title *</label>
              <input 
                type="text" 
                id="req-title" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Ceramic Band Heater" 
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="req-category" className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select 
                  id="req-category" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="Industrial Machinery">Industrial Machinery</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Heating Elements">Heating Elements</option>
                  <option value="Electrical Supplies">Electrical Supplies</option>
                </select>
              </div>

              <div>
                <label htmlFor="req-quantity" className="block text-sm font-semibold text-slate-700 mb-2">Quantity Required *</label>
                <input 
                  type="text" 
                  id="req-quantity" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  placeholder="e.g., 500 Pieces" 
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="req-location" className="block text-sm font-semibold text-slate-700 mb-2">Delivery Location (City, State) *</label>
                <input 
                  type="text" 
                  id="req-location" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Pune, Maharashtra" 
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="req-image" className="block text-sm font-semibold text-slate-700 mb-2">Product Image (Optional URL)</label>
                <input 
                  type="url" 
                  id="req-image" 
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://..." 
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="req-desc" className="block text-sm font-semibold text-slate-700 mb-2">Detailed Specifications</label>
              <textarea 
                id="req-desc" 
                rows={4} 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Specify voltage, material, dimensions, etc."
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                id="submit-req-btn" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? 'Posting Requirement...' : 'Post Requirement Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
