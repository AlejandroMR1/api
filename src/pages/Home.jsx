import React from 'react';
import Header from './Header';
import './Home.css';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <Header />
            <div className="links-section">
                <div className="links-grid">
                    <Link to="/attendance" className="link-item">Asistencia</Link>
                    <Link to="/reporteuno" className="link-item">Reportes</Link>
                    <Link to="/employees" className="link-item">Empleados</Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;
