import React from 'react';
import { useTheme } from '@mui/material';
import { tokens } from "../../scripst/theme";
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SendIcon from '@mui/icons-material/Send';

const CustomFooter = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <footer
            style={{
                background: colors.primary[700],
                paddingTop: "50px",
                paddingBottom: "20px"
            }}>
            <Container>
                <Row className='footer-content'>
                    <Col xs={12} md={3} className="social-media" style={{ marginBottom: '20px' }}>
                        <div>
                            <h4
                                style={{
                                    fontFamily: "Source Sans Pro, sans-serif",
                                    color: colors.blueAccent[500],
                                    fontWeight: 'bold',
                                    fontSize: '1.4rem',
                                    marginBottom: '1rem'
                                }}>
                                Sosyal Medya Hesapları</h4>
                            <div className='social-media-icons'>
                                <Link to="link_to_facebook" style={{ color: colors.grey[200], marginRight: '20px', marginLeft: '20px' }}>
                                    <FacebookIcon />
                                </Link>
                                <Link to="link_to_twitter" style={{ color: colors.grey[200], marginRight: '20px' }}>
                                    <TwitterIcon />
                                </Link>
                                <Link to="link_to_instagram" style={{ color: colors.grey[200], marginRight: '20px' }}>
                                    <InstagramIcon />
                                </Link>
                                <Link to="link_to_pinterest" style={{ color: colors.grey[200], marginRight: '20px' }}>
                                    <PinterestIcon />
                                </Link>
                                <Link to="link_to_youtube" style={{ color: colors.grey[200] }}>
                                    <YouTubeIcon />
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={3} className="newsletter" style={{ marginBottom: '20px' }}>
                        <div>
                            <h4
                                style={{
                                    color: colors.blueAccent[500],
                                    fontWeight: 'bold',
                                    fontSize: '1.4rem'
                                }}>
                                Bülten</h4>
                            <p style={{ fontSize: '1rem' }}>En son haberlerimize ve makalelerimize kaydolun. Size istenmeyen postalardan kaçınacağız.</p>
                            <input type="email" placeholder="E-posta Adresi" style={{ width: '75%', padding: '5px' }} />
                            <button
                                style={{
                                    padding: '5px',
                                    background: colors.blueAccent[600],
                                    color: colors.grey[100],
                                    border: `1px solid ${colors.blueAccent[600]}`
                                }}>
                                <SendIcon />
                            </button>
                        </div>
                    </Col>
                    <Col xs={12} md={3} className="links" style={{ marginBottom: '20px' }}>
                        <div>
                            <ul style={{ marginLeft: '0', paddingLeft: '0' }}>
                                <h4
                                    style={{
                                        color: colors.blueAccent[500],
                                        fontWeight: 'bold',
                                        fontSize: '1.4rem'
                                    }}>
                                    Bağlantılar</h4>
                                <li><Link style={{ color: colors.grey[100], fontSize: '1rem' }} to="/hakkimizda" >Hakkımızda</Link></li>
                                <li><Link to="/ekibimiz" style={{ color: '#fff', fontSize: '1rem' }}>Ekibimizi Tanıyın</Link ></li>
                                <li><Link to="/haberler" style={{ color: '#fff', fontSize: '1rem' }} >Haberler ve Medya</Link></li>
                            </ul>
                        </div>
                    </Col>
                    <Col xs={12} md={3} className="contact" style={{ marginBottom: '20px' }}>
                        <div>
                            <h4
                                style={{
                                    color: colors.blueAccent[500],
                                    fontWeight: 'bold',
                                    fontSize: '1.4rem'
                                }}>
                                İletişim</h4>
                            <p style={{ fontSize: '1rem' }}>+ 90 (228) ( 314 ) 6056</p>
                            <p style={{ fontSize: '1rem' }}>hrmhub@gmail.com</p>
                            <p style={{ fontSize: '1rem' }}>88 Broklyn Golden Road Street New York. ABD</p>
                        </div>
                    </Col>
                </Row>
                <Row className='footer-end'>
                    <p
                        style={{
                            fontFamily: "Source Sans Pro, sans-serif",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            textAlign: "center",
                            color: colors.grey[100],
                            marginTop: "30px"
                        }}>
                        &copy; {new Date().getFullYear()} HRHub. Tüm Hakları Saklıdır.
                    </p>
                </Row>
            </Container>
        </footer >
    );
}

export default CustomFooter;
