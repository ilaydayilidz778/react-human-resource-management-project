import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { tokens } from "../../scripst/theme";
import { useTheme } from '@mui/material';
import { Formik } from 'formik';
import axios from 'axios';
import { request } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';

const PasswordSetting = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const initialValues = {
        newPassword: '',
        confirmNewPassword: ''
    };


    const handleFormSubmit = async (values, actions) => {
        const token = new URLSearchParams(location.search).get('token');
        console.log(token)
        try {
            await axios.put(request + '/api/Parola', {
                token: token,
                newPassword: values.newPassword
            });
            toast.success('Yeni şifre başarıyla oluşturuldu. Mailde belirtilen kullanıcı adı ve belirlediğiniz yeni şifre ile giriş yapabilirsiniz.');
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Şifre değiştirme işlemi başarısız oldu.');
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
        actions.setSubmitting(false);
    };

    return (
        <Box m="20px">
            <Formik
                initialValues={initialValues}
                validate={(values) => {
                    const errors = {}

                    // Yeni şifre alanı kontrolü
                    if (!values.newPassword) {
                        errors.newPassword = 'Yeni şifre alanı zorunludur.';
                    }
                    else if (values.newPassword.length < 8) {
                        errors.newPassword = 'Şifre en az 8 karakter olmalıdır.';
                    }
                    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(values.newPassword)) {
                        errors.newPassword = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.';
                    }
                    // Yeni şifre tekrar alanı kontrolü
                    if (!values.confirmNewPassword) {
                        errors.confirmNewPassword = 'Yeni şifreyi tekrar girin';
                    }
                    else if (values.confirmNewPassword !== values.newPassword) {
                        errors.confirmNewPassword = 'Şifreler eşleşmiyor.'
                    }

                    return errors;
                }}
                onSubmit={handleFormSubmit}
            >
                {({ values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting }) => (
                    <Card
                        style={{
                            background: `${colors.primary[500]}`,
                            width: '400px',
                            color: `${colors.grey[800]}`,
                            border: `1px solid ${colors.greenAccent[800]}`,
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '20px',
                            borderRadius: '0'
                        }}
                    >
                        <Card.Body>
                            <h2
                                className="text-center mb-4"
                                style={{
                                    color: "#4908fb",
                                }}>Yeni Şifre Belirleme
                            </h2>
                            <hr style={{ borderTop: `1px solid ${colors.grey[500]}`, marginBottom: '20px' }} />
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="newPassword">
                                    <Form.Label
                                        style={{
                                            color: "#fff",
                                            marginTop: '10px',
                                        }}>
                                        Yeni Şifre
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Yeni şifrenizi girin"
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="newPassword"
                                        isInvalid={touched.newPassword && errors.newPassword}
                                        style={{
                                            color: " #4908fb",
                                            borderRadius: '0'
                                        }}
                                        required
                                    />
                                    <Form.Control.Feedback
                                        style={{
                                            fontSize: '14px',
                                            marginBottom: '5px'
                                        }}
                                        type="invalid">{errors.newPassword}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="confirmNewPassword">
                                    <Form.Label
                                        style={{
                                            color: "#fff",
                                            marginTop: '10px',
                                        }}>
                                        Yeni Şifre Tekrar
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Yeni şifrenizi tekrar girin"
                                        value={values.confirmNewPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.confirmNewPassword && errors.confirmNewPassword}
                                        name="confirmNewPassword"
                                        style={{
                                            color: " #4908fb",
                                            borderRadius: '0'
                                        }}
                                        required
                                    />
                                    <Form.Control.Feedback
                                        style={{
                                            fontSize: '14px',
                                            marginBottom: '5px'
                                        }}
                                        type="invalid">{errors.confirmNewPassword}</Form.Control.Feedback>
                                </Form.Group>
                                <Button
                                    type='submit'
                                    style={{
                                        backgroundColor: colors.blueAccent[500],
                                        width: '100%',
                                        marginTop: '30px',
                                        border: 'none',
                                        borderRadius: '0',
                                    }}
                                    disabled={isSubmitting} >
                                    Şifreyi Değiştir
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                )}
            </Formik>
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
        </Box>
    );
};

export default PasswordSetting;
