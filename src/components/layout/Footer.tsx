import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#002b24] text-slate-300 pt-16 pb-8 text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">MADE IN INDIA <br/><span className="text-sm font-normal text-slate-400">INDUSTRIAL HUB</span></h3>
            <p className="mb-4">India's premier B2B marketplace connecting verified manufacturers, suppliers, exporters, and industrial wholesale buyers across all Indian cities.</p>
            <div className="flex gap-2">
              <span className="text-green-500 font-bold">✓ 100% GST Verified Business Profiles</span>
            </div>
            <div className="flex gap-2 mt-1">
               <span className="text-green-500 font-bold">✓ TrustSEAL Supplier Quality Seal</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Popular B2B Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-yellow-400">Industrial Machinery</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Building & Construction</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Electronics & Electrical</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Chemicals & Minerals</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Textiles & Apparel</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Buyer & Supplier Hub</h4>
            <ul className="space-y-2">
              <li><Link to="/post-requirement" className="hover:text-yellow-400">Post Buy Requirement (Free RFQ)</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Seller Portal & Lead Manager</Link></li>
              <li><Link to="/admin" className="hover:text-yellow-400 text-yellow-500 font-semibold">Admin Login (Moderation)</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Verified Exporters Directory</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Pay With Escrow Buyer Protection</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Major Industrial Hubs</h4>
            <ul className="grid grid-cols-2 gap-2">
              <li><Link to="/" className="hover:text-yellow-400">Pune MIDC</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Ahmedabad GIDC</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Surat Textile Hub</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Ludhiana Machinery</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Faridabad Auto</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Coimbatore Pumps</Link></li>
              <li><Link to="/" className="hover:text-yellow-400">Jaipur Solar</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#004d40] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Made In India | Made For The World - Industrial Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-white">View Sitemap & Hubs Page</Link>
            <Link to="/admin" className="hover:text-white">Admin Login</Link>
            <Link to="/" className="hover:text-white">Terms of Use</Link>
            <Link to="/" className="hover:text-white">Privacy Policy</Link>
            <Link to="/" className="hover:text-white">Supplier Verification Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
