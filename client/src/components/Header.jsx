import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cartelesTo = isHome ? '#carteles' : '/#carteles';

  return (
    <header
      className={`header ${scrolled ? 'header--scrolled' : ''} ${isHome ? 'header--over-hero' : 'header--solid'}`}
    >
      <div className="header-container">
        <Link to="/" className="logo-link">
          <h1 className="logo">
            Horizonte <span className="logo-highlight">Publicidad</span>
          </h1>
          <p className="subtitle">Alquiler de carteles</p>
        </Link>

        <nav className="header-nav" aria-label="Principal">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
          <Link to={cartelesTo} className="nav-link">
            Carteles
          </Link>
          <Link to="/contacto" className="nav-link">
            Contacto
          </Link>
        </nav>

        <Link to="/contacto" className="header-cta btn btn--primary">
          Consultar
        </Link>
      </div>
    </header>
  );
};

export default Header;
