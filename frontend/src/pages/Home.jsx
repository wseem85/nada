import React from 'react';
import { HomeLanding } from '../ui/HomeLanding';
import { NewWorks } from '../ui/NewWorks';
import AboutArtist from '../ui/AboutArtist';
import NadaHelmet from '../components/NadaHelmet';

const Home = () => {
  return (
    <div>
      <NadaHelmet
        description="A Website to view , pay rate artworks made by artist Nada "
        keywords="Nada, nada, NADA, art, artworks, painting, purchase, online "
      />
      <HomeLanding />
      <NewWorks />
      <AboutArtist />
    </div>
  );
};

export default Home;
