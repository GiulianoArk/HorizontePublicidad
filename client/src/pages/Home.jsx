import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import MainHome from '../components/MainHome';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#carteles') {
      document.getElementById('carteles')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="page">
      <Header />
      <MainHome />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
