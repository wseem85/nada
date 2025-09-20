import React, { useContext, useState } from 'react';
// import { AdminContext, DoctorContext } from '../context/contexts';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb';
import { IoMdClose } from 'react-icons/io';
import Logo from './Logo';

// import { assets } from '../assets/assets';

const SideBar = () => {
  const admin = { name: 'admin', _id: 'djhdshdshdsh' };
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <>
      {/* // Desktop View */}
      <div className="hidden md:block shadow-md bg-white fixed top-[56px] left-0 min-h-screen h-full w-60 z-20  overflow-y-auto pt-12">
        {admin._id && (
          <ul className="text-text mt-7">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 cursor-pointer ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                }`
              }
              to={'/dashboard'}
            >
              {/* <img src={assets.home_icon} alt="Home Icon" /> */}
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 cursor-pointer ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                }`
              }
              to={'/all-artworks'}
            >
              {/* <img src={assets.appointment_icon} alt="Home Icon" /> */}
              <p>All Artworks</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 cursor-pointer ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                }`
              }
              to={'/orders'}
            >
              {/* <img src={assets.add_icon} alt="Home Icon" /> */}
              <p>Orders</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 cursor-pointer ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                }`
              }
              to={'/upload-artwork'}
            >
              {/* <img src={assets.people_icon} alt="Home Icon" /> */}
              <p>Upload Artwork</p>
            </NavLink>
          </ul>
        )}
      </div>
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="min-h-full shadow-md fixed  z-9999 top-16    ">
          <motion.button
            onClick={() => setShowSideBar(true)}
            className="bg-transparent  top-20 text-sm  md:hidden pt-3 pr-2 pl-1" // Added md:hidden to hide on desktop
            animate={{
              x: [0, 5, 0], // Moves right 5px then back to original position
            }}
            transition={{
              duration: 1.5, // Duration of one complete cycle
              repeat: Infinity, // Repeat forever
              repeatType: 'loop', // Smooth looping
              ease: 'easeInOut', // Smooth acceleration/deceleration
            }}
            whileHover={{ scale: 1.1 }} // Slight scale on hover for extra interactivity
            whileTap={{ scale: 0.95 }}
          >
            <TbLayoutSidebarLeftExpandFilled className="text-text text-xl bg-transparent" />
          </motion.button>
        </div>
        <div className="relative overflow-hidden">
          <AnimatePresence>
            {showSideBar && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSideBar(false)}
                  className="fixed inset-0 bg-black/30 z-20 md:hidden "
                />

                {/* Sidebar */}
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{
                    type: 'tween',
                    ease: 'easeInOut',
                    duration: 0.3,
                  }}
                  className="fixed top-[60px] left-0 h-full z-9999 md:hidden"
                >
                  <motion.ul className="text-text pt-3 w-[200px] min-h-full flex flex-col shadow-sm bg-white">
                    <button
                      onClick={() => setShowSideBar(false)}
                      className="self-end mt-3 mr-3"
                    >
                      <IoMdClose className="text-text text-lg" />
                    </button>
                    <NavLink
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                          isActive
                            ? 'bg-[#F2F3FF] border-r-4 border-primary'
                            : ''
                        }`
                      }
                      to={'/dashboard'}
                      onClick={() => setShowSideBar(false)}
                    >
                      <p>Dashboard</p>
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                          isActive
                            ? 'bg-[#F2F3FF] border-r-4 border-primary'
                            : ''
                        }`
                      }
                      to={'/all-artworks'}
                      onClick={() => setShowSideBar(false)}
                    >
                      <p>All Artworks</p>
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                          isActive
                            ? 'bg-[#F2F3FF] border-r-4 border-primary'
                            : ''
                        }`
                      }
                      to={'/orders'}
                      onClick={() => setShowSideBar(false)}
                    >
                      <p>Orders</p>
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                          isActive
                            ? 'bg-[#F2F3FF] border-r-4 border-primary'
                            : ''
                        }`
                      }
                      to={'/upload-artwork'}
                      onClick={() => setShowSideBar(false)}
                    >
                      <p>Upload Artwork</p>
                    </NavLink>
                  </motion.ul>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default SideBar;
