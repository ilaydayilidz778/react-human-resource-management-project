import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row } from 'react-bootstrap';
import { Box, useTheme } from "@mui/material";
import { Formik } from 'formik';
import { request } from '../../../constants/constants';
import { tokens } from "../../../scripst/theme";
import { toast } from 'react-toastify';
import axios from 'axios';

const PermissionRequestFormModal = ({
    showModal,
    setShowModal,
    user,
    allPermissions,
}) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [permissionTypes, setPermissionTypes] = useState(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        if (user) {
            getPermissionTypes();
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

    const getPermissionTypes = async () => {
        try {
            const response = await axios.get(`${request}/api/IzinTuru`);
            console.log(response.data);
            setPermissionTypes(response.data);
        } catch (error) {
            console.error("Permission Types:", error);
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
            const response = await axios.post(`${request}/api/Izin/Ekle`, {
                id: values.id,
                userId: user?.id,
                permissionStartDate: values.permissionStartDate,
                permissionEndDate: values.permissionEndDate,
                permissionType: values.permissionType,
                documentName: base64String,
            });
            if (response.status === 200) {
                setShowModal(false);
                toast.success("Kullanıcı izin isteği başarıyla oluşturuldu.");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch (error) {
            console.error("İzin eklenirken bir hata oluştu:", error);
            toast.error("Kullanıcı izin isteği oluşturulurken bir hata oluştu.");
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
                        fontWeight: "bold"
                    }}>
                    İZİN TALEP FORMU</Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    background: `${colors.primary[700]}`
                }}
            >
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={{
                        permissionType: '',
                        permissionStartDate: '',
                        permissionEndDate: '',
                        numberOfDays: '',
                        documentName: '',
                    }}
                    validate={(values) => {
                        const errors = {};

                        // İzin Validasyonları
                        if (values.permissionType === "") {
                            errors.permissionType = 'İzin türü alanı zorunludur.';
                        }

                        // Seçilen tarihlerin kontrolü
                        const today = new Date();
                        const startDate = new Date(values.permissionStartDate);
                        const endDate = new Date(values.permissionEndDate);

                        if (!values.permissionStartDate) {
                            errors.permissionStartDate = 'İzin başlangıç tarihi alanı zorunludur.';
                        } else if (startDate < today) {
                            errors.permissionStartDate = 'Başlangıç tarihi bugünün tarihinden geri bir tarih olamaz.';
                        }

                        if (!values.permissionEndDate) {
                            errors.permissionEndDate = 'İzin bitiş tarihi alanı zorunludur.';
                        } else if (startDate > endDate) {
                            errors.permissionEndDate = 'Bitiş tarihi başlangıç tarihinden ileri bir tarih olmalıdır.';
                        }

                        //  Aynı tarih aralığında başka bir izin var mı kontrolü
                        function findCommonDates(start1, end1, start2, end2) {
                            let currentDate = new Date(start1);
                            console.log(currentDate);
                            let endDate1 = new Date(end1);
                            let startDate2 = new Date(start2);
                            let endDate2 = new Date(end2);

                            while (currentDate <= endDate1) {
                                let currentDay = new Date(currentDate);
                                currentDay.setHours(0, 0, 0, 0);
                                if (currentDay >= startDate2 && currentDay <= endDate2) {
                                    return true;
                                }
                                currentDate.setDate(currentDate.getDate() + 1);
                            }
                            return false;
                        }
                        console.log(allPermissions);
                        allPermissions.forEach(permission => {
                            if (findCommonDates(startDate, endDate, permission.izinBaslangicTarihi
                                , permission.izinBitisTarihi
                            )) {
                                errors.permissionEndDate = 'Belirtilen tarih aralığında izin talebiniz bulunmaktadır.';
                                console.log("if");
                            }
                            else {
                                console.log("else");
                            }
                        });

                        // İzin süresi kontrolü
                        const permissionType = permissionTypes.find(type => type.ad === values.permissionType);
                        if (permissionType) {
                            const maxPermissionDays = permissionType.izinSuresi;
                            //getTime() metodu Unix zaman damgası olarak milisaniye cinsinden traih ve saat değeri döndürür.
                            const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                            if (maxPermissionDays !== null && diffDays > maxPermissionDays) {
                                errors.permissionEndDate = `İzin süresi ${maxPermissionDays} günden fazla olamaz.`;
                            }

                            // Yıllık İzin Kontrolü
                            if (permissionType.ad === "Yıllık") {
                                const maxPermissionDays = user.kalanYillikIzin;
                                if (diffDays > maxPermissionDays) {
                                    errors.permissionEndDate = `İzin süresi yıllık izin hakkınızı aşmamalıdır. Kalan yıllık izin hakkınız: ${user.kalanYillikIzin} gündür.`;
                                }
                            }
                        }


                        // Belge Yükleme Kontrolü
                        if ((values.permissionType === "Doğum" || values.permissionType === "Hastalık") && !file) {
                            errors.documentName = 'Belge yükleme zorunludur.';
                        }

                        return errors;
                    }}
                >
                    {({ values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="permissionType">
                                <Form.Label>İzin Türü</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={handleChange}
                                    value={values.permissionType}
                                    name="permissionType"
                                    isInvalid={touched.permissionType && errors.permissionType}
                                    style={{
                                        background: `${colors.primary[500]}`,
                                        border: `1px solid ${colors.primary[400]}`,
                                        color: "#ffffff",
                                        borderRadius: '0',
                                        marginBottom: "15px"
                                    }}>
                                    <option value="">İzin Türü Seçin</option>
                                    {permissionTypes.map(permissionType => {
                                        // "Babalık" iznini kadın kullanıcılar için ve "Doğum" iznini erkek kullanıcılar için kaldır
                                        if ((user.gender === "Kadın" && permissionType.ad === "Babalık") || (user.gender === "Erkek" && permissionType.ad === "Doğum")) {
                                            return null;
                                        }
                                        return (
                                            <option key={permissionType.id} value={permissionType.ad}>{permissionType.ad}</option>
                                        );
                                    })}
                                </Form.Control>
                                <Form.Control.Feedback
                                    style={{
                                        fontSize: '14px',
                                        marginBottom: '5px'
                                    }}
                                    type="invalid">{errors.permissionType}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="permissionStartDate">
                                <Form.Label>Başlangıç Tarihi</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="permissionStartDate"
                                    value={values.permissionStartDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.permissionStartDate && errors.permissionStartDate}
                                    style={{
                                        background: `${colors.primary[500]}`,
                                        border: `1px solid ${colors.primary[400]}`,
                                        color: "#ffffff",
                                        borderRadius: '0',
                                        marginBottom: "15px"
                                    }}
                                />
                                <Form.Control.Feedback
                                    style={{
                                        fontSize: '14px',
                                        marginBottom: '5px'
                                    }}
                                    type="invalid">{errors.permissionStartDate}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="permissionEndDate">
                                <Form.Label>Bitiş Tarihi</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="permissionEndDate"
                                    value={values.permissionEndDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.permissionEndDate && errors.permissionEndDate}
                                    style={{
                                        background: `${colors.primary[500]}`,
                                        border: `1px solid ${colors.primary[400]}`,
                                        color: "#ffffff",
                                        borderRadius: '0',
                                        marginBottom: "15px"
                                    }}
                                />
                                <Form.Control.Feedback
                                    style={{
                                        fontSize: '14px',
                                        marginBottom: '5px'
                                    }}
                                    type="invalid">{errors.permissionEndDate}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Dosya Yükleme */}
                            <Form.Group controlId="documentName">
                                <Form.Label>Dosya Yükle</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="documentName"
                                    value={values.documentName}
                                    onChange={(e) => { setFile(e.target.files[0]) }}
                                    onBlur={handleBlur}
                                    isInvalid={touched.documentName && errors.documentName}
                                    style={{
                                        background: `${colors.primary[500]}`,
                                        border: `1px solid ${colors.primary[400]}`,
                                        color: "#ffffff",
                                        borderRadius: '0',
                                        marginBottom: "20px"
                                    }}
                                />
                                <Form.Control.Feedback
                                    style={{
                                        fontSize: '14px',
                                        marginBottom: '5px'
                                    }}
                                    type="invalid">{errors.documentName}</Form.Control.Feedback>
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
                                <Button type="submit"
                                    style={{
                                        backgroundColor: colors.blueAccent[700],
                                        marginTop: '20px',
                                        border: 'none',
                                        borderRadius: '0'
                                    }}>
                                    İzin Talebi Oluştur
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
}

export default PermissionRequestFormModal;
