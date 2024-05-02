import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import HomeContent from '../components/HomeContent/HomeContent';
import AboutContent from '../components/AboutContent/AboutContent';
import ContactContent from '../components/ContactContent/ContactContent';
import CustomNavbar from '../components/Navbar/CustomNavbar';
import CustomFooter from '../components/Footer/CustomFooter';
import ServicesContent from '../components/ServicesContent/ServicesContent';
import ErrorPage from './ErrorPage';
import { errorMessages } from '../data/errorMessages';

const HomePage = ({ user, setUser }) => {
    // ErrorPage render edilip edilmediğini kontrol etmek için durum
    const [isErrorPage, setIsErrorPage] = useState(false);

    return (
        <div className="app">
            <main className="content">
                <Container fluid style={{ height: '100%', paddingLeft: '0', paddingRight: '0' }}>
                    {/* CustomNavbar'ı sadece ErrorPage render edilmediğinde gösterin */}
                    {!isErrorPage && <CustomNavbar user={user} setUser={setUser} />}

                    <Routes>
                        <Route path="/" element={<HomeContent />} />
                        <Route path="/about" element={<AboutContent />} />
                        <Route path="/contact" element={<ContactContent />} />
                        <Route path="/services" element={<ServicesContent />} />

                        {/* ErrorPage render edildiğinde durumu true yapın */}
                        <Route path="*" element={<ErrorPage code={404} message={errorMessages[404]} setIsErrorPage={setIsErrorPage} />} />
                    </Routes>

                    {/* CustomFooter'ı sadece ErrorPage render edilmediğinde gösterin */}
                    {!isErrorPage && <CustomFooter />}
                </Container>
            </main>
        </div>
    );
}

export default HomePage;
