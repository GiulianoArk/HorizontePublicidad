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
          <p className="hero-eyebrow">Espacios publicitarios de alto impacto</p>
          <h2 className="hero-title">
            Tu marca en el horizonte de tu región
          </h2>
          <p className="hero-subtitle">
            Carteles en ubicaciones estratégicas con máxima visibilidad. Conocé
            nuestra red y consultá disponibilidad sin compromiso.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn--primary" onClick={scrollToCarteles}>
              Ver carteles
            </button>
            <Link to="/contacto" className="btn btn--ghost">
              Contactanos
            </Link>
          </div>
          <dl className="hero-stats">
            <div className="hero-stat">
              <dt>{carteles.length}+</dt>
              <dd>Carteles activos</dd>
            </div>
            <div className="hero-stat">
              <dt>{zonas.length}</dt>
              <dd>Zonas estratégicas</dd>
            </div>
            <div className="hero-stat">
              <dt>24h</dt>
              <dd>Respuesta por consulta</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="value-props" aria-label="Beneficios">
        <div className="value-props-inner">
          <article className="value-card">
            <div className="value-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3>Visibilidad en puntos clave</h3>
            <p>Ubicaciones seleccionadas para captar tráfico peatonal y vehicular.</p>
          </article>
          <article className="value-card">
            <div className="value-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <h3>Fotos y ubicación actualizadas</h3>
            <p>Cada cartel con imagen real y dirección clara para decidir con confianza.</p>
          </article>
          <article className="value-card">
            <div className="value-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>Alquiler flexible</h3>
            <p>Consultá por WhatsApp y armamos la campaña según tu presupuesto.</p>
          </article>
        </div>
      </section>

      <section className="carteles-gallery" id="carteles">
        <div className="gallery-header">
          <h2>Nuestra red de carteles</h2>
          <p>
            Explorá los espacios disponibles. Tocá un cartel para ver la foto en
            detalle y la ubicación exacta.
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
              className={`cartel-card ${cartel.destacado ? 'cartel-card--featured' : ''}`}
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
                <span className="cartel-hover-label">Ver detalle</span>
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

      <section className="home-cta">
        <div className="home-cta-inner">
          <h2>¿Querés reservar un cartel?</h2>
          <p>Escribinos y te asesoramos con la mejor ubicación para tu campaña.</p>
          <div className="home-cta-actions">
            <Link to="/contacto" className="btn btn--primary">
              Ir a contacto
            </Link>
            <a
              href={whatsappGeneral}
              className="btn btn--outline-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
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
              <span className="modal-badge">{selectedCartel.zona}</span>
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
