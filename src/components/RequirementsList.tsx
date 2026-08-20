import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { X, Phone, Building2, MapPin, User, Mail } from 'lucide-react';

type Requirement = {
  id: string;
  product_name: string;
  category: string;
  delivery_city: string;
  quantity: number;
  unit: string;
  created_at: string;
  user_id?: string;
  image_url?: string;
  description?: string;
  company_name?: string;
  contact_name?: string;
  mobile?: string;
  email?: string;
  address?: string;
  gst_number?: string;
};

export default function RequirementsList() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const navigate = useNavigate();

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requirements:', error.message);
      } else {
        setRequirements(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleCardClick = async (requirement: Requirement) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in or register to view seller/buyer contact details (Name, Mobile, Address).");
      navigate("/auth");
      return;
    }

    let displayReq = { ...requirement };

    if (displayReq.user_id && (!displayReq.mobile || !displayReq.company_name)) {
      const { data: profile } = await supabase
        .from('companies')
        .select('company_name, phone, city')
        .eq('user_id', requirement.user_id)
        .maybeSingle();

      if (profile) {
        displayReq.company_name = displayReq.company_name || profile.company_name || 'Registered Buyer';
        displayReq.mobile = displayReq.mobile || profile.phone || '9876543210';
        displayReq.address = displayReq.address || profile.city;
      }
    }

    setSelectedRequirement(displayReq);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004d40]"></div>
        <span className="ml-3 text-slate-600 font-medium">Loading buy requirements...</span>
      </div>
    );
  }

  if (requirements.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
        No buy requirements posted yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {requirements.map((req) => (
          <div 
            key={req.id} 
            onClick={() => handleCardClick(req)}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-[#004d40] transition-all flex flex-col cursor-pointer"
          >
            {req.image_url && (
              <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-slate-100">
                <img src={req.image_url} alt={req.product_name} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-1 bg-[#004d40]/10 text-[#004d40] text-xs font-semibold rounded-md">
                  {req.category}
                </span>
                {req.gst_number && (
                  <span className="inline-block px-2 py-1 bg-[#dcfce7] text-[#15803d] border border-[#86efac] text-[10px] font-bold rounded-md">
                    ✓ GST Verified
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{req.product_name}</h3>
            </div>
            
            <div className="mt-auto space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-t border-slate-100">
                <span className="text-slate-500">Location</span>
                <span className="font-medium text-slate-800">{req.delivery_city}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-slate-100">
                <span className="text-slate-500">Quantity</span>
                <span className="font-bold text-[#004d40]">
                  {req.quantity} {req.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedRequirement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Requirement Details</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {selectedRequirement.image_url && (
                <div className="mb-6 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                  <img 
                    src={selectedRequirement.image_url} 
                    alt={selectedRequirement.product_name} 
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <span className="inline-block px-2 py-1 bg-[#004d40]/10 text-[#004d40] text-xs font-semibold rounded-md mb-2">
                  {selectedRequirement.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900">{selectedRequirement.product_name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Quantity</p>
                  <p className="font-semibold text-slate-900">{selectedRequirement.quantity} {selectedRequirement.unit}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Delivery City</p>
                  <p className="font-semibold text-slate-900">{selectedRequirement.delivery_city}</p>
                </div>
              </div>

              {selectedRequirement.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Description</h4>
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedRequirement.description}</p>
                </div>
              )}

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Buyer Contact Info</h4>
                <div className="space-y-3">
                  {selectedRequirement.contact_name && (
                    <div className="flex items-center text-slate-700">
                      <User className="h-5 w-5 mr-3 text-slate-400" />
                      <span className="font-medium">{selectedRequirement.contact_name}</span>
                    </div>
                  )}
                  <div className="flex items-center text-slate-700">
                    <Building2 className="h-5 w-5 mr-3 text-slate-400" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600">
                        {selectedRequirement.company_name || 'Individual Buyer'}
                      </span>
                      {selectedRequirement.gst_number && (
                        <span className="bg-[#dcfce7] text-[#15803d] border border-[#86efac] px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                          ✓ GST Verified
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedRequirement.gst_number && (
                    <div className="text-[13px] text-slate-600 ml-8 mb-2">
                      <strong>GSTIN:</strong> {selectedRequirement.gst_number}
                    </div>
                  )}
                  <div className="flex items-center text-slate-700">
                    <Phone className="h-5 w-5 mr-3 text-slate-400" />
                    {selectedRequirement.mobile ? (
                      <a href={`tel:${selectedRequirement.mobile}`} className="text-green-600 font-bold hover:underline">
                        {selectedRequirement.mobile}
                      </a>
                    ) : (
                      <span className="text-slate-400">Mobile not provided</span>
                    )}
                  </div>
                  {selectedRequirement.email && (
                    <div className="flex items-center text-slate-700">
                      <Mail className="h-5 w-5 mr-3 text-slate-400" />
                      <a href={`mailto:${selectedRequirement.email}`} className="text-blue-600 hover:underline">
                        {selectedRequirement.email}
                      </a>
                    </div>
                  )}
                  {selectedRequirement.address && (
                    <div className="flex items-center text-slate-700">
                      <MapPin className="h-5 w-5 mr-3 text-slate-400" />
                      <span className="text-slate-600">{selectedRequirement.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
