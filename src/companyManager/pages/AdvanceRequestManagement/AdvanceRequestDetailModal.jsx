import React from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, Input, useTheme } from "@mui/material";
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { request } from '../../../constants/constants';

const AdvanceRequestDetailModal = ({
    selectedAdvance,
    setSelectedAdvance,
    showModal,
    setShowModal,
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Avans Talebini Onayla
    const handleApprovePermission = async (values) => {
        try {
            await axios.put(`${request}/api/Avans/Onay?id=${values.id}`);
            toast.success("Avans talebi başarıyla onaylandı!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error('Error approving permission:', error);
            toast.error("Avans talebi onaylanırken bir hata oluştu!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
        setShowModal(false);
        setSelectedAdvance(null);
    }

    // Avans Talebini Reddet
    const handleRejectPermission = async (values) => {
        try {
            await axios.put(`${request}/api/Avans/Red?id=${values.id}`);
            toast.success("Avans talebi başarıyla reddedildi!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('Error approving permission:', error);
            toast.error("Avans talebi reddedilirken bir hata oluştu!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
        setShowModal(false);
        setSelectedAdvance(null);
    }

    return (
        <Box m="20px">
            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title
                        style={{
                            color: colors.blueAccent[700],
                            fontWeight: "bold"
                        }}>
                        {selectedAdvance?.firstName} {selectedAdvance?.lastName} -
                        Talep Edilen Avans Bilgileri Detayı
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: colors.primary[700] }}>
                    <Formik
                        initialValues={{
                            id: selectedAdvance ? selectedAdvance.id : "",
                            photoByte: selectedAdvance ? selectedAdvance.photoByte : "",
                            identityNumber: selectedAdvance ? selectedAdvance.identityNumber : "",
                            firstName: selectedAdvance ? selectedAdvance.firstName : "",
                            secondName: selectedAdvance ? selectedAdvance.secondName : "",
                            lastName: selectedAdvance ? selectedAdvance.lastName : "",
                            secondLastName: selectedAdvance ? selectedAdvance.secondLastName : "",
                            advanceDescription: selectedAdvance ? selectedAdvance.advanceDescription : "",
                            advanceAmount: selectedAdvance ? selectedAdvance.advanceAmount : "",
                            advanceCurrency: selectedAdvance ? selectedAdvance.advanceCurrency : "",
                            advanceRequestDate: selectedAdvance ? selectedAdvance.advanceRequestDate : "",
                            advanceApprovalStatus: selectedAdvance ? selectedAdvance.advanceApprovalStatus : "",
                            advanceResponseDate: selectedAdvance ? selectedAdvance.advanceResponseDate : "",
                        }}
                    >
                        {({ values, handleChange }) => (
                            <Form>
                                {/* Hidden ID */}
                                <Input type="hidden" value={values.id} />

                                {/* Photo */}
                                <Row className="mb-3 mt-3">
                                    <Col>
                                        <Image
                                            src={`data:image/jpg;base64,${selectedAdvance?.photoByte}`}
                                            alt="Profile Picture"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                    </Col>
                                </Row>

                                {/* TC Kimlik Numarası */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="identityNumber">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>T.C. Kimlik No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.identityNumber}
                                            name="identityNumber"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                {/* Ad - İkinci Ad */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="firstName">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Ad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.firstName}
                                            name="firstName"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="secondName">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>İkinci Ad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.secondName}
                                            name="secondName"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                {/* Soyad - İkinci Soyad */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="lastName">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Soyad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.lastName}
                                            name="lastName"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="secondLastName">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>İkinci Soyad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.secondLastName}
                                            name="secondLastName"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                {/* Avans Açıklaması */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="advanceDescription">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Avans Açıklaması</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={values.advanceDescription}
                                            rows={3}
                                            name="advanceDescription"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                                resize: 'none',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                {/* Avans Tutarı */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="advanceAmount">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Avans Tutarı</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={values.advanceAmount}
                                            name="advanceAmount"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>

                                    {/* Avans Tutarı*/}
                                    <Form.Group as={Col} controlId="advanceCurrency">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Avans Para Birimi</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.advanceCurrency}
                                            name="advanceCurrency"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                {/* Avans Talep Tarihi */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="advanceRequestDate">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Avans Talep Tarihi</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={values.advanceRequestDate}
                                            name="advanceRequestDate"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                {/* Avans Talebi Onay Durumu */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="advanceApprovalStatus">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Avans Onay Durumu</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.advanceApprovalStatus}
                                            name="advanceApprovalStatus"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0',
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                {values.advanceApprovalStatus === 'Onaylandı' || values.advanceApprovalStatus === 'Reddedildi' ? (
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="advanceResponseDate">
                                            <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Avans Talebi Yanıt Tarihi</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={values.advanceResponseDate}
                                                name="advanceResponseDate"
                                                onChange={handleChange}
                                                style={{
                                                    background: colors.primary[500],
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0',
                                                }}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Row>
                                ) : null}

                                {/* Action Buttons */}
                                <Box
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginTop: '20px',
                                        marginBottom: '20px'
                                    }}>
                                    <Button
                                        onClick={() => handleApprovePermission(values)}
                                        style={{
                                            background: colors.greenAccent[500],
                                            marginTop: '20px',
                                            marginRight: '20px',
                                            border: 'none',
                                            borderRadius: '0',
                                            display: values.advanceApprovalStatus === 'Onaylandı' || values.advanceApprovalStatus === 'Reddedildi' ? 'none' : 'inline-block',
                                        }}>
                                        Onayla
                                    </Button>
                                    <Button
                                        onClick={() => handleRejectPermission(values)}
                                        style={{
                                            backgroundColor: colors.blueAccent[700],
                                            marginTop: '20px',
                                            border: 'none',
                                            borderRadius: '0',
                                            display: values.advanceApprovalStatus === 'Onaylandı' || values.advanceApprovalStatus === 'Reddedildi' ? 'none' : 'inline-block',
                                        }}>
                                        Reddet
                                    </Button>

                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>

            {/* Notification Toast Container */}
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

export default AdvanceRequestDetailModal;