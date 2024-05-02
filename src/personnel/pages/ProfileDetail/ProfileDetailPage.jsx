import React, { useState, useEffect } from 'react';
import { tokens } from "../../../scripst/theme";
import { useTheme, Typography } from '@mui/material';
import { Formik } from "formik";
import { Row, Col, Button, Form, Card, Image } from 'react-bootstrap';
import { Input, Box } from "@mui/material";
import Header from '../../../components/Header/Header';
import axios from 'axios';
import { request } from '../../../constants/constants';
import { toast, ToastContainer } from 'react-toastify';



const ProfileDetailPage = ({ user, setUser }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const putUrl = request + "/api/FirmaSahibi/id?id=" + user?.id;

    const fileToByteArray = (imageFile) => {
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
            reader.readAsArrayBuffer(imageFile);
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
            if (imageFile) {
                const byteArray = await fileToByteArray(imageFile);
                base64String = arrayBufferToBase64(byteArray);
            }

            const response = await axios.put(putUrl, {
                id: values.id,
                contact: values.contact,
                address: values.address.replace(/\s+/g, ' ').trim(),
                photoByte: base64String
            });

            if (response.status === 200) {
                const updatedUser = { ...user, photoByte: base64String };
                setUser(updatedUser);
                console.log(updatedUser);
                toast.success("Yapılan değişiklikler başarıya güncellenmiştir.");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                toast.error("Yapılan değişiklikler güncellenirken bir hata oluştu.");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch (error) {
            console.error("Failed to update user data:", error);
        }

    };

    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            setImagePreview(null);
        }
    }, [imageFile]);

    return (
        <Box m="20px">
            <Header title="PROFİL DETAY"
                subtitle="Profiliniz ile ilgi fotoğraf, telefon numarası ve adres biligileri güncellemelerini yapabilirsiniz." />

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

            <Card
                style={{
                    background: `${colors.primary[600]}`,
                    color: `${colors.grey[800]}`,
                    border: `1px solid ${colors.grey[100]}`,
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: '15px',
                    borderRadius: '0'
                }}
            >
                <Card.Body>
                    {user !== null && (
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={{
                                id: user.id || "",
                                photoByte: user.photoByte || "",
                                firstName: user.firstName || "",
                                secondName: user.secondName || "",
                                lastName: user.lastName || "",
                                secondLastName: user.secondLastName || "",
                                identityNumber: user.identityNumber || "",
                                email: user.email || "",
                                contact: user.contact || "",
                                address: user.address || "",
                                birthDate: user.birthDate || "",
                                birthPlace: user.birthPlace || "",
                                companyName: user.companyName || "",
                                department: user.department || "",
                                job: user.job || "",
                                dateOfRecruitment: user.dateOfRecruitment || "",
                                dateOfDismissal: user.dateOfDismissal || "",
                                salaryType: user.salaryType || "",
                                salary: user.salary || "",
                            }}

                            validate={(values) => {
                                const errors = {};

                                // Telefon Numarası Formatı 
                                const phoneRegExp =
                                    /^(\+90|0)?\s*(\(\d{3}\)[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}|\(\d{3}\)[\s-]*\d{3}[\s-]*\d{4}|\(\d{3}\)[\s-]*\d{7}|\d{3}[\s-]*\d{3}[\s-]*\d{4}|\d{3}[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2})$/;

                                // Telefon Numarası alanı için kontrol
                                if (!values.contact) {
                                    errors.contact = 'Telefon numarası alanı zorunludur.'
                                }
                                else if (!phoneRegExp.test(values.contact)) {
                                    errors.contact = 'Geçerli bir telefon numarası giriniz.';
                                }

                                // Adres alanı için kontrol
                                if (!values.address) {
                                    errors.address = 'Adres alanı zorunludur';
                                } else if (values.address.length < 10) {
                                    errors.address = 'Adres en az 10 karakter olmalıdır';
                                } else if (values.address.length > 100) {
                                    errors.address = 'Adres en fazla 100 karakter olmalıdır';
                                }

                                // Fotoğraf alanı için kontrol
                                if (!values.photoByte) {
                                    errors.address = 'Fotoğraf alanı zorunludur';
                                }

                                return errors;
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                            }) => (
                                <Form onSubmit={handleSubmit}>
                                    {/* Kişisel Bilgiler */}
                                    <Row className="mb-3">
                                        <Col>
                                            <Typography
                                                variant="h3"
                                                color={colors.greenAccent[400]}
                                                fontWeight="bold"
                                                sx={{
                                                    borderBottom: `2px solid ${colors.greenAccent[400]}`,
                                                    m: "0 0 5px 0"
                                                }}
                                            >
                                                KİŞİSEL BİLGİLER
                                            </Typography>
                                        </Col>
                                    </Row>
                                    <Input sx={{ gridColumn: "span 4" }} type='hidden' value={values.id} />
                                    <Row className="mb-3">
                                        <Col md={3}>

                                            {imagePreview ? ( // imagePreview dolu ise
                                                <Image
                                                    src={imagePreview}
                                                    alt="Profile Picture"
                                                    style={{ width: '181px', height: '181px', objectFit: 'cover', borderRadius: '50%' }}
                                                />
                                            ) : (
                                                <Image
                                                    src={`data:image/jpg;base64,${user?.photoByte}`}
                                                    alt="Profile Picture"
                                                    style={{ width: '181px', height: '181px', objectFit: 'cover', borderRadius: '50%' }}
                                                />
                                            )}

                                            <Form.Group controlId="formFile" className="mt-3">
                                                <Form.Control type="file"
                                                    accept='image/*'
                                                    onChange={(event) => {
                                                        const selectedFile = event.target.files[0];
                                                        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
                                                        if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                                                            toast.error("Lütfen geçerli bir resim dosyası seçiniz (JPG, PNG veya JPEG formatında).");
                                                            setImageFile(null);
                                                            return;
                                                        }
                                                        setImageFile(selectedFile);
                                                    }}
                                                    isInvalid={touched.photoByte && errors.photoByte}
                                                    style={{
                                                        background: `${colors.primary[500]}`,
                                                        border: `1px solid ${colors.primary[400]}`,
                                                        color: "#ffffff",
                                                        borderRadius: '0',
                                                        marginTop: '23px'
                                                    }} />
                                                <Form.Control.Feedback
                                                    style={{
                                                        fontSize: '14px',
                                                        marginBottom: '5px'
                                                    }}
                                                    type="invalid">{errors.photoByte}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="firstName">
                                                    <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Ad</Form.Label>
                                                    <Form.Control type="text"
                                                        onChange={handleChange}
                                                        value={values.firstName}
                                                        name="firstName"
                                                        style={{
                                                            background: `${colors.primary[500]}`,
                                                            border: `1px solid ${colors.primary[400]}`,
                                                            color: "#ffffff",
                                                            borderRadius: '0'
                                                        }}
                                                        disabled />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="secondName">
                                                    <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>İkinci Ad</Form.Label>
                                                    <Form.Control type="text"
                                                        onChange={handleChange}
                                                        value={values.secondName}
                                                        name="secondName"
                                                        style={{
                                                            background: `${colors.primary[500]}`,
                                                            border: `1px solid ${colors.primary[400]}`,
                                                            color: "#ffffff",
                                                            borderRadius: '0'
                                                        }}
                                                        disabled />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="lastName">
                                                    <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Soyad</Form.Label>
                                                    <Form.Control type="text"
                                                        onChange={handleChange}
                                                        value={values.lastName}
                                                        name="lastName"
                                                        style={{
                                                            background: `${colors.primary[500]}`,
                                                            border: `1px solid ${colors.primary[400]}`,
                                                            color: "#ffffff",
                                                            borderRadius: '0'
                                                        }}
                                                        disabled />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="secondLastName">
                                                    <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>İkinci Soyad</Form.Label>
                                                    <Form.Control type="text"
                                                        onChange={handleChange}
                                                        value={values.secondLastName}
                                                        name="secondLastName"
                                                        style={{
                                                            background: `${colors.primary[500]}`,
                                                            border: `1px solid ${colors.primary[400]}`,
                                                            color: "#ffffff",
                                                            borderRadius: '0'
                                                        }}
                                                        disabled />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="identityNumber">
                                                    <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Kimlik Numarası</Form.Label>
                                                    <Form.Control type="text"
                                                        onChange={handleChange}
                                                        value={values.identityNumber}
                                                        name="identityNumber"
                                                        style={{
                                                            background: `${colors.primary[500]}`,
                                                            border: `1px solid ${colors.primary[400]}`,
                                                            color: "#ffffff",
                                                            borderRadius: '0'
                                                        }}
                                                        disabled />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="birthDate">
                                                    <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Doğum Tarihi</Form.Label>
                                                    <Form.Control type="date"
                                                        onChange={handleChange}
                                                        value={values.birthDate}
                                                        name="birthDate"
                                                        style={{
                                                            background: `${colors.primary[500]}`,
                                                            border: `1px solid ${colors.primary[400]}`,
                                                            color: "#ffffff",
                                                            borderRadius: '0'
                                                        }}
                                                        disabled />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="birthPlace">
                                                    <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Doğum Yeri</Form.Label>
                                                    <Form.Control type="text"
                                                        onChange={handleChange}
                                                        value={values.birthPlace}
                                                        name="birthPlace"
                                                        style={{
                                                            background: `${colors.primary[500]}`,
                                                            border: `1px solid ${colors.primary[400]}`,
                                                            color: "#ffffff",
                                                            borderRadius: '0'
                                                        }}
                                                        disabled />
                                                </Form.Group>
                                            </Row>

                                        </Col>
                                    </Row>
                                    {/* İletişim Bilgileri */}
                                    <Row className="mb-3">
                                        <Col>
                                            <Typography
                                                variant="h3"
                                                color={colors.greenAccent[400]}
                                                fontWeight="bold"
                                                sx={{
                                                    borderBottom: `2px solid ${colors.greenAccent[400]}`,
                                                    m: "0 0 5px 0"
                                                }}
                                            >
                                                İLETİŞİM BİLGİLERİ
                                            </Typography>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="contact">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Telefon Numarası</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact"
                                                value={values.contact}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.contact && errors.contact}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback
                                                style={{
                                                    fontSize: '14px',
                                                    marginBottom: '5px'
                                                }}
                                                type="invalid">{errors.contact}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="email">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Email</Form.Label>
                                            <Form.Control
                                                type="text"
                                                onChange={handleChange}
                                                value={values.email}
                                                name="contact"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}
                                                disabled />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="address">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Adres</Form.Label>
                                            <Form.Control
                                                as="textarea" rows={3}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.address && errors.address}
                                                value={values.address}
                                                name="address"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback
                                                style={{
                                                    fontSize: '14px',
                                                    marginBottom: '5px'
                                                }}
                                                type="invalid">{errors.address}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    {/* Şirket Bilgileri */}
                                    <Row className="mb-3">
                                        <Col>
                                            <Typography
                                                variant="h3"
                                                color={colors.greenAccent[400]}
                                                fontWeight="bold"
                                                sx={{
                                                    borderBottom: `2px solid ${colors.greenAccent[400]}`,
                                                    m: "0 0 5px 0"
                                                }}
                                            >
                                                ŞİRKET BİLGİLERİ
                                            </Typography>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="companyName">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Şirket Adı</Form.Label>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.companyName}
                                                name="companyName"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}
                                                disabled />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="department">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Departman</Form.Label>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.department}
                                                name="department"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}
                                                disabled />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="job">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Meslek</Form.Label>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.job}
                                                name="job"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}
                                                disabled />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="dateOfRecruitment">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>İşe Giriş Tarihi</Form.Label>
                                            <Form.Control type="date"
                                                onChange={handleChange}
                                                value={values.dateOfRecruitment}
                                                name="dateOfRecruitment"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}
                                                disabled />

                                        </Form.Group>
                                        <Form.Group as={Col} controlId="dateOfDismissal">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>İşten Çıkış Tarihi</Form.Label>
                                            <Form.Control type="date"
                                                onChange={handleChange}
                                                value={values.dateOfDismissal}
                                                name="dateOfDismissal"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}
                                                disabled />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="salaryType">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Maaş Tipi</Form.Label>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.salaryType}
                                                name="salaryType"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}
                                                disabled />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="salary">
                                            <Form.Label style={{ color: `${colors.greenAccent[400]}`, fontSize: '1rem' }}>Maaş Bilgisi</Form.Label>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.salary}
                                                name="salary"
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}
                                                disabled />
                                        </Form.Group>
                                    </Row>
                                    <Button
                                        type='submit'
                                        style={{
                                            backgroundColor: colors.blueAccent[500],
                                            marginTop: '10px',
                                            border: 'none',
                                            borderRadius: '0',
                                        }}>
                                        Değişiklikleri Kaydet
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                    )}
                </Card.Body>
            </Card>
        </Box>
    );
}

export default ProfileDetailPage;
