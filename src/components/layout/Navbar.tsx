import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Menu, User, FileText, Settings, LogIn, ChevronDown, CheckCircle2, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../auth/AuthContext';

export const Navbar = () => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200">
      {/* Top Utility Bar */}
      <div className="bg-[#f8f9fa] border-b border-slate-200 text-xs py-1 px-4 hidden md:flex justify-between items-center text-slate-600">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><span className="text-green-600 font-bold">★</span> India's Leading B2B Marketplace for Wholesale & Industrial Products | GST Verified Suppliers</span>
        </div>
        <div className="flex gap-4 items-center font-medium">
          <Link to="/" className="flex items-center gap-1 hover:text-green-700">
             Live Sourcing RFQs / Buy Leads
          </Link>
          <Link to="/" className="flex items-center gap-1 hover:text-green-700">
             Govt & PSU Tenders
          </Link>
          <Link to="/" className="hover:text-green-700 text-red-600 font-bold">Buyer Demo</Link>
          <Link to="/" className="hover:text-green-700 text-blue-600 font-bold">Seller Demo</Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 lg:gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-xl">
            M
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block text-[#004d40]">
            MADE IN INDIA <br/>
            <span className="text-xs text-slate-500 font-normal">INDUSTRIAL HUB</span>
          </span>
        </Link>

        <div className="flex-1 max-w-3xl hidden md:flex items-center relative">
          <div className="flex items-center border-2 border-yellow-400 rounded-md bg-white w-full overflow-hidden h-11">
             <div className="flex items-center px-3 bg-slate-50 border-r border-slate-200 text-sm font-medium text-slate-600 gap-1 h-full cursor-pointer hover:bg-slate-100 min-w-[120px]">
               <span className="truncate">All India</span> <ChevronDown className="w-4 h-4 ml-auto" />
             </div>
             <Input 
               className="border-0 focus-visible:ring-0 h-full rounded-none shadow-none" 
               placeholder="Search products or company name (e.g. CNC Machine, Precision Tools)" 
             />
             <Button onClick={() => navigate('/')} className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-none h-full px-6 font-semibold">
               Search
             </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/post-requirement')} variant="outline" className="hidden lg:flex border-yellow-400 text-slate-800 bg-yellow-50 font-semibold gap-2 border-2 hover:bg-yellow-100">
            <FileText className="w-4 h-4 text-green-700" />
            + Post RFQ / Screenshot
          </Button>
          
          <Button variant="outline" className="hidden md:flex gap-2" onClick={() => navigate('/dashboard')}>
            <Settings className="w-4 h-4" />
            Seller Dashboard
          </Button>
          
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-700 mx-2">
                 {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full" /> : <User className="w-5 h-5" />}
                 <span className="truncate max-w-[100px]">{user.displayName || 'User'}</span>
              </div>
              <Button onClick={signOut} variant="ghost" className="font-semibold text-slate-500 hover:text-red-600">
                 Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/auth')} variant="ghost" className="font-semibold text-[#004d40]">
                 Sign In
              </Button>
              <Button onClick={() => navigate('/auth')} className="bg-[#004d40] text-white hover:bg-[#003d33]">
                 Join Free
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Category Strip */}
      <div className="bg-[#004d40] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm font-medium overflow-x-auto no-scrollbar">
            <Link to="/" className="flex items-center gap-2 py-3 px-4 hover:bg-[#003d33] whitespace-nowrap bg-[#003d33]">
              <Menu className="w-4 h-4" /> All Categories
            </Link>
            <Link to="/" className="py-3 px-4 hover:bg-[#003d33] whitespace-nowrap">Industrial Machinery</Link>
            <Link to="/" className="py-3 px-4 hover:bg-[#003d33] whitespace-nowrap">Building & Construction</Link>
            <Link to="/" className="py-3 px-4 hover:bg-[#003d33] whitespace-nowrap">Electronics & Electrical</Link>
            <Link to="/" className="py-3 px-4 hover:bg-[#003d33] whitespace-nowrap">Chemicals & Minerals</Link>
            <Link to="/" className="py-3 px-4 hover:bg-[#003d33] whitespace-nowrap">Textiles & Apparel</Link>
            <Link to="/" className="py-3 px-4 hover:bg-[#003d33] whitespace-nowrap">Medical & Healthcare</Link>
          </div>
        </div>
      </div>
    </header>
  );
};
