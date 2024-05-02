import React, { useState, useEffect } from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, useTheme } from "@mui/material";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { request } from '../../../constants/constants';

const AdvanceRequestFormModal = ({
    showModal,
    setShowModal,
    user,
}) => {
    // Tema ve renk ayarları
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Durum değişkenleri
    const [advanceTypes, setAdvanceTypes] = useState([]);
    const [currencyTypes, setCurrencyTypes] = useState([]);
    const [exchangeRate, setExchangeRate] = useState();
    const [advanceRequestConstraints, setAdvanceRequestConstraints] = useState([]);

    useEffect(() => {
        if (user) {
            getAdvanceTypes();
            getCurrencyTypes();
            getAdvanceRequestConstraints();
        }
    }, [user]);

    // Avans türlerini almak için fonksiyon
    const getAdvanceTypes = async () => {
        try {
            const response = await axios.get(`${request}/api/AvansTuru`);
            setAdvanceTypes(response.data);
        } catch (error) {
            console.error(`Error fetching advance types data: ${error}`);
        }
    };

    // Para birimlerini almak için fonksiyon
    const getCurrencyTypes = async () => {
        try {
            const response = await axios.get(`${request}/api/ParaBirimi`);
            setCurrencyTypes(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(`Error fetching advance types data: ${error}`);
        }
    };

    // Kur ile Talep Edilen Avans Miktarını Hesaplama
    const calculateAdvanceAmountWithExchangeRate = async (advanceAmount, ad) => {
        try {
            const response = await axios.get(' https://hasanadiguzel.com.tr/api/kurgetir');
            let c = currencyTypes.find(currencyType => currencyType.ad === ad)
            let exchangeRateData = response.data.TCMB_AnlikKurBilgileri.find(data => data.Isim === c.kod);
            setExchangeRate(exchangeRateData.ForexSelling * advanceAmount)

        } catch (error) {
            setExchangeRate(33 * advanceAmount);
        }
    }

    // Avans Talepleri İle İlgili Kısıtları getirmek için fonksiyon 
    const getAdvanceRequestConstraints = async () => {
        try {
            const response = await axios.get(`${request}/api/Avans/AvansKisitlari?id=${user?.id}`)
            setAdvanceRequestConstraints(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(`Error fetching advance request constraints data: ${error}`);
        }
    }

    const handleFormSubmit = async (values) => {
        try {
            const response = await axios.post(`${request}/api/Avans/Ekle`, {
                userId: user?.id,
                advanceType: values.advanceType,
                advanceAmount: values.advanceAmount,
                advanceCurrency: values.advanceCurrency,
                advanceDescription: values.advanceDescription
            });
            if (response.status === 200) {
                toast.success("Kullanıcı avans talebi başarıyla oluşturuldu.");
                setShowModal(false);
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch (error) {
            console.error("Avans talebi oluşturulurken bir hata oluştu:", error);
            toast.error("Avans talebi oluşturulurken bir hata oluştu.");
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
                    AVANS TALEP FORMU
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
                        advanceType: '',
                        advanceDescription: '',
                        advanceAmount: '',
                        advanceCurrency: '',
                    }}
                    validate={(values) => {
                        const errors = {}
                        if (!values.advanceType) {
                            errors.advanceType = "Lütfen bir avans türü seçiniz."
                        }
                        if (!values.advanceAmount) {
                            errors.advanceAmount = "Lütfen bir para tutarı giriniz."
                        } else if (values.advanceAmount <= 0) {
                            errors.advanceAmount = "Avans tutarı sıfırdan büyük olmalıdır.";
                        }

                        if (values.advanceType === "İş" && !values.advanceDescription) {
                            errors.advanceDescription = "İş avansı talep ederken lütfen bir açıklama giriniz."
                        }

                        if (values.advanceType === "Ücret") {
                            if (advanceRequestConstraints?.inMonth) {
                                errors.advanceType = "Bu ay içinde halihazırda bir avans talebiniz bulunmaktadır."
                            } else if (advanceRequestConstraints?.countInYear > 3) {
                                errors.advanceType = "Yıllık avans sınırınızı doldurdunuz. En fazla 3 ücret avansı alabilirsiniz."
                            }
                        }

                        if (!values.advanceCurrency) {
                            errors.advanceCurrency = "Para birimi seçiniz."
                        } else {
                            if (values.advanceType === "Ücret") {
                                if (values.advanceCurrency === "Türk Lirası") {
                                    if (values.advanceAmount > user?.salary) {
                                        errors.advanceAmount = "Talep edilen ücret avansı maaş tutarını aşamaz."
                                    }
                                } else {
                                    calculateAdvanceAmountWithExchangeRate(values.advanceAmount, values.advanceCurrency);
                                    if (exchangeRate > user?.salary) {
                                        errors.advanceAmount = "Talep edilen ücret avansı maaş tutarını aşamaz.";
                                    }
                                }
                            } else if (values.advanceType === "İş") {
                                if (values.advanceCurrency === "Türk Lirası") {
                                    if (values.advanceAmount > advanceRequestConstraints?.maximumWorkAdvance) {
                                        errors.advanceAmount = "Talep edilen iş avansı 50.000₺'den fazla olamaz."
                                    }
                                } else {
                                    calculateAdvanceAmountWithExchangeRate(values.advanceAmount, values.advanceCurrency);
                                    if (exchangeRate > advanceRequestConstraints?.maximumWorkAdvance) {
                                        errors.advanceAmount = "Talep edilen iş avansı 50000₺ fazla olamaz.";
                                    }
                                }
                            }
                        }
                        return errors;
                    }
                    }

                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            {/* Avans Türü */}
                            <Form.Group as={Col} controlId="advanceType">
                                <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '0.9rem' }}>Avans Türü</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="advanceType"
                                    value={values.advanceType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.advanceType && errors.advanceType}
                                    style={{
                                        background: `${colors.primary[500]}`,
                                        border: `1px solid ${colors.primary[400]}`,
                                        color: "#ffffff",
                                        borderRadius: '0',
                                        marginBottom: "10px",
                                    }}
                                >
                                    <option value="">Avans Türü Seçin</option>
                                    {advanceTypes.map((type) => (
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
                                    type="invalid">{errors.advanceType}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Avans Talep Açıklaması */}
                            <Form.Group as={Col} controlId="advanceDescription">
                                <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '0.9rem' }}>Avans Talebi Açıklaması</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="advanceDescription"
                                    value={values.advanceDescription}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.advanceDescription && errors.advanceDescription}
                                    style={{
                                        background: `${colors.primary[500]}`,
                                        border: `1px solid ${colors.primary[400]}`,
                                        color: "#ffffff",
                                        borderRadius: '0',
                                        marginBottom: "10px",
                                    }} />
                                <Form.Control.Feedback
                                    style={{
                                        fontSize: '14px',
                                        marginBottom: '5px'
                                    }}
                                    type="invalid">{errors.advanceDescription}</Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    {/* Avans Tutarı */}
                                    <Form.Group controlId="advanceAmount">
                                        <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '0.9rem' }}>Avans Tutarı</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="advanceAmount"
                                            value={values.advanceAmount}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.advanceAmount && errors.advanceAmount}
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
                                            type="invalid">{errors.advanceAmount}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    {/* Avans Para Birimi */}
                                    <Form.Group controlId="advanceCurrency">
                                        <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '0.9rem' }}>Para Birimi</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="advanceCurrency"
                                            value={values.advanceCurrency}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.advanceCurrency && errors.advanceCurrency}
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
                                            type="invalid">{errors.advanceCurrency}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
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
                                    Avans Talebi Oluştur
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default AdvanceRequestFormModal;
