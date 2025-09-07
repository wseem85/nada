import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SectionTitle = ({ title, interval = 8000 }) => {
  const [key, setKey] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  // Set up interval to restart animation
  useEffect(() => {
    const timer = setInterval(() => {
      setKey((prevKey) => prevKey + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return (
    <AnimatePresence mode="wait">
      <motion.h3
        key={key}
        className="text-3xl font-medium text-[#501414] uppercase tracking-wide text-center mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {title.split('').map((char, index) => (
          <motion.span key={index} variants={letterVariants}>
            {char}
          </motion.span>
        ))}
      </motion.h3>
    </AnimatePresence>
  );
};

export default SectionTitle;
