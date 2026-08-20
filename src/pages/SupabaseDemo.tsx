import React from 'react';
import { 
  SupabaseAuth, 
  CompanyProfileForm, 
  B2BPostForm, 
  MessagingForm 
} from '../components/SupabaseComponents';

export const SupabaseDemo = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#004d40]">Supabase & Cloudinary Integration</h1>
        <p className="text-slate-500 mt-2">
          Make sure to set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_CLOUDINARY_CLOUD_NAME, and VITE_CLOUDINARY_UPLOAD_PRESET in your environment variables.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <SupabaseAuth />
        <CompanyProfileForm />
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <B2BPostForm />
        <MessagingForm receiverId="example-seller-uuid" postId="example-post-uuid" />
      </div>
    </div>
  );
};
