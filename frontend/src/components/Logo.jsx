import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/')}
      className="font-updock font-bold text-lg text-brand cursor-pointer"
    >
      NadaArt
    </div>
  );
};

export default Logo;
