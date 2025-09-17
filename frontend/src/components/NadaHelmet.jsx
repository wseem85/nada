// components/NadaHelmet.js
import { Helmet } from 'react-helmet';

const NadaHelmet = ({
  sections = [],
  description = '',
  keywords = '',
  children,
}) => {
  const baseTitle = 'Nada Art';
  const fullTitle =
    sections.length > 0 ? `${baseTitle} | ${sections.join(' | ')}` : baseTitle;
  const defaultMetaTags = [
    { property: 'og:title', content: fullTitle },
    { property: 'og:type', content: 'website' },
  ];
  if (keywords) {
    defaultMetaTags.push({ name: 'keywords', content: keywords });
  }
  if (description) {
    defaultMetaTags.push(
      { name: 'description', content: description },
      { property: 'og:description', content: description },
      { name: 'twitter:description', content: description }
    );
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {defaultMetaTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}
      {children}
    </Helmet>
  );
};

export default NadaHelmet;
