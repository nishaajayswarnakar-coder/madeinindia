import React, { useState } from 'react';
import { tendersData } from '../data/tenders';

export default function GovtProcurementSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(tendersData.length / itemsPerPage) || 1;

  const currentTenders = tendersData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changeGovtPage = (increment: number) => {
    setCurrentPage(prev => Math.max(1, Math.min(prev + increment, totalPages)));
  };

  return (
    <section id="govt-procurement-section" className="bg-slate-50 py-12 border-t border-slate-200">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <span className="bg-blue-900 text-white text-[11px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              Official Tenders
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Government Procurement (India) | CPPP & GeM Feed
            </h2>
          </div>
          <a 
            href="https://gem.gov.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 font-semibold text-sm hover:underline shrink-0"
          >
            Visit GeM Portal &rarr;
          </a>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="govt-grid-container">
          {currentTenders.map((tender) => (
            <div key={tender.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded ${
                    tender.source === 'CPPP' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {tender.source === 'CPPP' ? 'CPPP (GOVT OF INDIA)' : 'GeM PORTAL'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                    Val: {tender.value}
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-3">
                  {tender.title}
                </h3>
                <p className="text-sm text-slate-600 mb-1">
                  <strong>Location:</strong> {tender.location}
                </p>
              </div>
              <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100 text-sm">
                <span className="text-red-600 font-semibold text-xs">Closing: {tender.closingDate}</span>
                <button className="text-emerald-700 font-bold hover:underline text-xs bg-emerald-50 px-3 py-1.5 rounded">
                  View Tender ↗
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8" id="govt-pagination-controls">
            <button 
              id="govt-prev-btn"
              onClick={() => changeGovtPage(-1)}
              disabled={currentPage === 1}
              className="bg-blue-600 hover:bg-blue-700 text-white border-none py-2 px-4 rounded-md cursor-pointer font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span id="govt-page-indicator" className="text-slate-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              id="govt-next-btn"
              onClick={() => changeGovtPage(1)}
              disabled={currentPage === totalPages}
              className="bg-blue-600 hover:bg-blue-700 text-white border-none py-2 px-4 rounded-md cursor-pointer font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
