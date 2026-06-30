import { NavLink } from 'react-router-dom';
import { Heart, Radio } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <Radio size={18} />
        <div>
          <p className="brand-kicker">Podcast App</p>
          <h1>WaveRoom</h1>
        </div>
      </div>

      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/favourites" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Heart size={15} />
          Favourites
        </NavLink>
      </nav>

      <ThemeToggle />
    </header>
  );
}

export default Header;
