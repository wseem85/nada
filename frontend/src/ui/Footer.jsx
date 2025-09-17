import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
const Footer = () => {
  const token = true;
  return (
    <footer className="bg-white py-8 mt-8 -mx-2 xs:-mx-8 sm:-mx-[3%] px-2 xs:px-8 sm:px-[3%] md:px-[6%]">
      <div className="flex gap-7  flex-col md:flex-row md:justify-between">
        <div className="flex gap-7  flex-col xs:grid xs:grid-cols-[0.5fr_0.5fr] md:flex md:flex-row md:justify-between md:min-w-1/2">
          <div>
            <p className="mb-2 text-xl font-semibold">Links</p>
            <div className="flex flex-col gap-2">
              <NavLink to="/contact" className="text-sm underline">
                Contact
              </NavLink>
              <NavLink to="gallery" className="text-sm underline">
                Collections
              </NavLink>
              <NavLink
                to={`${token ? '/my-profile' : '/login'}`}
                className="text-sm underline"
              >
                Account
              </NavLink>
            </div>
            <hr className="bg-beige-light h-1 outline-none border-none mt-4 xs:hidden" />
          </div>
          <div>
            <p className="mb-2 text-xl font-semibold">Get In Touch</p>
            <div className="flex gap-4 items-center">
              <a
                href="https://www.facebook.com/profile.php?id=100092463108581"
                target="_blank"
              >
                <img className="w-6" src={assets.facebook} alt="" />
              </a>
              <a href="https://www.instagram.com/nadakh.art/" target="_blank">
                <img className="w-6" src={assets.instagram} alt="" />
              </a>
            </div>
            <hr className="bg-beige-light h-1 outline-none border-none mt-4 xs:hidden" />
          </div>
        </div>
        <hr className="bg-beige-light h-1 outline-none border-none mt-4 hidden xs:block" />
        <div>
          <p className="mb-2 text-xl font-semibold">Terms & Policies</p>
          <div className="flex flex-col gap-2">
            <NavLink
              onClick={() => scrollTo(0, 0)}
              to="/policies/privacy-and-refund"
              className="underline text-sm"
            >
              Privacy & Refund Policy
            </NavLink>
            <NavLink
              onClick={() => scrollTo(0, 0)}
              to="/policies/shipping"
              className="underline text-sm"
            >
              Shipping Policy
            </NavLink>
          </div>
          <hr className="bg-beige-light h-1 outline-none border-none mt-4 md:hidden" />
        </div>
      </div>
      <hr className="bg-beige-light h-1 outline-none border-none mt-4 hidden md:block" />
      <p className="mt-6 text-center">
        {' '}
        &copy; {new Date().getFullYear()} NadaArt
      </p>
    </footer>
  );
};

export default Footer;
