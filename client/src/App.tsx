import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './api/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import QuickStart from './pages/QuickStart';
import Races from './pages/Races';
import Classes from './pages/Classes';
import Origins from './pages/Origins';
import Perks from './pages/Perks';
import Weapons from './pages/Weapons';
import Armor from './pages/Armor';
import Items from './pages/Items';
import Mechanics from './pages/Mechanics';
import Admin from './pages/Admin';
import SearchResults from './pages/SearchResults';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import './styles/terminal.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="terminal-container">
          <Header />
          <main style={{ minHeight: '70vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quick-start" element={<QuickStart />} />
              <Route path="/races" element={<Races />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/origins" element={<Origins />} />
              <Route path="/perks" element={<Perks />} />
              <Route path="/weapons" element={<Weapons />} />
              <Route path="/armor" element={<Armor />} />
              <Route path="/items" element={<Items />} />
              <Route path="/mechanics" element={<Mechanics />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
