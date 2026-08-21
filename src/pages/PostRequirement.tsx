import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthContext';
import { X, Image as ImageIcon, UploadCloud } from 'lucide-react';

export const PostRequirement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [libraryImages, setLibraryImages] = useState<any[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    quantity: '',
    unit: 'Piece',
    location: '',
    description: '',
    companyName: '',
    contactName: '',
    mobile: '',
    email: '',
    address: '',
    gstNumber: ''
  });

  const fetchLibraryImages = async () => {
    const { data, error } = await supabase
      .from('product_library_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setLibraryImages(data);
    }
  };

  useEffect(() => {
    if (isLibraryModalOpen) {
      fetchLibraryImages();
    }
  }, [isLibraryModalOpen]);

  // Handle Direct Image Upload to Supabase Storage
  const handleFileUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `requirements/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files) as File[];
    
    for (const file of files) {
      const fileName = `library/${Date.now()}-${Math.random().toString(36).substring(7)}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        
        await supabase.from('product_library_images').insert([
          { title: file.name, image_url: data.publicUrl }
        ]);
      }
    }
    alert("Bulk upload complete!");
    fetchLibraryImages(); // Refresh the library after upload
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Please log in to submit a buy requirement.");
        setIsSubmitting(false);
        return;
      }

      // First handle the direct file upload if a file was selected but not from library
      let finalImageUrl = selectedImageUrl;
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0 && !selectedImageUrl) {
         finalImageUrl = await handleFileUpload(fileInput.files[0]);
      }

      // 1. Fetch contact details from companies table if inputs are empty
      let finalCompany = formData.companyName;
      let finalMobile = formData.mobile;

      if (user && (!finalCompany || !finalMobile)) {
        const { data: profile } = await supabase
          .from('companies')
          .select('company_name, phone')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile) {
          finalCompany = finalCompany || profile.company_name;
          finalMobile = finalMobile || profile.phone;
        }
      }

      const { error } = await supabase
        .from('requirements')
        .insert([
          {
            user_id: user.id,
            product_name: formData.title || '',
            category: formData.category || 'Industrial Machinery',
            quantity: Number(formData.quantity) || 1,
            unit: formData.unit || 'Piece',
            delivery_city: formData.location || '',
            description: formData.description || null,
            company_name: finalCompany || 'Individual Buyer',
            contact_name: formData.contactName || 'Verified Buyer',
            mobile: finalMobile || null,
            email: formData.email || user.email || null,
            address: formData.address || formData.location,
            gst_number: formData.gstNumber ? formData.gstNumber.trim().toUpperCase() : null,
            image_url: finalImageUrl || null
          }
        ]);

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Supabase error:", err);
      alert("Failed to submit: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
        <h2 className="text-2xl font-bold text-[#002b24] mb-2">Requirement Posted Successfully!</h2>
        <p className="text-slate-600 mb-8">Verified suppliers will contact you shortly with the best quotes.</p>
        <Button onClick={() => navigate('/')} className="bg-[#004d40] text-white">Return to Home</Button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-[#004d40] text-white p-6">
            <h1 className="text-2xl font-bold">Post Buy Requirement</h1>
            <p className="text-green-100 mt-2 text-sm">Get multiple competitive quotes from verified Indian suppliers.</p>
          </div>
          
          <div className="p-8">
            {!user && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex justify-between items-center">
                <span>You need to be signed in to post a requirement.</span>
                <Button size="sm" onClick={() => navigate('/auth')} className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold">Sign In</Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Product / Equipment Required *</label>
              <Input 
                required 
                placeholder="e.g. 500 Tons Fe 550D TMT Steel Bars or Hydraulic Pump 10 HP" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Product Image (Optional)</label>
              <div className="flex items-center gap-4">
                {selectedImageUrl ? (
                  <div className="relative h-20 w-20 rounded-md border border-slate-200 overflow-hidden bg-slate-50">
                    <img src={selectedImageUrl} alt="Selected" className="h-full w-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setSelectedImageUrl('')}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <Input 
                    id="image-upload"
                    type="file" 
                    accept="image/*"
                    className="flex-1 cursor-pointer"
                    onChange={(e) => {
                      // Clear library selection if they manually pick a file
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedImageUrl('');
                      }
                    }}
                  />
                )}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsLibraryModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Select from Library
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Category *</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Industrial Machinery">Industrial Machinery</option>
                  <option value="Building & Construction">Building & Construction</option>
                  <option value="Electronics & Electrical">Electronics & Electrical</option>
                  <option value="Chemicals & Minerals">Chemicals & Minerals</option>
                  <option value="Packaging">Packaging</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Delivery City *</label>
                <Input 
                  required 
                  placeholder="e.g. Pune, Mumbai" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-2 text-slate-700">Quantity *</label>
                <Input 
                  type="number" 
                  required 
                  min="1" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-2 text-slate-700">Unit</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="Piece">Piece</option>
                  <option value="Set">Set</option>
                  <option value="Kg">Kg</option>
                  <option value="Tons">Tons</option>
                  <option value="Liters">Liters</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Detailed Description</label>
              <textarea 
                rows={4} 
                className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950"
                placeholder="Describe specifications, size, material, usage..." 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            <div className="border-t border-slate-200 pt-6 mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Contact & Business Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Your / Contact Name</label>
                  <Input type="text" value={formData.contactName} onChange={(e) => setFormData({...formData, contactName: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Company Name</label>
                  <Input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Mobile Number</label>
                  <Input type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Email Address</label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Address / Location</label>
                  <Input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">GST Number (Optional - For GST Verified Badge)</label>
                  <Input type="text" placeholder="e.g. 27AAAAA0000A1Z5" value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})} />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" disabled={!user || isSubmitting} className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-6 text-lg">
                {isSubmitting ? 'Posting...' : 'Submit Requirement'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>

    {isLibraryModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-slate-500" />
              Image Library
            </h2>
            <button 
              onClick={() => setIsLibraryModalOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="text-sm text-slate-600">Select an image from the library or upload in bulk.</div>
            <div className="relative">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleBulkUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Admin Bulk Upload"
              />
              <Button type="button" variant="outline" size="sm" className="pointer-events-none flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Admin Bulk Upload
              </Button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {libraryImages.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                No images in the library yet. Use the bulk upload to add some.
              </div>
            ) : (
              libraryImages.map((img) => (
                <div 
                  key={img.id}
                  onClick={() => {
                    setSelectedImageUrl(img.image_url);
                    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                    setIsLibraryModalOpen(false);
                  }}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageUrl === img.image_url ? 'border-[#004d40] shadow-md scale-[1.02]' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="aspect-square bg-slate-100">
                    <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-xs text-slate-600 truncate bg-white">
                    {img.title}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )}
  </>
  );
};
