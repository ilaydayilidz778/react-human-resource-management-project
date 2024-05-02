import React from 'react';
import { tokens } from "../../../scripst/theme";
import { useTheme } from "@mui/material";
import { Modal, Row } from 'react-bootstrap';

const PermissionRequestDocumentViewerModal = ({
    fileShowModal,
    setFileShowModal,
    selectedPermission
}) => {
    // Tema ve renk ayarları
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Modal show={fileShowModal} onHide={() => setFileShowModal(false)} size="xl">

            <Modal.Header closeButton>
                <Modal.Title
                    style={{
                        color: colors.blueAccent[700],
                        fontWeight: "bold",
                    }}>
                    HARCAMA TALEP FORMU BELGE GÖRÜNTÜLEME
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    background: `${colors.primary[700]}`
                }}
            >
                {selectedPermission?.documentName &&
                    <Row>
                        <embed
                            id="embed"
                            src={`data:application/pdf;base64,${selectedPermission?.documentName}`}
                            type="application/pdf"
                            width="100%"
                            height="800px"
                        />
                    </Row>}

            </Modal.Body >
        </Modal >
    );
}

export default PermissionRequestDocumentViewerModal;