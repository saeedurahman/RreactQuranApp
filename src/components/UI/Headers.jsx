import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Headers.css';

function Header() {
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
            <NavLink to="/" onClick={toggleMenu}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/QuranText" onClick={toggleMenu}>QuranText</NavLink>
          </li>
          <li>
            <NavLink to="/SearchAyah" onClick={toggleMenu}>SearchAyah</NavLink>
          </li>
          <li>
            <NavLink to="/TotalSurah" onClick={toggleMenu}>Meta INFO</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;