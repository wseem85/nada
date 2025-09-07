import React from 'react';
import { HomeLanding } from '../ui/HomeLanding';
import { NewWorks } from '../ui/NewWorks';
import AboutArtist from '../ui/AboutArtist';

const Home = () => {
  return (
    <div>
      <HomeLanding />
      <NewWorks />
      <AboutArtist />
    </div>
  );
};

export default Home;
