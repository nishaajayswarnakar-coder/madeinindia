import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImageToCloudinary } from '../lib/cloudinary';
import { Button } from './ui/button';
import { Input } from './ui/input';

// ---------------------------------------------------------------------------
// 1. Authentication Component
// ---------------------------------------------------------------------------
export function SupabaseAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert("Auth Error: " + authError.message);
      setMessage(`Sign Up Error: ${authError.message}`);
      return;
    }

    // Ensure user object exists
    const newUser = authData?.user;
    if (!newUser) {
      alert("Account created! Please check your email to confirm before setting up your profile.");
      setMessage("Check email to confirm.");
      return;
    }

    try {
      // 2. Insert into companies table using the exact user ID returned
      const { error: profileError } = await supabase
        .from('companies')
        .insert([
          {
            user_id: newUser.id, // Explicitly pass the returned ID
            company_name: companyName,
            city: city,
          }
        ]);

      if (profileError) {
        console.error('Insert Failed:', profileError);
        alert("Profile Setup Failed: " + profileError.message + " (Code: " + profileError.code + ")");
        setMessage(`Profile Setup Failed: ${profileError.message} (Code: ${profileError.code})`);
      } else {
        alert("Account and Profile created successfully!");
        setMessage("Account and Profile created successfully!");
        
        // Reset form fields
        setEmail('');
        setPassword('');
        setCompanyName('');
        setCity('');
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Insert Failed:', err);
      alert("Profile Error: " + err.message);
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(`Sign In Error: ${error.message}`);
    else setMessage(`Signed in as ${data.user?.email}`);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(`Sign Out Error: ${error.message}`);
    else setMessage(`Signed out successfully.`);
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMessage(`Reset Error: ${error.message}`);
    else setMessage(`Password reset email sent.`);
  };

  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto my-4 space-y-4">
      <h2 className="text-xl font-bold">Supabase Authentication</h2>
      {message && <p className="text-sm font-semibold text-blue-600">{message}</p>}
      <Input type="text" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
      <Input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
      <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSignIn}>Sign In</Button>
        <Button onClick={handleSignUp} variant="outline">Sign Up</Button>
        <Button onClick={handlePasswordReset} variant="outline">Reset Password</Button>
        <Button onClick={handleSignOut} variant="ghost">Sign Out</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Company Profile Form
// ---------------------------------------------------------------------------
export function CompanyProfileForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '', gst: '', businessType: '', city: '', state: '', description: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create a company profile.");
      }

      let logoUrl = '';
      if (logoFile) {
        logoUrl = await uploadImageToCloudinary(logoFile);
      }

      const { data, error } = await supabase
        .from('companies')
        .insert([{
          user_id: user.id,
          company_name: formData.name,
          gst: formData.gst,
          business_type: formData.businessType,
          city: formData.city,
          state: formData.state,
          description: formData.description,
          logo_url: logoUrl
        }]);

      if (error) throw error;
      setMessage('Company profile saved successfully!');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg max-w-lg mx-auto my-4 space-y-4">
      <h2 className="text-xl font-bold">Create Company Profile</h2>
      {message && <p className="text-sm font-semibold text-blue-600">{message}</p>}
      <Input placeholder="Company Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      <Input placeholder="GST Number" required value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />
      <Input placeholder="Business Type (e.g. Manufacturer, Distributor)" required value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})} />
      <div className="flex gap-4">
        <Input placeholder="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
        <Input placeholder="State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
      </div>
      <textarea className="w-full p-2 border rounded-md" placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      
      <div>
        <label className="block text-sm font-medium mb-1">Company Logo</label>
        <Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// 3. B2B Post Form
// ---------------------------------------------------------------------------
export function B2BPostForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '', category: '', priceRange: '', moq: '', description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: formData.title,
          category: formData.category,
          price_range: formData.priceRange,
          min_order_quantity: formData.moq,
          description: formData.description,
          image_url: imageUrl
        }]);

      if (error) throw error;
      setMessage('Product posted successfully!');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg max-w-lg mx-auto my-4 space-y-4">
      <h2 className="text-xl font-bold">Post a B2B Product</h2>
      {message && <p className="text-sm font-semibold text-blue-600">{message}</p>}
      <Input placeholder="Product Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      <Input placeholder="Category" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
      <div className="flex gap-4">
        <Input placeholder="Price Range (e.g. ₹100 - ₹500)" required value={formData.priceRange} onChange={e => setFormData({...formData, priceRange: e.target.value})} />
        <Input placeholder="Min Order Qty (MOQ)" required value={formData.moq} onChange={e => setFormData({...formData, moq: e.target.value})} />
      </div>
      <textarea className="w-full p-2 border rounded-md" placeholder="Product Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      
      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Posting...' : 'Post Product'}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// 4. Buyer-Seller Messaging Form
// ---------------------------------------------------------------------------
export function MessagingForm({ receiverId, postId }: { receiverId: string, postId: string }) {
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [status, setStatus] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      // Get the currently logged-in user from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to send a message.");
      }

      const senderId = session.user.id;

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: senderId,
          receiver_id: receiverId,
          post_id: postId,
          message_text: messageText
        }]);

      if (error) throw error;
      setStatus('Message sent successfully!');
      setMessageText('');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-6 border rounded-lg max-w-lg mx-auto my-4 space-y-4">
      <h2 className="text-xl font-bold">Send Inquiry to Seller</h2>
      {status && <p className="text-sm font-semibold text-blue-600">{status}</p>}
      <textarea 
        className="w-full p-2 border rounded-md" 
        placeholder="Hi, I am interested in this product. What is the best price for bulk orders?" 
        required 
        rows={4}
        value={messageText} 
        onChange={e => setMessageText(e.target.value)} 
      />
      <Button type="submit" disabled={loading || !messageText.trim()} className="w-full">
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
