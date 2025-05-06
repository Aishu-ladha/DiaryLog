import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleClearSearch = () => setSearchQuery('');

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-[#1e1e2f] px-4 py-3 shadow-md relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-[#DCCBFF] text-xl font-bold">DailyLog</Link>

        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-[#DCCBFF] focus:outline-none">
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          {isLoggedIn && (
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSubmit={handleSearch}
              onClear={handleClearSearch}
            />
            )} 

           {isLoggedIn ? ( 
            <>
              <Link to="/dashboard" className="text-[#A2A2BC] hover:text-[#DCCBFF]">Dashboard</Link>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm">
                Logout
              </button>
            </>
           ) : ( 
             <>
              <Link to="/login" className="text-[#A2A2BC] hover:text-[#DCCBFF]">Login</Link>
              <Link to="/signup" className="text-[#A2A2BC] hover:text-[#DCCBFF]">Signup</Link>
            </>
          )} 
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-4 px-2">
           {isLoggedIn && ( 
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSubmit={handleSearch}
              onClear={handleClearSearch}
            />
          )} 

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={toggleMenu} className="text-[#A2A2BC] hover:text-[#DCCBFF]">Dashboard</Link>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm">
                Logout
              </button>
            </>
          ) : ( 
            <>
              <Link to="/login" onClick={toggleMenu} className="text-[#A2A2BC] hover:text-[#DCCBFF]">Login</Link>
              <Link to="/signup" onClick={toggleMenu} className="text-[#A2A2BC] hover:text-[#DCCBFF]">Signup</Link>
            </>
          )} 
        </div>
      )}
    </nav>
  );
};

export default Navbar;
