import React, { useState } from 'react';
import { tokens } from "../../scripst/theme";
import { Box, useTheme } from '@mui/material';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import axios from 'axios';
import { request } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Login = ({ setUser }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const initialValues = {
        password: ''
    };

    const setCookie = (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    const handleFormSubmit = async (values) => {
        console.log(values);
        try {
            const response = await axios.post(`${request}/api/Kullanici/login`, {
                username: email,
                password: values.password,
            });
            console.log(response.data);
            if (response.status === 200) {
                console.log("Kullanıcı girişi başarılı : " + response.data);
                setUser(response.data);
                toast.success("Kullanıcı girişi başarılı");

                setCookie("loginTokenCookie", response.data.loginToken, 1)
                if (response.data.role === "Firma Sahibi") {
                    setTimeout(() => {
                        navigate("/companymanager");
                    }, 3000);
                }
                else if (response.data.role === "Personel") {
                    setTimeout(() => {
                        navigate("/personnel");
                    }, 3000);
                }
            }
            else if (response.status === 400) {
                console.log("Kullanıcı girişi başarısız. Kullanıcı adı veya Şifre hatalı. Yeniden giriş yapmayı deneyiniz.")
            }
            else {
                console.log("Kullanıcı girişi başarısız. Kullanıcı adı veya Şifre hatalı. Yeniden giriş yapmayı deneyiniz.")

            }
        } catch (error) {

            toast.error("Kullanıcı girişi başarısız. Kullanıcı adı veya Şifre hatalı. Yeniden giriş yapmayı deneyiniz.");
            console.error('Error:', error);
        }
    };

    const sendResetPasswordEmail = async () => {
        try {
            const response = await axios.post(request + "/api/Parola?username=" + email);
            if (response.status === 200) {
                toast.success("Parola yenileme mailiniz iletilmiştir.");
            }
            else {
                toast.error("Parola yenileme maili iletilirken bir sorun oluştu.");
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setTimeout(() => {
            navigate("/login");
        }, 3000);
    }

    return (
        <Box
            style={{
                width: '100%',
                color: `${colors.grey[800]}`,
                padding: '2.4rem',
                borderRadius: '0'
            }}>
            <h5
                className="text-center mb-3"
                style={{
                    color: colors.greenAccent[600],
                    fontFamily: 'Source Sans Pro, sans-serif',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem'
                }}>
                Hoşgeldiniz
            </h5>
            <h5
                className="text-center mb-3"
                style={{
                    color: colors.greenAccent[600],
                    fontFamily: 'Source Sans Pro, sans-serif',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '3rem'
                }}>
                Hesabınıza Giriş Yapınız
            </h5>
            <hr style={{ borderTop: `1px solid ${colors.grey[400]}`, marginBottom: '2.4rem' }} />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <Formik
                initialValues={initialValues}
                onSubmit={handleFormSubmit}>
                {({ values,
                    handleChange,
                    handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label
                                style={{
                                    color: colors.greenAccent[600],
                                    fontFamily: 'Source Sans Pro, sans-serif',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                }}>
                                Kullanıcı Adı</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    background: `${colors.grey[100]}`,
                                    border: `1px solid ${colors.greenAccent[600]}`,
                                    borderRadius: '0.8rem',
                                    marginBottom: '3rem'
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label
                                style={{
                                    color: colors.greenAccent[600],
                                    fontFamily: 'Source Sans Pro, sans-serif',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold'
                                }}>Şifre</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                style={{
                                    background: `${colors.grey[100]}`,
                                    border: `1px solid ${colors.greenAccent[600]}`,
                                    borderRadius: '0.8rem',
                                    marginBottom: '2rem'
                                }}
                            />
                        </Form.Group>
                        <Button
                            type='button'
                            className="mt-3"
                            onClick={sendResetPasswordEmail}
                            style={{
                                background: 'rgba(0, 0, 0, 0)',
                                color: colors.greenAccent[600],
                                fontFamily: 'Source Sans Pro, sans-serif',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                marginBottom: '2rem',
                                border: `none`,
                                display: `flex`,
                                justifyContent: `flex-end`
                            }}>
                            ŞİFREMİ UNUTTUM?
                        </Button>
                        <Button
                            type="submit"
                            className="w-100 mt-3"
                            style={{
                                background: colors.greenAccent[600],
                                fontFamily: 'Source Sans Pro, sans-serif',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                marginTop: '2rem',
                                marginBottom: '2rem',
                                borderRadius: '5rem',
                                border: `1px solid ${colors.greenAccent[600]}`
                            }}>
                            GİRİŞ YAP
                        </Button>

                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default Login;
