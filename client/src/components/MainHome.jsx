import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getZonasFromCarteles } from '../data/carteles';
import { loadCarteles } from '../lib/loadCarteles';
import {
  buildCartelWhatsAppMessage,
  buildWhatsAppUrl,
  defaultWhatsAppMessage,
} from '../config/contact';
import '../css/mainhome.css';
import '../css/modal.css';

const HERO_BG =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Panor%C3%A1mica_del_centro_tucumano.jpg/1920px-Panor%C3%A1mica_del_centro_tucumano.jpg?utm_source=es.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail';

const LocationIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MainHome = () => {
  const [carteles, setCarteles] = useState([]);
  const [galleryStatus, setGalleryStatus] = useState('loading');
  const [galleryError, setGalleryError] = useState('');
  const [selectedCartel, setSelectedCartel] = useState(null);
  const [filtroZona, setFiltroZona] = useState('Todos');
  const zonas = useMemo(() => getZonasFromCarteles(carteles), [carteles]);

  const cartelesFiltrados = useMemo(() => {
    if (filtroZona === 'Todos') return carteles;
    return carteles.filter((c) => c.zona === filtroZona);
  }, [carteles, filtroZona]);

  useEffect(() => {
    let cancelled = false;

    loadCarteles()
      .then((data) => {
        if (cancelled) return;
        setCarteles(data);
        setGalleryStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setGalleryError(err.message);
        setGalleryStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedCartel ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCartel]);

  useEffect(() => {
    if (!selectedCartel) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCartel(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedCartel]);

  const scrollToCarteles = () => {
    document.getElementById('carteles')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = (cartel) => setSelectedCartel(cartel);
  const closeModal = () => setSelectedCartel(null);

  const whatsappGeneral = buildWhatsAppUrl(defaultWhatsAppMessage);

  return (
    <main className="main-home">
      <section className="hero" style={{ '--hero-bg': `url(${HERO_BG})` }}>
        <div className="hero-overlay" />
        <div className="hero-inner">
          <p className="hero-kicker">Alquiler de carteles · Tucumán</p>
          <h2 className="hero-title">Tu marca donde la gente circula</h2>
          <p className="hero-subtitle">
            Espacios en vía pública con foto y dirección de cada ubicación. Elegí
            el cartel y consultanos por disponibilidad y tarifas.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn--primary" onClick={scrollToCarteles}>
              Ver ubicaciones
            </button>
            <Link to="/contacto" className="btn btn--ghost">
              Escribinos
            </Link>
          </div>
        </div>
      </section>

      <section className="carteles-gallery" id="carteles">
        <div className="gallery-header">
          <h2>Carteles disponibles</h2>
          <p>
            {galleryStatus === 'ready' && carteles.length > 0
              ? `${carteles.length} espacio${carteles.length === 1 ? '' : 's'} publicado${carteles.length === 1 ? '' : 's'}. Tocá uno para ver la imagen ampliada y la dirección.`
              : 'Listado de espacios con imagen y ubicación.'}
          </p>
        </div>

        <div className="zone-filters" role="tablist" aria-label="Filtrar por zona">
          <button
            type="button"
            role="tab"
            aria-selected={filtroZona === 'Todos'}
            className={`zone-chip ${filtroZona === 'Todos' ? 'zone-chip--active' : ''}`}
            onClick={() => setFiltroZona('Todos')}
          >
            Todos
          </button>
          {zonas.map((zona) => (
            <button
              key={zona}
              type="button"
              role="tab"
              aria-selected={filtroZona === zona}
              className={`zone-chip ${filtroZona === zona ? 'zone-chip--active' : ''}`}
              onClick={() => setFiltroZona(zona)}
            >
              {zona}
            </button>
          ))}
        </div>

        {galleryStatus === 'loading' && <p className="gallery-empty">Cargando carteles…</p>}
        {galleryStatus === 'error' && (
          <p className="gallery-empty">{galleryError || 'No se pudieron cargar los carteles.'}</p>
        )}

        <div className="gallery-grid">
          {cartelesFiltrados.map((cartel) => (
            <article
              key={cartel.id}
              className="cartel-card"
              onClick={() => openModal(cartel)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(cartel);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="cartel-image">
                <img src={cartel.image} alt={cartel.titulo} loading="lazy" />
                <span className="cartel-badge">{cartel.zona}</span>
              </div>
              <div className="cartel-info">
                <h3>{cartel.titulo}</h3>
                <p className="cartel-direccion">
                  <LocationIcon />
                  {cartel.direccion}
                </p>
              </div>
            </article>
          ))}
        </div>

        {galleryStatus === 'ready' && cartelesFiltrados.length === 0 && (
          <p className="gallery-empty">No hay carteles en esta zona por ahora.</p>
        )}
      </section>

      <section className="home-cta" aria-label="Contacto">
        <div className="home-cta-inner">
          <p>
            ¿Necesitás un cartel para tu campaña?{' '}
            <Link to="/contacto">Dejanos tus datos</Link> o{' '}
            <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer">
              escribinos por WhatsApp
            </a>
            .
          </p>
        </div>
      </section>

      {selectedCartel && (
        <div className="modal-overlay" onClick={closeModal} role="presentation">
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button type="button" className="modal-close" onClick={closeModal} aria-label="Cerrar">
              ×
            </button>
            <img
              src={selectedCartel.image}
              alt={selectedCartel.titulo}
              className="modal-image"
            />
            <div className="modal-info">
              <p className="modal-zona">{selectedCartel.zona}</p>
              <h3 id="modal-title">{selectedCartel.titulo}</h3>
              <p className="modal-direccion">
                <LocationIcon size={18} />
                {selectedCartel.direccion}
              </p>
              <a
                href={buildWhatsAppUrl(
                  buildCartelWhatsAppMessage(
                    selectedCartel.titulo,
                    selectedCartel.direccion,
                  ),
                )}
                className="btn btn--primary modal-wa-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MainHome;
