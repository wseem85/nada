import React from 'react';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import useLanguage from './hooks/useLanguage.js';
import { Route, Routes } from 'react-router-dom';
// Import i18n configuration
import Home from './pages/Home.jsx';
import Layout from './pages/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GenerateArticle from './pages/GenerateArticle.jsx';
import ArticleTitles from './pages/ArticleTitles.jsx';
import GenerateImages from './pages/GenerateImages.jsx';
import RemoveBackground from './pages/RemoveBackground.jsx';
import RemoveObject from './pages/RemoveObject.jsx';
import AnalayseResume from './pages/AnalayseResume.jsx';

const App = () => {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`
      text-3xl text-brand px-2 md:px-6 max-w-3xl
      /* Account for fixed sidebar on desktop */
      ${isRTL ? 'md:mr-64' : 'md:ml-64'} 
      /* Account for fixed navbar */
      pt-16
      /* Add some margin for better spacing */
      md:mx-8
    `}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="generate-article" element={<GenerateArticle />} />
          <Route path="generate-article-title" element={<ArticleTitles />} />
          <Route path="generate-image" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="analayse-resume" element={<AnalayseResume />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
