import React from 'react';
import { motion } from 'framer-motion';
const FullScreenSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7ecec] via-beige-light to-[#faf7f0] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full mx-auto mb-4"
        />
        <p className="text-text/70 font-light">Loading...</p>
      </motion.div>
    </div>
  );
};

export default FullScreenSpinner;
