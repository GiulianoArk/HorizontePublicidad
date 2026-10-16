import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createCartel,
  deleteCartel,
  getCarteles,
  getMe,
  logout,
  updateCartel,
} from '../api';
import '../css/admin.css';

const emptyForm = {
  titulo: '',
  direccion: '',
  zona: '',
  destacado: false,
  image: null,
};

const Admin = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [carteles, setCarteles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const loadCarteles = async () => {
    const data = await getCarteles();
    setCarteles(data);
  };

  useEffect(() => {
    let cancelled = false;

    getMe()
      .then(async (me) => {
        if (cancelled) return;
        setEmail(me.email);
        await loadCarteles();
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) navigate('/admin/login', { replace: true });
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const startEdit = (cartel) => {
    setEditingId(cartel.id);
    setForm({
      titulo: cartel.titulo,
      direccion: cartel.direccion,
      zona: cartel.zona,
      destacado: cartel.destacado,
      image: null,
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!editingId && !form.image) {
      setError('La imagen es obligatoria para un cartel nuevo');
      return;
    }

    const body = new FormData();
    body.append('titulo', form.titulo);
    body.append('direccion', form.direccion);
    body.append('zona', form.zona);
    body.append('destacado', form.destacado ? 'true' : 'false');
    if (form.image) body.append('image', form.image);

    setPending(true);
    try {
      if (editingId) {
        await updateCartel(editingId, body);
      } else {
        await createCartel(body);
      }
      await loadCarteles();
      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (cartel) => {
    const confirmed = window.confirm(`¿Eliminar "${cartel.titulo}"?`);
    if (!confirmed) return;

    setError('');
    try {
      await deleteCartel(cartel.id);
      if (editingId === cartel.id) cancelEdit();
      await loadCarteles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  if (!ready) {
    return (
      <main className="admin-page">
        <p className="admin-status">Cargando panel…</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-top">
        <div>
          <p className="admin-kicker">Administración</p>
          <h1>Carteles</h1>
          <p className="admin-lead">{email}</p>
        </div>
        <button type="button" className="btn btn--dark" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <section className="admin-layout">
        <form className="admin-card" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Editar cartel' : 'Nuevo cartel'}</h2>

          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            value={form.titulo}
            onChange={(event) => setForm({ ...form, titulo: event.target.value })}
            required
            maxLength={120}
          />

          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            value={form.direccion}
            onChange={(event) => setForm({ ...form, direccion: event.target.value })}
            required
            maxLength={200}
          />

          <label htmlFor="zona">Zona</label>
          <input
            id="zona"
            value={form.zona}
            onChange={(event) => setForm({ ...form, zona: event.target.value })}
            required
            maxLength={60}
            placeholder="Centro, Ruta, Norte…"
          />

          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(event) => setForm({ ...form, destacado: event.target.checked })}
            />
            Destacado
          </label>

          <label htmlFor="image">
            {editingId ? 'Nueva imagen (opcional)' : 'Imagen'}
          </label>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setForm({ ...form, image: event.target.files?.[0] ?? null })}
          />

          {error && <p className="admin-error">{error}</p>}

          <div className="admin-form-actions">
            <button type="submit" className="btn btn--primary" disabled={pending}>
              {pending ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Publicar cartel'}
            </button>
            {editingId && (
              <button type="button" className="btn btn--dark" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <ul className="admin-list">
          {carteles.map((cartel) => (
            <li key={cartel.id} className="admin-item">
              <img src={cartel.image} alt="" />
              <div>
                <h3>{cartel.titulo}</h3>
                <p>{cartel.direccion}</p>
                <p className="admin-meta">
                  {cartel.zona}
                  {cartel.destacado ? ' · Destacado' : ''}
                </p>
              </div>
              <div className="admin-item-actions">
                <button type="button" className="btn btn--dark" onClick={() => startEdit(cartel)}>
                  Editar
                </button>
                <button type="button" className="btn admin-delete" onClick={() => handleDelete(cartel)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
          {carteles.length === 0 && <li className="admin-status">Todavía no hay carteles.</li>}
        </ul>
      </section>
    </main>
  );
};

export default Admin;
