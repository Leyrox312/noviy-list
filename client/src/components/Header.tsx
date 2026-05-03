import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="logo" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
          [FALLOUT DND]
        </div>
      </Link>
      
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ marginRight: '15px' }}>
          <input 
            type="text" 
            placeholder="ПОИСК В БАЗЕ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              background: 'black', 
              color: '#18ff62', 
              border: '1px solid #18ff62', 
              padding: '5px 10px',
              fontFamily: 'inherit',
              width: '150px',
              outline: 'none'
            }}
          />
        </form>

        <div className="dropdown">
          <button className="btn">Правила</button>
          <div className="dropdown-content">
            <Link to="/quick-start">Быстрый старт</Link>
            <Link to="/mechanics">Механики</Link>
          </div>
        </div>

        <Link to="/articles" className="btn">Архивы</Link>

        <div className="dropdown">
          <button className="btn">Персонаж</button>
          <div className="dropdown-content">
            <Link to="/races">Расы</Link>
            <Link to="/classes">Классы</Link>
            <Link to="/origins">Происхождения</Link>
            <Link to="/perks">Перки</Link>
          </div>
        </div>

        <div className="dropdown">
          <button className="btn">Снаряжение</button>
          <div className="dropdown-content">
            <Link to="/weapons">Оружие</Link>
            <Link to="/armor">Броня</Link>
            <Link to="/items">Предметы</Link>
          </div>
        </div>

        <Link to="/admin" className="btn">Admin</Link>
      </div>
    </nav>
  );
};

export default Header;
