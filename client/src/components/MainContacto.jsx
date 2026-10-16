import { useState } from 'react';
import '../css/contacto.css';

const MainContacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    setEnviado(true);
    
    setTimeout(() => {
      setEnviado(false);
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
    }, 3000);
  };

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="section-title">
          Contáctanos
          </h2>
          <p className="section-subtitle">
            ¿Listo para llevar tu marca al siguiente nivel? Completa el formulario y nos pondremos en contacto contigo en breve.
          </p>
        </div>

        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+54 11 ..."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Cuéntanos sobre tu idea</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Necesito una campaña para..."
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-submit">
              {enviado ? '¡Mensaje Enviado!' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MainContacto;
