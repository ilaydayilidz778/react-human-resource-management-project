import React from 'react';
import { tokens } from '../../../scripst/theme';
import { Box, useTheme, Input } from '@mui/material';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { request } from '../../../constants/constants';

const ExpenseRequestDetailModal = ({
    selectedExpense,
    setSelectedExpense,
    showModal,
    setShowModal }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Haracama Talebini Onayla
    const handleApproveExpense = async (values) => {
        try {
            const response = await axios.put(`${request}/api/Harcama/Onay?id=${values.id}`);
            toast.success("Harcama talebi başarıyla onaylandı!");
            setTimeout(() => {
                window.location.reload();

            }, 3000);
            console.log('Expense approval response:', response);
        } catch (error) {
            toast.error("Harcama talebi onaylanırken bir hata oluştu !");
            setTimeout(() => {
                window.location.reload();

            }, 3000);
            console.error('Error approving expense:', error);
        }
        setShowModal(false);
        setSelectedExpense(null);
    };

    // Haracama Talebini Reddet
    const handleRejectExpense = async (values) => {
        try {
            const response = await axios.put(`${request}/api/Harcama/Red?id=${values.id}`);
            toast.success("Harcama talebi başarıyla reddedildi!");
            setTimeout(() => {
                window.location.reload();

            }, 3000);
            console.log('Expense approval response:', response);
        } catch (error) {
            toast.error("Harcama talebi reddedilirken bir hata oluştu !");
            setTimeout(() => {
                window.location.reload();

            }, 3000);
            console.error('Error approving permission:', error);
        }
        setShowModal(false);
        setSelectedExpense(null);
    };

    return (
        <Box m="20px">
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: colors.blueAccent[700], fontWeight: 'bold' }}>
                        {selectedExpense?.firstName} {selectedExpense?.lastName} - Talep Edilen Harcama Bilgileri Detayı
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: colors.primary[700] }}>
                    <Formik
                        initialValues={{
                            id: selectedExpense ? selectedExpense.id : '',
                            identityNumber: selectedExpense ? selectedExpense.identityNumber : '',
                            photoByte: selectedExpense ? selectedExpense.photoByte : '',
                            firstName: selectedExpense ? selectedExpense.firstName : '',
                            secondName: selectedExpense ? selectedExpense.secondName : '',
                            lastName: selectedExpense ? selectedExpense.lastName : '',
                            secondLastName: selectedExpense ? selectedExpense.secondLastName : '',
                            expenseType: selectedExpense ? selectedExpense.expenseType : '',
                            expenseAmount: selectedExpense ? selectedExpense.expenseAmount : '',
                            expenseCurrency: selectedExpense ? selectedExpense.expenseCurrency : '',
                            expenseRequestDate: selectedExpense ? selectedExpense.expenseRequestDate : '',
                            expenseApprovalStatus: selectedExpense ? selectedExpense.expenseApprovalStatus : '',
                            expenseResponseDate: selectedExpense ? selectedExpense.expenseResponseDate : '',
                        }}
                        onSubmit={handleApproveExpense}
                    >
                        {({ values, handleChange, handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Input type='hidden' value={values.id} />

                                {/* Fotoğraf */}
                                <Row className="mb-3">
                                    <Col>
                                        <Image
                                            src={`data:image/jpg;base64,${selectedExpense?.photoByte}`}
                                            alt="Profile Picture"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                    </Col>
                                </Row>

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
                                                color: '#ffffff',
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

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
                                                color: '#ffffff',
                                                borderRadius: '0'
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
                                                color: '#ffffff',
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

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
                                                color: '#ffffff',
                                                borderRadius: '0'
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
                                                color: '#ffffff',
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                {/* Harcama Türü */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="expenseType">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Harcama Türü</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.expenseType}
                                            name="expenseType"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: '#ffffff',
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                {/* Haracma Tutarı*/}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="expenseAmount">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Harcama Tutarı</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.expenseAmount}
                                            name="expenseAmount"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: '#ffffff',
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                    {/* Para Birimi*/}
                                    <Form.Group as={Col} controlId="expenseCurrency">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Harcama Para Birimi</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.expenseCurrency}
                                            name="expenseCurrency"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: '#ffffff',
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                {/* Tarihler */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="expenseRequestDate">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Talep Tarihi</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={values.expenseRequestDate}
                                            name="expenseRequestDate"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: '#ffffff',
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="expenseResponseDate">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Yanıt Tarihi</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={values.expenseResponseDate}
                                            name="expenseResponseDate"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: '#ffffff',
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                {/* Haracama Talebi Onay Durumu */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="approvalStatus">
                                        <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>Harcama Talebi Onay Durumu</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={values.expenseApprovalStatus}
                                            name="approvalStatus"
                                            onChange={handleChange}
                                            style={{
                                                background: colors.primary[500],
                                                border: `1px solid ${colors.primary[400]}`,
                                                color: "#ffffff",
                                                borderRadius: '0'
                                            }}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                {/* Onay ve Reddet Butonları */}
                                <Button
                                    onClick={() => handleApproveExpense(values)}
                                    style={{
                                        background: colors.greenAccent[500],
                                        marginTop: '20px',
                                        marginRight: '20px',
                                        border: 'none',
                                        borderRadius: '0',
                                        display: values.expenseApprovalStatus === 'Onaylandı' || values.expenseApprovalStatus === 'Reddedildi' ? 'none' : 'inline-block'
                                    }}>
                                    Onayla
                                </Button>

                                <Button
                                    onClick={() => handleRejectExpense(values)}
                                    style={{
                                        backgroundColor: colors.blueAccent[700],
                                        marginTop: '20px',
                                        border: 'none',
                                        borderRadius: '0',
                                        display: values.expenseApprovalStatus === 'Onaylandı' || values.expenseApprovalStatus === 'Reddedildi' ? 'none' : 'inline-block'
                                    }}>
                                    Reddet
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </Box>
    );
};

export default ExpenseRequestDetailModal;
