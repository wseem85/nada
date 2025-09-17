import React, { useContext, useEffect, useState } from 'react';
import Logo from './Logo';
import { NavLink, useNavigate } from 'react-router-dom';
import { SlArrowDown } from 'react-icons/sl';
import { assets } from '../assets/assets';
import { MdMenuOpen } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../contexts/contexts';
import { toast } from 'react-toastify';
const Navbar = () => {
  const { user, logout, isLoadingUser } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  useEffect(() => {
    setShowUserMenu(false);
  }, [user]);
  // setShowMenu(false);
  return (
    <header className="-mx-2  xs:-mx-8  sm:-mx-[3%] bg-white  ">
      <nav className="flex mx-2 xs:mx-8 sm:mx-[3%] items-center justify-between py-4 text-sm mb-5  min-h-[70px]">
        <Logo />
        <ul className="hidden md:flex items-start gap-5 font-medium">
          <li className="py-1.5 px-2 ">
            <NavLink
              className="navbar-link flex flex-col items-center justify-center gap-1"
              to="/"
            >
              HOME
              <hr className="border-none outline-none bg-beige-dark h-0.5 w-2/3 m-auto hidden" />
            </NavLink>
          </li>
          <li className="py-1.5 px-2 ">
            <NavLink
              className="navbar-link flex flex-col items-center justify-center gap-1"
              to="gallery"
            >
              GALLERY
              <hr className="border-none outline-none bg-beige-dark h-0.5 w-2/3 m-auto hidden" />
            </NavLink>
          </li>
          <li className="py-1.5 px-2 ">
            <NavLink
              className="navbar-link flex flex-col items-center justify-center gap-1"
              to="contact"
            >
              CONTACT
              <hr className="border-none outline-none bg-beige-dark h-0.5 w-2/3 m-auto hidden" />
            </NavLink>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          {/* Desktop User Menu or Login Button */}
          {isLoadingUser ? (
            <div className=" gap-2 hidden md:flex">
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-gray-200 to-gray-100 animate-pulse "></div>
            </div>
          ) : !isLoadingUser && user ? (
            <div
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.stopPropagation();
                  setShowUserMenu(true);
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.stopPropagation();
                  setShowUserMenu(false);
                }
              }}
              onClick={(e) => {
                if (window.innerWidth < 768) {
                  e.stopPropagation();
                  setShowUserMenu((prev) => !prev);
                }
              }}
              className="flex gap-2 cursor-pointer items-center group relative hidden md:flex"
            >
              <img
                className="w-6 h-6 rounded-full border border-beige-dark"
                src={
                  user.photo !== ''
                    ? user.photo
                    : '../../src/assets/profile_default_pic.png'
                }
                alt=""
              />
              <div className="flex justify-center items-center p-1.5 rounded-full bg-gray-100 hover:bg-gray-50">
                <SlArrowDown className="text-beige-dark w-2.5 h-2.5" />
              </div>
              {showUserMenu && (
                <AnimatePresence>
                  <motion.nav
                    initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      type: 'tween',
                      ease: 'easeInOut',
                      duration: 0.3,
                    }}
                    className={`absolute top-0 right-0 pt-12 text-base font-medium text-gray-600 z-19 hidden group-hover:block ${
                      showUserMenu ? '!block' : ''
                    }`}
                  >
                    <ul className="min-w-[200px] bg-beige-light rounded flex flex-col gap-4 p-4">
                      <li className="pl-3 w-full">
                        <NavLink
                          className="hover:text-black inline-block w-full"
                          to="/my-cart"
                        >
                          Cart
                        </NavLink>
                      </li>
                      <li className="pl-3 w-full">
                        <NavLink
                          className="hover:text-black inline-block w-full"
                          to="my-profile"
                        >
                          Profile
                        </NavLink>
                      </li>
                      <li className="flex justify-start items-center">
                        <button
                          className="px-3 py-1.5 border-2 border-white text-sm rounded-full hover:text-black"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </motion.nav>
                </AnimatePresence>
              )}
            </div>
          ) : (
            /* Desktop Login/Signup buttons */
            <div className="hidden md:flex items-center gap-3">
              <NavLink
                to="/login"
                className="px-4 py-2 text-sm font-medium bg-beige-dark text-white rounded-full hover:bg-black transition-all duration-200"
              >
                Create Account
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Icon - Always visible on mobile */}
          <div className="md:hidden">
            <MdMenuOpen
              onClick={() => setShowMenu(true)}
              className="text-xl text-beige-dark hover:text-black font-extrabold cursor-pointer"
            />
          </div>

          {/* Mobile Menu Overlay */}
          {showMenu && (
            <AnimatePresence>
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{
                  type: 'tween',
                  ease: 'easeInOut',
                  duration: 0.3,
                }}
                className="fixed right-0 top-0 bottom-0 z-20 w-full bg-beige-light md:hidden"
              >
                <div className="flex items-center justify-between px-5 py-6">
                  <Logo />
                  <IoMdClose
                    onClick={() => setShowMenu(false)}
                    className="text-xl text-gray-600 hover:text-black font-bold cursor-pointer"
                  />
                </div>
                <ul className="flex flex-col items-center gap-2 mt-2 px-5 text-lg font-medium">
                  <li>
                    <NavLink
                      className="navbar-link-mobile"
                      onClick={() => setShowMenu(false)}
                      to="/"
                    >
                      <p className="px-3 py-2 rounded inline-block text-gray-600 hover:text-black">
                        HOME
                      </p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="navbar-link-mobile"
                      onClick={() => setShowMenu(false)}
                      to="/gallery"
                    >
                      <p className="px-3 py-2 rounded inline-block text-gray-600 hover:text-black">
                        GALLERY
                      </p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="navbar-link-mobile"
                      onClick={() => setShowMenu(false)}
                      to="contact"
                    >
                      <p className="px-3 py-2 rounded inline-block text-gray-600 hover:text-black">
                        CONTACT
                      </p>
                    </NavLink>
                  </li>
                  <hr className="outline-none border-none h-[1px] bg-beige w-full" />
                  {/* Conditional Mobile Menu Content Based on User State */}
                  {user ? (
                    /* User is logged in - show user options */
                    <>
                      <li className="mt-4">
                        <NavLink
                          onClick={() => setShowMenu(false)}
                          to="/my-cart"
                          className="block px-3 py-2 rounded text-gray-600 hover:text-black"
                        >
                          My Cart
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={() => setShowMenu(false)}
                          to="/my-profile"
                          className="block px-3 py-2 rounded text-gray-600 hover:text-black"
                        >
                          My Profile
                        </NavLink>
                      </li>
                      <li className="mt-4 w-full px-3">
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowMenu(false);
                          }}
                          className="block w-full text-center px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-700 transition-all"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    /* User is not logged in - show login/signup */
                    <li className="mt-4 w-full px-3">
                      {isLoadingUser ? (
                        <div className="flex justify-center md:hidden gap-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-r from-gray-200 to-gray-100 animate-pulse "></div>
                        </div>
                      ) : (
                        <NavLink
                          onClick={() => setShowMenu(false)}
                          to="/login"
                          className="block w-full text-center px-4 py-2 bg-beige-dark text-white rounded-full hover:bg-black transition-all"
                        >
                          Create Account
                        </NavLink>
                      )}
                    </li>
                  )}
                </ul>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
