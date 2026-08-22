import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<{ data: any, error: any }>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendMobileOTP: (phone: string) => Promise<boolean>;
  verifyMobileOTP: (phone: string, token: string, userMetadata?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => { throw new Error('Not implemented'); },
  loginWithEmail: async () => {},
  resetPassword: async () => {},
  signOut: async () => {},
  sendMobileOTP: async () => false,
  verifyMobileOTP: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signUp({ email, password });
      return response;
    } catch (error) {
      console.error('Error signing up with email/password', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with email/password', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error sending password reset email', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  const sendMobileOTP = async (phoneNumber: string) => {
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone
    });

    if (error) {
      alert(`Failed to send OTP: ${error.message}`);
      return false;
    }
    
    return true;
  };

  const verifyMobileOTP = async (phoneNumber: string, otpCode: string, userMetadata: any = {}) => {
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

    const { data: { session }, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otpCode,
      type: 'sms'
    });

    if (error) {
      throw new Error(`Invalid OTP: ${error.message}`);
    }

    if (userMetadata.role && session?.user) {
      await supabase.auth.updateUser({
        data: {
          full_name: userMetadata.fullName,
          role: userMetadata.role,
          company_name: userMetadata.companyName || '',
          phone: formattedPhone
        }
      });

      // Trigger admin email notification
      fetch('/api/notify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: userMetadata.fullName,
          email: session.user.email || 'N/A (Mobile Auth)',
          phone: formattedPhone,
          role: userMetadata.role,
          companyName: userMetadata.companyName
        })
      }).catch(err => console.error('Admin notification trigger failed:', err));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signUpWithEmail, 
      loginWithEmail, 
      resetPassword, 
      signOut,
      sendMobileOTP,
      verifyMobileOTP
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
