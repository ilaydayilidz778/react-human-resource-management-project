import React from 'react';
import { Container, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../scripst/theme";
import PhoneCall from '../../../public/images/Phone-Call.png';
import Mail from '../../../public/images/Mail.png';
import Location from '../../../public/images/Location.png';
import ContactUsPage from "../../../public/images/ContactUsPage.png";

const cardData = [
    {
        title: 'Telefon',
        text: '+ 90 (228) ( 314 ) 6056',
        iconSrc: PhoneCall
    },
    {
        title: 'E-posta',
        text: 'hrmhub@gmail.com',
        iconSrc: Mail
    },
    {
        title: 'Adres',
        text: '88 Broklyn Golden Road Street New York. ABD',
        iconSrc: Location
    },
];

const ContactContent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Ad alanı gereklidir'),
        email: Yup.string()
            .email('Geçerli bir e-posta adresi girin')
            .required('E-posta alanı gereklidir'),
        subject: Yup.string()
            .required('Konu alanı gereklidir'),
        message: Yup.string()
            .required('Mesaj alanı gereklidir'),
    });

    const handleSubmit = (values) => {
        console.log('Form values:', values);
    };

    return (
        <Container
            style={{
                marginTop: "2rem"
            }}>
            <Row className="justify-content-center">
                {cardData.map((card, index) => (
                    <Col key={index} xs={12} md={4} className='mb-5'>
                        <Card className="mb-2"
                            style={{
                                borderRadius: '0',
                                border: `none`,
                            }}>
                            <Card.Body
                                style={{
                                    background: colors.primary[600],
                                    textAlign: 'center'
                                }}>
                                <Image
                                    src={card.iconSrc}
                                    alt={`${card.title} icon`}
                                    style={{ width: '50px', height: '50px', marginBottom: '10px' }}
                                />
                                <Card.Title
                                    style={{
                                        color: colors.blueAccent[500],
                                        fontWeight: "bold",
                                        fontSize: "1.4rem"
                                    }}>
                                    {card.title}</Card.Title>
                                <Card.Text
                                    style={{
                                        color: colors.blueAccent[500],
                                        fontWeight: "bold",
                                    }}>
                                    {card.text}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row>
                <Col xs={12} md={6} className='mb-5'>
                    <Card
                        style={{
                            background: colors.primary[600],
                            borderRadius: '0',
                            padding: '20px',
                        }}>
                        <h2 className='fw-bold'
                            style={{
                                color: colors.greenAccent[500],
                                marginTop: "0.8rem",
                                marginBottom: "2rem",
                                borderBottom: `2px solid ${colors.greenAccent[400]}`,
                                fontSize: "2rem",
                                width: '100%',
                            }}>
                            Bizimle İletişime Geçin
                        </h2>
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                subject: '',
                                message: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="name" className="mb-3">
                                        <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1.2rem', fontWeight: 'bold' }}>Ad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.name && errors.name}
                                            style={{
                                                background: `${colors.primary[700]}`,
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                                marginBottom: "10px",
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="email" className="mb-3">
                                        <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1.2rem', fontWeight: 'bold' }}>E-posta</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.email && errors.email}
                                            style={{
                                                background: `${colors.primary[700]}`,
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                                marginBottom: "10px",
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="subject" className="mb-3">
                                        <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1.2rem', fontWeight: 'bold' }}>Konu</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subject"
                                            value={values.subject}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.subject && errors.subject}
                                            style={{
                                                background: `${colors.primary[700]}`,
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                                marginBottom: "10px",
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="message" className="mb-3">
                                        <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1.2rem', fontWeight: 'bold' }}>Mesaj</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="message"
                                            value={values.message}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.message && errors.message}
                                            style={{
                                                background: `${colors.primary[700]}`,
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                                marginBottom: "10px",
                                            }}
                                        />
                                    </Form.Group>

                                    <Box
                                        style={{
                                            width: '100%',
                                            marginTop: '20px',
                                            marginBottom: '20px'
                                        }}>
                                        <Button
                                            type="submit"
                                            style={{
                                                backgroundColor: colors.greenAccent[600],
                                                border: 'none',
                                                borderRadius: '0',
                                                fontWeight: 'bold',
                                                width: '100%',
                                            }}>
                                            Gönder
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Image src={ContactUsPage} alt="Resim" style={{ width: '100%' }} />
                </Col>
            </Row>
        </Container>
    );
};

export default ContactContent;
