import React from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useTheme, Input } from "@mui/material";
import { Formik } from 'formik';
import { tokens } from "../../../scripst/theme";
import { ToastContainer, toast } from 'react-toastify';
import { request } from '../../../constants/constants';
import axios from 'axios';

const PermissionRequestDetailModal = ({
    selectedPermission,
    setSelectedPermission,
    showModal,
    setShowModal,
}) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // İzini Onayla
    const handleApprovePermission = async (values) => {
        try {
            const response = await axios.put(`${request}/api/Izin/Onay?id=${values.id}`);
            toast.success("İzin talebi başarıyla onaylandı!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            console.log('Permission approval response:', response);
        } catch (error) {
            console.error('Error approving permission:', error);
            toast.error("İzin talebi onaylanırken bir sorun oluştu!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
        setShowModal(false);
        setSelectedPermission(null);
    }

    // İzni Reddet
    const handleRejectPermission = async (values) => {
        try {
            const response = await axios.put(`${request}/api/Izin/Red?id=${values.id}`);
            console.log('Permission approval response:', response);
            toast.success("İzin talebi başarıyla reddedildi!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('Error approving permission:', error);
            toast.error("İzin talebi reddedilirken bir sorun oluştu!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
        setShowModal(false);
        setSelectedPermission(null);
    }

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title
                    style={{
                        color: colors.blueAccent[700],
                        fontWeight: "bold"
                    }}>
                    {selectedPermission?.firstName} {selectedPermission?.lastName}- Talep Edilen İzin Bilgileri Detayı </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    background: `${colors.primary[700]}`
                }}
            >
                <Formik
                    initialValues={{
                        id: selectedPermission ? selectedPermission.id : "",
                        identityNumber: selectedPermission ? selectedPermission.identityNumber : "",
                        photoByte: selectedPermission ? selectedPermission.photoByte : "",
                        firstName: selectedPermission ? selectedPermission.firstName : "",
                        secondName: selectedPermission ? selectedPermission.secondName : "",
                        lastName: selectedPermission ? selectedPermission.lastName : "",
                        secondLastName: selectedPermission ? selectedPermission.secondLastName : "",
                        permissionType: selectedPermission ? selectedPermission.permissionType : "",
                        startDate: selectedPermission ? selectedPermission.permissionStartDate : "",
                        endDate: selectedPermission ? selectedPermission.permissionEndDate : "",
                        numberOfDays: selectedPermission ? selectedPermission.permissionNumberOfDays : "",
                        approvalStatus: selectedPermission ? selectedPermission.permissionApprovalStatus : "",
                    }}
                >
                    {({ values, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Input sx={{ gridColumn: "span 4", marginBottom: 2 }} type='hidden' value={values.id} />
                            {/* Fotoğraf */}
                            <Row className="mb-3 mt-3">
                                <Col>
                                    <Image
                                        src={`data:image/jpg;base64,${selectedPermission?.photoByte}`}
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
                                            borderRadius: '0'
                                        }}
                                        disabled
                                    />
                                </Form.Group>
                            </Row>
                            {/* Ad- İkinci Ad */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="name">
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
                                            color: "#ffffff",
                                            borderRadius: '0'
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
                                            color: "#ffffff",
                                            borderRadius: '0'
                                        }}
                                        disabled
                                    />
                                </Form.Group>
                            </Row>
                            {/* Kullanıcın Kalan İzin Hakkı Sayısı */}
                            {/* İzin Türü */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="leaveType">
                                    <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>İzin Türü</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={values.permissionType}
                                        name="leaveType"
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
                            {/* İzin Başlangıç ve Bitiş Tarihi */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="startDate">
                                    <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>İzin Başlangıç Tarihi</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={values.startDate}
                                        name="startDate"
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
                                <Form.Group as={Col} controlId="endDate">
                                    <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>İzin Bitiş Tarihi</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={values.endDate}
                                        name="endDate"
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
                            {/* İzin Günü Sayısı */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="numberOfDays">
                                    <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>İzin Günü Sayısı</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={values.numberOfDays}
                                        name="numberOfDays"
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
                            {/* İzin Onay Durumu */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="approvalStatus">
                                    <Form.Label style={{ color: colors.greenAccent[400], fontSize: '1rem' }}>İzin Onay Durumu</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={values.approvalStatus}
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
                            {/* İşlemler */}
                            <Button
                                onClick={() => handleApprovePermission(values)}
                                style={{
                                    background: colors.greenAccent[500],
                                    marginTop: '20px',
                                    marginRight: '20px',
                                    border: 'none',
                                    borderRadius: '0',
                                    display: values.approvalStatus === 'Onaylandı' || values.approvalStatus === 'Reddedildi' ? 'none' : 'inline-block'
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
                                    display: values.approvalStatus === 'Onaylandı' || values.approvalStatus === 'Reddedildi' ? 'none' : 'inline-block'
                                }}>
                                Reddet
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>



        </Modal>
    )
}

export default PermissionRequestDetailModal;
