import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import '../css/admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="admin-login">
      <form className="admin-card" onSubmit={handleSubmit}>
        <p className="admin-kicker">Horizonte Publicidad</p>
        <h1>Panel de administración</h1>
        <p className="admin-lead">Ingresá para gestionar los carteles.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={pending}>
          {pending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;
