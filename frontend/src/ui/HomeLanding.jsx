import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

export const HomeLanding = () => {
  const contentSets = [
    {
      bgImage: `url("${
        window.innerWidth >= 768 ? assets.hero_img_1 : assets.hero_mobile_img_1
      }")`,
      heading: 'Where Emotion Meets Canvas',
      subheading: 'Contemporary Art That Speaks to the Soul',
      buttonText: 'Explore the Collection →',
      link: '/gallery',
      buttonVariant: 'hover:bg-opacity-90 bg-white text-black', // Added styling option
    },
    {
      bgImage: `url("${
        window.innerWidth >= 768 ? assets.hero_img_2 : assets.hero_mobile_img_2
      }")`,
      heading: "Let's Create Something Extraordinary",
      subheading: 'Commission Your Personal Masterpiece',
      buttonText: 'Start Your Art Journey',
      link: '/contact',
      buttonVariant: 'hover:bg-opacity-90 bg-brand text-white',
    },
    {
      bgImage: `url("${
        window.innerWidth >= 768 ? assets.hero_img_3 : assets.hero_mobile_img_3
      }")`,
      heading: 'Join the Artistic Conversation',
      subheading: 'Exclusive Access to Studio Stories',
      buttonText: 'Become a Member',
      link: '/login',
      buttonVariant: 'hover:bg-opacity-90 bg-beige-dark text-white',
    },
  ];
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % contentSets.length);
    }, 8000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoRotate, contentSets.length]);

  // Handle manual toggle (resets auto-rotation timer)
  const handleToggle = (index) => {
    setActiveIndex(index);
    setAutoRotate(false); // Pause auto-rotation on manual interaction

    // Resume auto-rotation after 10 seconds of inactivity
    setTimeout(() => setAutoRotate(true), 10000);
  };

  return (
    <section className="relative h-screen overflow-hidden -mt-5 -mx-2  xs:-mx-8  sm:-mx-[3%] bg-beige-light">
      {/* Background Image with Fade Transition */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: contentSets[activeIndex].bgImage,
          opacity: 0.9,
        }}
      />

      {/* Content Overlay with Animation */}
      <div className="absolute inset-0 bg-transparent  flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center px-4 text-[#f7ecec] max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-[rgba(0,0,0,0.1)] mb-2">
              {contentSets[activeIndex].heading}
            </h1>
            {contentSets[activeIndex].subheading && (
              <p className="text-xl md:text-2xl mb-6 bg-[rgba(0,0,0,0.3)] py-2 font-light">
                {contentSets[activeIndex].subheading}
              </p>
            )}
            <button
              onClick={() => navigate(contentSets[activeIndex].link)}
              className={`inline-block px-8 py-3 rounded-full text-lg font-medium transition-all hover:scale-x-105 duration-200 ${contentSets[activeIndex].buttonVariant}`}
            >
              {contentSets[activeIndex].buttonText}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
        {contentSets.map((_, index) => (
          <button
            key={index}
            onClick={() => handleToggle(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-brand w-6'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
