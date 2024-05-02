import React, { useState, useEffect } from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, useTheme } from "@mui/material";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';
import { request } from '../../../constants/constants';

const ExpenseRequestFormModal = ({
    showModal,
    setShowModal,
    user,
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [expenseTypes, setExpenseTypes] = useState(null);
    const [currencyTypes, setCurrencyTypes] = useState(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        if (user) {
            getExpenseTypes();
            getCurrencyTypes();
        }
    }, [user]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(file);
        }
    }, [file]);

    const getExpenseTypes = async () => {
        try {
            const response = await axios.get(`${request}/api/HarcamaTuru`);
            setExpenseTypes(response.data);
            console.log(response.data)
        } catch (error) {
            console.error(`Error fetching expense types data: ${error}`);
        }
    };

    const getCurrencyTypes = async () => {
        try {
            const response = await axios.get(`${request}/api/ParaBirimi`);
            setCurrencyTypes(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(`Error fetching advance types data: ${error}`);
        }
    };

    const fileToByteArray = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });
        return btoa(binary);
    }


    const handleFormSubmit = async (values) => {
        try {
            let base64String = "";
            if (file) {
                const byteArray = await fileToByteArray(file);
                base64String = arrayBufferToBase64(byteArray);
            }
            const response = await axios.post(`${request}/api/Harcama/Ekle`, {
                id: values.id,
                userId: user?.id,
                expenseType: values.expenseType,
                expenseCurrency: values.expenseCurrency,
                expenseAmount: values.expenseAmount,
                expenseFiles: base64String,
            });

            if (response.status === 200) {
                setShowModal(false);
                toast.success("Kullanıcı harcama isteği başarıyla oluşturuldu.");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                toast.error("Harcama talebi oluşturulurken bir hata oluştu.");
            }
        } catch (error) {
            console.error("An error occurred while creating the expense request:", error);
            toast.error("Harcama talebi oluşturulurken bir hata oluştu.");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }

        setShowModal(false);
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title
                    style={{
                        color: colors.blueAccent[700],
                        fontWeight: "bold",
                    }}>
                    HARCAMA TALEP FORMU
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    background: `${colors.primary[700]}`
                }}
            >
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={{
                        expenseType: '',
                        expenseAmount: '',
                        expenseCurrency: '',
                        expenseFiles: '',
                    }}

                    validate={(values) => {
                        const errors = {}
                        if (!values.expenseType) {
                            errors.expenseType = 'Harcama türü seçilmelidir.';
                        }
                        if (!values.expenseAmount || values.expenseAmount <= 0) {
                            errors.expenseAmount = 'Harcama tutarı girilmelidir ve 0\'den büyük olmalıdır.';
                        }
                        if (!values.expenseCurrency) {
                            errors.expenseCurrency = 'Para birimi seçilmelidir.';
                        }
                        return errors;
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            {/* Harcama Türü */}
                            <Form.Group as={Col} controlId="expenseType">
                                <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '0.9rem' }}>Harcama Türü</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="expenseType"
                                    value={values.expenseType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.expenseType && errors.expenseType}
                                    style={{
                                        background: `${colors.primary[500]}`,
                                        border: `1px solid ${colors.primary[400]}`,
                                        color: "#ffffff",
                                        borderRadius: '0',
                                        marginBottom: "10px",
                                    }}
                                >
                                    <option value="">Harcama Türü Seçin</option>
                                    {expenseTypes.map((type) => (
                                        <option key={type.id} value={type.ad}>
                                            {type.ad}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback
                                    style={{
                                        fontSize: '14px',
                                        marginBottom: '10px'
                                    }}
                                    type="invalid">{errors.expenseType}</Form.Control.Feedback>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    {/* Harcama Tutarı */}
                                    <Form.Group controlId="expenseAmount">
                                        <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '0.9rem' }}>Harcama Tutarı</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="expenseAmount"
                                            value={values.expenseAmount}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.expenseAmount && errors.expenseAmount}
                                            style={{
                                                background: `${colors.primary[500]}`,
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                                marginBottom: "10px",
                                            }}
                                        />
                                        <Form.Control.Feedback
                                            style={{
                                                fontSize: '14px',
                                                marginBottom: '10px'
                                            }}
                                            type="invalid">{errors.expenseAmount}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    {/* Harcama Para Birimi */}
                                    <Form.Group controlId="expenseCurrency">
                                        <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '0.9rem' }}>Para Birimi</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="expenseCurrency"
                                            value={values.expenseCurrency}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.expenseCurrency && errors.expenseCurrency}
                                            style={{
                                                background: `${colors.primary[500]}`,
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <option value="">Para Birimi Seçin</option>
                                            {currencyTypes.map((type) => (
                                                <option key={type.id} value={type.ad}>
                                                    {type.ad}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        <Form.Control.Feedback
                                            style={{
                                                fontSize: '14px',
                                                marginBottom: '10px'
                                            }}
                                            type="invalid">{errors.expenseCurrency}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                            </Row>

                            {/* Harcama Belgeleri */}
                            <Form.Group controlId="file">
                                <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '0.9rem' }}>Dosya Yükle</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{
                                        background: `${colors.primary[500]}`,
                                        border: `1px solid ${colors.primary[400]}`,
                                        color: "#ffffff",
                                        borderRadius: '0',
                                        marginBottom: "10px",
                                    }}
                                />
                                <Form.Control.Feedback
                                    style={{
                                        fontSize: '14px',
                                        marginBottom: '10px'
                                    }}
                                    type="invalid">{errors.expenseFiles}</Form.Control.Feedback>
                            </Form.Group>
                            {filePreview &&
                                <Row>
                                    <embed
                                        id="embed"
                                        // src={`data:application/pdf;base64,${base64String}`}
                                        src={filePreview}
                                        type="application/pdf"
                                        width="100%"
                                        height="600px"
                                    />
                                </Row>}
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginTop: '20px',
                                    marginBottom: '20px'
                                }}>
                                <Button
                                    type="submit"
                                    style={{
                                        backgroundColor: colors.blueAccent[700],
                                        border: 'none',
                                        borderRadius: '0'
                                    }}
                                >
                                    Harcama Talebi Oluştur
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ExpenseRequestFormModal;
