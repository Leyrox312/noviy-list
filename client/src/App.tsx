import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import QuickStart from './pages/QuickStart';
import Races from './pages/Races';
import Classes from './pages/Classes';
import Weapons from './pages/Weapons';
import Admin from './pages/Admin';
import './styles/terminal.css';

// Placeholder components for other pages
const Origins = () => <div className="terminal-container"><h1>Происхождения</h1><p>Загрузка данных из терминала...</p></div>;
const Perks = () => <div className="terminal-container"><h1>Перки</h1><p>Загрузка данных из терминала...</p></div>;
const Armor = () => <div className="terminal-container"><h1>Броня</h1><p>Загрузка данных из терминала...</p></div>;
const Items = () => <div className="terminal-container"><h1>Предметы</h1><p>Загрузка данных из терминала...</p></div>;

function App() {
  return (
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
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
