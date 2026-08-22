import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { supabase } from '../lib/supabase';
import { Building2, MapPin, Briefcase, Phone } from 'lucide-react';

export const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    city: '',
    category: '',
    phone: ''
  });

  // Basic check to see if user is actually logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth');
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("You must be logged in to setup a profile.");
      }

      const { error: insertError } = await supabase.from('companies').insert([{ 
        user_id: user.id, 
        company_name: formData.companyName, 
        city: formData.city, 
        category: formData.category
        // phone: formData.phone // commented out until column is added
      }]);

      if (insertError) {
        console.error("Profile setup insert error:", insertError);
        throw new Error(insertError.message || "Failed to create profile.");
      }

      alert("Profile created successfully!");
      navigate('/dashboard'); // Will redirect back home or to a dashboard route if it exists
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during profile setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md flex flex-col justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#004d40]">Setup Your Profile</h1>
          <p className="text-sm text-slate-500 mt-2">
            Complete your company profile to get started
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                required 
                className="pl-10"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                required 
                className="pl-10"
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">Industry Category</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 z-10" />
              <select 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="" disabled>Select Industry Category</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Services">Services</option>
                <option value="Technology">Technology</option>
                <option value="Construction">Construction</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input 
                type="tel" 
                required 
                className="pl-10"
                placeholder="Phone number"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#004d40] hover:bg-[#003d33] text-white py-6 mt-6">
            {loading ? 'Saving Profile...' : 'Complete Setup'}
          </Button>
        </form>
      </div>
    </div>
  );
};
