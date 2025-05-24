import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    { name: "Jobs", path: "/jobs" },
    { name: "CV", path: "/cv" },
    {
      name: "Pengalaman",
      path: "/pengalaman",
    },
    {
      name: "Pendidikan",
      path: "/pendidikan",
    },
    { name: "Keahlian", path: "/skills" },
  ];

  return (
    <header className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0 flex items-center'>
            <Link to='/dashboard' className='flex items-center'>
              <span className='text-xl font-bold text-gray-900'>
                LookForJob
              </span>
            </Link>
          </div>

          {/* Center navigation */}
          <div className='hidden md:flex flex-1 justify-center'>
            <nav className='flex space-x-8'>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className='inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-primary-500 transition-all duration-150'
                >
                  <span className='ml-1'>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Profile dropdown */}
          <div className='hidden md:flex md:items-center'>
            <div className='ml-3 relative'>
              <div>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className='flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                >
                  {user?.foto_url ? (
                    <img
                      className='h-8 w-8 rounded-full object-cover'
                      src={user.foto_url}
                      alt={user.nama}
                    />
                  ) : (
                    <div className='h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white'>
                      {user?.nama?.charAt(0).toUpperCase() || (
                        <User className='h-5 w-5' />
                      )}
                    </div>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10'
                  >
                    <div className='px-4 py-2 border-b'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {user?.nama}
                      </p>
                      <p className='text-xs text-gray-500 truncate'>
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to='/profile'
                      onClick={() => setProfileDropdownOpen(false)}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                    >
                      <div className='flex items-center'>
                        <User className='mr-2 h-4 w-4' />
                        Profil Saya
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                    >
                      <div className='flex items-center'>
                        <LogOut className='mr-2 h-4 w-4' />
                        Logout
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='flex items-center md:hidden'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
            >
              {mobileMenuOpen ? (
                <X className='block h-6 w-6' />
              ) : (
                <Menu className='block h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='md:hidden'
          >
            <div className='pt-2 pb-3 space-y-1'>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className='flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                >
                  <span className='ml-2'>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile profile section */}
            <div className='pt-4 pb-3 border-t border-gray-200'>
              <div className='flex items-center px-4'>
                {user?.foto_url ? (
                  <img
                    className='h-10 w-10 rounded-full object-cover'
                    src={user.foto_url}
                    alt={user.nama}
                  />
                ) : (
                  <div className='h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white'>
                    {user?.nama?.charAt(0).toUpperCase() || (
                      <User className='h-6 w-6' />
                    )}
                  </div>
                )}
                <div className='ml-3'>
                  <div className='text-base font-medium text-gray-800'>
                    {user?.nama}
                  </div>
                  <div className='text-sm font-medium text-gray-500'>
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className='mt-3 space-y-1'>
                <Link
                  to='/profile'
                  onClick={() => setMobileMenuOpen(false)}
                  className='flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                >
                  <User className='mr-2 h-5 w-5' />
                  Profil Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className='flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                >
                  <LogOut className='mr-2 h-5 w-5' />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
