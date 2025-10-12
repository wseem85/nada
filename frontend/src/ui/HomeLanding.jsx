import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
const IMAGE_SETS = [
  {
    desktop: assets.hero_img_1,
    mobile: assets.hero_mobile_img_1,
    heading: 'Where Emotion Meets Canvas',
    subheading: 'Contemporary Art That Speaks to the Soul',
    buttonText: 'Explore the Collection →',
    link: '/gallery',
    buttonVariant: 'hover:bg-opacity-90 bg-white text-black', // Added styling option
  },
  {
    desktop: assets.hero_img_2,
    mobile: assets.hero_mobile_img_2,
    heading: "Let's Create Something Extraordinary",
    subheading: 'Commission Your Personal Masterpiece',
    buttonText: 'Start Your Art Journey',
    link: '/contact',
    buttonVariant: 'hover:bg-opacity-90 bg-brand text-white',
  },
  {
    desktop: assets.hero_img_3,
    mobile: assets.hero_mobile_img_3,
    heading: 'Join the Artistic Conversation',
    subheading: 'Exclusive Access to Studio Stories',
    buttonText: 'Become a Member',
    link: '/login',
    buttonVariant: 'hover:bg-opacity-90 bg-beige-dark text-white',
  },
];
export const HomeLanding = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Get screen size
  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Memoized content
  const contentSets = useMemo(
    () =>
      IMAGE_SETS.map((set) => ({
        ...set,
        imageUrl: isDesktop ? set.desktop : set.mobile,
      })),
    [isDesktop]
  );

  const currentContent = contentSets[activeIndex];

  return (
    <section className="relative h-screen overflow-hidden -mt-5 -mx-2 xs:-mx-8 sm:-mx-[3%] bg-beige-light">
      <img
        src={currentContent.imageUrl}
        alt="hero bg image"
        className="absolute inset-0 w-full h-full object-cover"
        loading={activeIndex === 0 ? 'eager' : 'lazy'} // lazy loads only when visible
        decoding="async"
        style={{
          opacity: loadedImages.has(currentContent.imageUrl) ? 0.9 : 0.3,
        }}
        onLoad={() =>
          setLoadedImages((prev) => new Set(prev).add(currentContent.imageUrl))
        }
      />

      <div className="absolute inset-0 bg-transparent flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center px-4 text-[#f7ecec] max-w-4xl"
          >
            <h1 className="text-4xl font-caveat md:text-6xl font-bold bg-[rgba(0,0,0,0.1)] mb-2">
              {currentContent.heading}
            </h1>
            {currentContent.subheading && (
              <p className="text-xl md:text-2xl mb-6 bg-[rgba(0,0,0,0.3)] py-2 font-light">
                {currentContent.subheading}
              </p>
            )}
            <button
              onClick={() => navigate(currentContent.link)}
              className={`inline-block px-8 py-3 rounded-full text-lg font-medium transition-all hover:scale-105 duration-200 ${currentContent.buttonVariant}`}
            >
              {currentContent.buttonText}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
        {contentSets.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-brand w-6' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
export default HomeLanding;
