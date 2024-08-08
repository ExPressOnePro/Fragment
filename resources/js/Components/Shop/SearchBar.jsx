// SearchBar.jsx
import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex justify-center">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="border rounded-l-lg px-4 py-2 w-1/2"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
            >
                Search
            </button>
        </form>
    );
}
