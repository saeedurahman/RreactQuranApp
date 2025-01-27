import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Headers.css';

function Headders() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <nav className="container">
        <NavLink to="/">
          <h1 className="logo">Read Quran</h1>
        </NavLink>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`menu ${menuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/QuranText">QuranText</NavLink>
          </li>
          <li>
            <NavLink to="/SearchAyah">SearchAyah</NavLink>
          </li>
          <li>
            <NavLink to="/TotalSurah">Meta INFO</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Headders;
