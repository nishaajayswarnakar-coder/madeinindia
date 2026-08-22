import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export const AdminPanel = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedAdminStatus = localStorage.getItem('isAdminLoggedIn');
    if (savedAdminStatus === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsAdminLoggedIn(false);
  };

  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');

  const handleCreateDemoUsers = async () => {
    setAdminActionLoading(true);
    setAdminMessage('');
    try {
      const response = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_DEMO_USERS' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to create demo users');
      setAdminMessage(`Success: ${data.message} ${JSON.stringify(data.credentials)}`);
    } catch (err: any) {
      setAdminMessage(`Error: ${err.message}`);
    } finally {
      setAdminActionLoading(false);
    }
  };

  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminUserIdToChange, setAdminUserIdToChange] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionLoading(true);
    setAdminMessage('');
    try {
      const response = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHANGE_PASSWORD', adminUserId: adminUserIdToChange, newPassword: newAdminPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to update password');
      setAdminMessage(`Success: ${data.message}`);
      setNewAdminPassword('');
    } catch (err: any) {
      setAdminMessage(`Error: ${err.message}`);
    } finally {
      setAdminActionLoading(false);
    }
  };

  // Form states for posting requirements
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Industrial Machinery');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Piece');
  const [description, setDescription] = useState('');
  const [companyName, setCompanyName] = useState('Admin Posted Requirement');
  const [contactName, setContactName] = useState('Admin');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Hardcoded Admin Authentication Check
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const enteredUser = String(username).trim();
    const enteredPass = String(password).trim();

    const EXPECTED_USER = 'Ashumeethi';
    const EXPECTED_PASS = 'Awqps0697b@';

    if (enteredUser === EXPECTED_USER && enteredPass === EXPECTED_PASS) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      setIsAdminLoggedIn(true);
      alert('Welcome Admin!');
    } else {
      setLoginError(`Login failed! Entered User: "${enteredUser}". Check for typos.`);
    }
  };

  // 2. Direct Admin Posting Handler
  const handleAdminPostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrl = null;

      // 1. Upload Product Image to Storage if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `requirements/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedImageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('requirements')
        .insert([
          {
            product_name: productName,
            category: category,
            delivery_city: deliveryCity,
            quantity: Number(quantity) || 1,
            unit: unit || 'Piece',
            description: description,
            company_name: companyName,
            contact_name: contactName,
            mobile: mobile,
            email: email,
            address: address,
            gst_number: gstNumber ? gstNumber.trim().toUpperCase() : null,
            image_url: uploadedImageUrl,
            user_id: null 
          }
        ]);

      if (insertError) throw new Error(`Database Insert Failed: ${insertError.message}`);

      alert('Requirement posted directly by Admin!');
      // Reset form
      setProductName('');
      setDescription('');
      setQuantity('');
      setMobile('');
      setEmail('');
      setGstNumber('');
      setImageFile(null);
    } catch (err: any) {
      console.error('Admin Post Error:', err);
      alert('Posting failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Login View if not authenticated
  if (!isAdminLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Admin Panel Login</h2>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm text-center">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Admin User ID</label>
              <Input 
                type="text" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
              <Input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <Button type="submit" className="w-full bg-[#004d40] hover:bg-[#00332a]">
              Login to Admin Panel
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Render Admin Post View once logged in
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-[#004d40] text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-green-100 mt-1 text-sm">Manage users and posts</p>
          </div>
          <Button variant="outline" className="text-slate-900 bg-white hover:bg-slate-100" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="p-8 border-b border-slate-200">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Admin Tools</h3>
          {adminMessage && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm border border-blue-200 rounded-lg">
              {adminMessage}
            </div>
          )}
          
          <div className="mb-6">
            <h4 className="font-semibold text-slate-700 mb-2">Generate Demo Accounts</h4>
            <Button 
              onClick={handleCreateDemoUsers} 
              disabled={adminActionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {adminActionLoading ? 'Creating...' : 'Create Demo Buyer & Seller'}
            </Button>
          </div>

          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Change User Password</h4>
            <form onSubmit={handleChangePassword} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1 text-slate-500">User ID</label>
                <Input 
                  type="text" 
                  required 
                  placeholder="e.g. 1234-abcd..."
                  value={adminUserIdToChange} 
                  onChange={(e) => setAdminUserIdToChange(e.target.value)} 
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1 text-slate-500">New Password</label>
                <Input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={newAdminPassword} 
                  onChange={(e) => setNewAdminPassword(e.target.value)} 
                />
              </div>
              <Button type="submit" disabled={adminActionLoading} className="bg-orange-600 hover:bg-orange-700">
                Update
              </Button>
            </form>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Post Buy Requirement</h3>
          <form onSubmit={handleAdminPostRequirement} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Product Name *</label>
              <Input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Category *</label>
              <Input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Detailed Description</label>
              <textarea 
                rows={3} 
                className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-slate-700">Product Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImageFile(e.target.files[0]);
                  } else {
                    setImageFile(null);
                  }
                }} 
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-950" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Quantity</label>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Unit</label>
                <Input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Delivery City</label>
              <Input type="text" value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)} />
            </div>

            <div className="border-t border-slate-200 pt-6 mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Buyer Details (Displayed to Users)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Company Name</label>
                  <Input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Contact Name</label>
                  <Input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Mobile Number</label>
                  <Input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Email Address</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Address</label>
                  <Input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">GST Number (Optional - For GST Verified Badge)</label>
                  <Input type="text" placeholder="e.g. 27AAAAA0000A1Z5" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#004d40] hover:bg-[#00332a] text-lg py-6">
              {isSubmitting ? 'Posting...' : 'Post Requirement as Admin'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
