import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from 'react-icons/md';

// import { AdminContext } from '../context/contexts';
import Login from '../pages/Login';
import Logo from './Logo';
import { AdminContext } from '../contexts/contexts';
const Navbar = () => {
  const { logout, logoutError, isLoggingOut } = useContext(AdminContext);
  const logoutAdmin = async () => {
    await logout();
  };
  return (
    <div className="flex px-4 justify-between items-center sm:px-10 py-3 border-b border-gray-300 sticky top-0 left-0 z-100 bg-white">
      <div className="flex items-center gap-2 text-xs">
        <Logo />
      </div>
      <button
        disabled={isLoggingOut}
        onClick={() => logoutAdmin()}
        className={`bg-primary text-white bg-red-400 flex items-center gap-1 text-sm px-10 py-2 rounded-full ${
          isLoggingOut ? 'opacity-60' : ''
        }`}
      >
        Logout <MdOutlineLogout />
      </button>
    </div>
  );
};

export default Navbar;
