import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="logo" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
          [FALLOUT DND]
        </div>
      </Link>
      
      <div className="nav-links">
        <div className="dropdown">
          <button className="btn">Правила</button>
          <div className="dropdown-content">
            <Link to="/quick-start">Быстрый старт</Link>
            <Link to="/mechanics">Механики</Link>
          </div>
        </div>

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
