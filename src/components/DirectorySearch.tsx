import React, { useState } from 'react';

export default function DirectorySearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-xl my-6">
      <input
        type="text"
        placeholder="Search by company name or product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d40]"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-[#004d40] text-white font-medium rounded-lg hover:bg-[#003d33] transition"
      >
        Search
      </button>
    </form>
  );
}
