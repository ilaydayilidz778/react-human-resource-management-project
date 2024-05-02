import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { tokens } from "../../scripst/theme";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../../../public/images/Logo.png';

const CustomNavbar = ({ user, setUser }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const clearCookie = (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        setUser(null);
    };

    return (
        <Navbar expand="lg" variant='dark'
            style={{
                background: colors.primary[700],
            }}>
            <Container>
                <Navbar.Brand
                    style={{
                        color: colors.blueAccent[500],
                        fontSize: '2.4rem',
                        fontWeight: 'bold',
                    }}>
                    <img src={Logo} alt="Logo" style={{ maxWidth: '72px', maxHeight: '72x', marginRight: '20px' }} />
                    HRHub - <span style={{ color: colors.blueAccent[400], fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Human Resources-Management
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <NavLink className="nav-link mr-4" to="/"
                            style={{
                                fontSize: '1.2rem',
                                paddingRight: '1.2rem',
                                fontWeight: 'bold',
                                color: colors.grey[100],
                                display: "flex",
                                alignItems: "center",
                            }}>
                            Ana Sayfa
                        </NavLink>
                        <NavLink className="nav-link mr-4" to="/about"
                            style={{
                                fontSize: '1.2rem',
                                paddingRight: '1.2rem',
                                fontWeight: 'bold',
                                color: colors.grey[100],
                                display: "flex",
                                alignItems: "center",
                            }}>
                            Hakkında
                        </NavLink>
                        <NavLink className="nav-link mr-4" to="/services"
                            style={{
                                fontSize: '1.2rem',
                                paddingRight: '1.2rem',
                                fontWeight: 'bold',
                                color: colors.grey[100],
                                display: "flex",
                                alignItems: "center",
                            }}>
                            Hizmetlerimiz
                        </NavLink>
                        <NavLink className="nav-link mr-4" to="/contact"
                            style={{
                                fontSize: '1.2rem',
                                paddingRight: '1.2rem',
                                fontWeight: 'bold',
                                color: colors.grey[100],
                                display: "flex",
                                alignItems: "center",
                            }}>
                            İletişim
                        </NavLink>
                        {user ? (
                            <>
                                {user.role === "Firma Sahibi" && (
                                    <NavLink className="nav-link mr-4" to="/companyManager/"
                                        style={{
                                            fontSize: '1.2rem',
                                            paddingRight: '1.2rem',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            color: colors.greenAccent[400]
                                        }}>
                                        Hoşgeldin <br /> {user?.firstName}  {user?.secondName ?? ""}
                                    </NavLink>
                                )}
                                {user.role === "Personel" && (
                                    <NavLink className="nav-link mr-4" to="/personnel/"
                                        style={{
                                            fontSize: '1.2rem',
                                            paddingRight: '1.2rem',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            color: colors.greenAccent[400]
                                        }}>
                                        Hoşgeldin <br /> {user?.firstName}  {user?.secondName ?? ""}
                                    </NavLink>
                                )}
                                {/* Çıkış Yap bağlantısı */}
                                <NavLink className="nav-link mr-4" to="/"
                                    onClick={() => clearCookie("loginTokenCookie", "", 0)}
                                    style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        color: colors.greenAccent[600],





                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                    Çıkış Yap
                                </NavLink>
                            </>
                        ) : (
                            <NavLink className="nav-link mr-4" to="/login"
                                style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: colors.grey[100],
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                Giriş Yap
                            </NavLink>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
