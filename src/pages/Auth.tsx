import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../components/auth/AuthContext';
import { LogIn, UserPlus, Mail, Lock, KeyRound, User, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const { signInWithGoogle, signUpWithEmail, loginWithEmail, resetPassword, sendMobileOTP, verifyMobileOTP } = useAuth();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    otp: '',
    fullName: '',
    companyName: ''
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(formData.email, formData.password);
        navigate('/');
      } else if (mode === 'register') {
        if (!formData.role) {
          throw new Error("Role is required.");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        
        const { data, error: signUpError } = await signUpWithEmail(formData.email, formData.password);
        if (signUpError) throw signUpError;
        if (!data?.user) throw new Error("Account creation failed, no user returned.");
        
        setMessage('Account created successfully! Redirecting to profile setup...');
        setTimeout(() => navigate('/setup-profile'), 1500);
        return; 
      } else if (mode === 'forgot') {
        await resetPassword(formData.email);
        setMessage('Password reset email sent. Check your inbox.');
        setMode('login');
      } else if (mode === 'otp') {
        if (!otpSent) {
          if (!formData.role) {
            throw new Error("Role is required.");
          }
          if (!formData.fullName) {
            throw new Error("Full name is required.");
          }
          const sent = await sendMobileOTP(formData.phone);
          if (sent) {
            setOtpSent(true);
            setMessage('OTP sent successfully. Please check your messages.');
          }
        } else {
          await verifyMobileOTP(formData.phone, formData.otp, {
            role: formData.role,
            fullName: formData.fullName,
            companyName: formData.companyName
          });
          navigate('/');
        }
      }
    } catch (err: any) {
      let errorMessage = err.message || 'Authentication failed';
      if (err.message?.includes('User not found') || err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password.';
      }
      if (err.message?.includes('already registered')) {
        errorMessage = 'Email already in use.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md flex flex-col justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#004d40]">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : mode === 'otp' ? 'Mobile Verification' : 'Reset Password'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {mode === 'login' ? 'Sign in to access your dashboard' : mode === 'register' ? 'Join the B2B Industrial Hub' : mode === 'otp' ? 'Sign in or register with your mobile number' : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm border border-green-200 rounded-lg text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'otp' ? (
            <>
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-700">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <Input 
                        type="tel" 
                        required 
                        className="pl-10"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <Input 
                        type="text" 
                        required 
                        className="pl-10"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-700">Company Name (Optional)</label>
                    <Input 
                      type="text" 
                      placeholder="Acme Corp"
                      value={formData.companyName}
                      onChange={e => setFormData({...formData, companyName: e.target.value})}
                    />
                  </div>
                  <div className="pt-2 pb-2">
                    <label className="block text-sm font-semibold mb-2 text-slate-700">I am a:</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 flex-1">
                        <input 
                          type="radio" 
                          name="role" 
                          value="buyer" 
                          checked={formData.role === 'buyer'}
                          onChange={e => setFormData({...formData, role: e.target.value})}
                          className="w-4 h-4 text-[#004d40] focus:ring-[#004d40]"
                        />
                        <span className="text-sm font-medium">Buyer</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 flex-1">
                        <input 
                          type="radio" 
                          name="role" 
                          value="supplier" 
                          checked={formData.role === 'supplier'}
                          onChange={e => setFormData({...formData, role: e.target.value})}
                          className="w-4 h-4 text-[#004d40] focus:ring-[#004d40]"
                        />
                        <span className="text-sm font-medium">Supplier / Manufacturer</span>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Enter OTP</label>
                  <Input 
                    type="text" 
                    required 
                    placeholder="6-digit code"
                    value={formData.otp}
                    onChange={e => setFormData({...formData, otp: e.target.value})}
                    className="text-center tracking-widest text-lg"
                    maxLength={6}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <Input 
                    type="email" 
                    required 
                    className="pl-10"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-slate-700">Password</label>
                    {mode === 'login' && (
                      <button type="button" onClick={() => setMode('forgot')} className="text-xs text-[#004d40] hover:underline font-semibold">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input 
                      type="password" 
                      required 
                      className="pl-10"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input 
                      type="password" 
                      required 
                      className="pl-10"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div className="pt-2 pb-2">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">I am a:</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 flex-1">
                      <input 
                        type="radio" 
                        name="role" 
                        value="buyer" 
                        checked={formData.role === 'buyer'}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-4 h-4 text-[#004d40] focus:ring-[#004d40]"
                      />
                      <span className="text-sm font-medium">Buyer</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 flex-1">
                      <input 
                        type="radio" 
                        name="role" 
                        value="supplier" 
                        checked={formData.role === 'supplier'}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-4 h-4 text-[#004d40] focus:ring-[#004d40]"
                      />
                      <span className="text-sm font-medium">Supplier / Manufacturer</span>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-[#004d40] hover:bg-[#003d33] text-white py-6 mt-6">
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : mode === 'otp' ? (otpSent ? 'Verify OTP' : 'Request OTP') : 'Send Reset Link'
            )}
          </Button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {mode !== 'otp' && (
                <Button type="button" variant="outline" onClick={() => setMode('otp')} disabled={loading} className="w-full py-6 font-semibold border-slate-300">
                  <Phone className="w-5 h-5 mr-2 text-slate-600" />
                  Mobile Number (OTP)
                </Button>
              )}
              {mode === 'otp' && (
                <Button type="button" variant="outline" onClick={() => setMode('login')} disabled={loading} className="w-full py-6 font-semibold border-slate-300">
                  <Mail className="w-5 h-5 mr-2 text-slate-600" />
                  Email & Password
                </Button>
              )}
              <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={loading} className="w-full py-6 font-semibold border-slate-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Google
              </Button>
            </div>
          </>
        )}

        <div className="mt-8 text-center text-sm font-medium text-slate-600">
          {mode === 'login' ? (
            <p>New to Industrial Hub? <button onClick={() => setMode('register')} className="text-[#004d40] font-bold hover:underline">Join Free</button></p>
          ) : mode === 'register' ? (
            <p>Already have an account? <button onClick={() => setMode('login')} className="text-[#004d40] font-bold hover:underline">Sign In</button></p>
          ) : mode === 'otp' ? (
            <p>Prefer email? <button onClick={() => setMode('register')} className="text-[#004d40] font-bold hover:underline">Sign up with Email</button></p>
          ) : (
            <p>Remember your password? <button onClick={() => setMode('login')} className="text-[#004d40] font-bold hover:underline">Sign In</button></p>
          )}
        </div>
      </div>
    </div>
  );
};
