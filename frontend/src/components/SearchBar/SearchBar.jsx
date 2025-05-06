import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ value, onChange, onSubmit, onClear }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center bg-[#2a2a3e] rounded-md overflow-hidden w-full sm:w-64"
    >
      <input
        type="text"
        placeholder="Search entries..."
        value={value}
        onChange={onChange}
        className="px-3 py-2 bg-transparent text-white focus:outline-none w-full"
      />
      
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="text-[#DCCBFF] hover:text-red-400 px-2 transition"
        >
          <FaTimes size={14} />
        </button>
      )}

      <button type="submit" className="px-3 text-[#DCCBFF] hover:text-[#bba7ff] transition">
        <FaSearch size={16} />
      </button>
    </form>
  );
};

export default SearchBar;
