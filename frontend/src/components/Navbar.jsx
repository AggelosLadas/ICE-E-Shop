import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-xl shadow-lg shadow-primary/20 ring-2 ring-white/50 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/25 transition-all duration-300">
              <span className="text-2xl sm:text-3xl drop-shadow-sm" aria-hidden="true">🧊</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">ICE-E-Shop</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full text-gray-700 hover:text-primary hover:bg-primary/10 font-semibold transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-full text-gray-700 hover:text-primary hover:bg-primary/10 font-semibold transition-all duration-300"
            >
              Shoes Collection
            </Link>
            {user?.role === 'ADMIN' && (
              <>
                <Link
                  to="/add-product"
                  className="px-5 py-2.5 rounded-full text-amber-700 hover:text-amber-800 hover:bg-amber-100 font-semibold transition-all duration-300"
                >
                  Προσθήκη Προϊόντος
                </Link>
                <Link
                  to="/orders"
                  className="px-5 py-2.5 rounded-full text-amber-700 hover:text-amber-800 hover:bg-amber-100 font-semibold transition-all duration-300"
                >
                  Παραγγελίες
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-md animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                {user.role !== 'ADMIN' && (
                  <Link
                    to="/orders"
                    className="px-4 py-2 rounded-full text-gray-700 hover:text-primary hover:bg-primary/10 font-semibold transition-all duration-300"
                  >
                    Παραγγελίες
                  </Link>
                )}
                <div className={`flex items-center gap-2 rounded-full pl-1 pr-4 py-1.5 shadow-sm border ${user.role === 'ADMIN' ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200/60' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/60'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner ${user.role === 'ADMIN' ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-primary to-secondary'}`}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-800 font-semibold hidden lg:block">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-semibold py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200/80 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200/80 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold py-2.5 px-5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:opacity-95 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>


        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 space-y-1 border-t border-gray-200/80">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 rounded-xl text-gray-800 hover:text-primary hover:bg-primary/10 font-semibold transition-all"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 rounded-xl text-gray-800 hover:text-primary hover:bg-primary/10 font-semibold transition-all"
            >
              Shoes Collection
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-200/80 space-y-2">
              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <>
                      <Link
                        to="/add-product"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 px-4 rounded-xl text-amber-800 hover:bg-amber-100 font-semibold transition-all"
                      >
                        Προσθήκη Προϊόντος
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 px-4 rounded-xl text-amber-800 hover:bg-amber-100 font-semibold transition-all"
                      >
                        Παραγγελίες
                      </Link>
                    </>
                  )}
                  {user.role !== 'ADMIN' && (
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-xl text-gray-800 hover:text-primary hover:bg-primary/10 font-semibold transition-all"
                    >
                      Παραγγελίες
                    </Link>
                  )}
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${user.role === 'ADMIN' ? 'bg-amber-50' : 'bg-gray-50'}`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-inner">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-800 font-semibold">{user.username}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold border border-gray-200/80 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold border border-gray-200/80 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/20 transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

