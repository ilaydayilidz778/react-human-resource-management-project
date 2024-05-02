import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal } from "react-bootstrap";
import axios from 'axios';
import { request } from '../../../constants/constants';
import PremissionRequestFormModal from './PermissionRequestFormModal';
import Header from "../../../components/Header/Header";
import { tokens } from "../../../scripst/theme";
import ClearIcon from '@mui/icons-material/Clear';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { toast, ToastContainer } from 'react-toastify';
import PermissionRequestInformationModal from './PermissionRequestInformationModal';

const PermissionRequestPage = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [allPermissions, setAllPermissions] = useState(null);
    const [approvalPermissions, setApprovalPermissions] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [fileShowModal, setFileShowModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    //Tabloda gösterilecek alanlar için
    const columns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "permissionType", headerName: "İzin Türü", flex: 1 },
        { field: "permissionStartDate", headerName: "İzin Başlangıç Tarihi", flex: 1 },
        { field: "permissionEndDate", headerName: "İzin Bitiş Tarihi", flex: 1 },
        { field: "permissionNumberOfDays", headerName: "İzin Günü Sayısı", flex: 1 },
        { field: "permissionApprovalStatus", headerName: "İzin Onay Durumu", flex: 1 },
        { field: "permissionRequestDate", headerName: "İzin Talep Tarihi", flex: 1 },
        {
            field: "cancelPermissionRequest",
            headerName: "İzin Talebini İptal Et",
            flex: 1,
            renderCell: (params) => (
                <Button
                    style={{
                        backgroundColor: colors.blueAccent[700],
                        border: 'none',
                        borderRadius: '0'
                    }}
                    onClick={() => openCancelModal(params.row.id)}>
                    <ClearIcon />
                </Button>
            )
        },
        {
            field: "viewToFiles",
            headerName: "Belge Görüntüleme",
            flex: 1,
            renderCell: (params) => {
                if (params.row.documentName) {
                    return (
                        <Button
                            style={{
                                backgroundColor: colors.blueAccent[700],
                                border: 'none',
                                borderRadius: '0',
                            }}
                            onClick={() => handleViewDetais(params.row)}
                        >
                            <FilePresentIcon />
                        </Button>
                    );
                } else {
                    return (
                        <Button
                            style={{
                                backgroundColor: colors.blueAccent[700],
                                border: 'none',
                                borderRadius: '0',
                            }}
                            disabled
                            onClick={() => handleViewDetais(params.row)}
                        >
                            <FilePresentIcon />
                        </Button>
                    );
                }
            },
        },
    ];

    useEffect(() => {
        if (user) {
            getPendingApprovals();
            getAllPermissions();
        }
    }, [user]);


    // İptal modalını açmak için fonksiyon
    const openCancelModal = (id) => {
        setCurrentId(id);
        setIsModalOpen(true);
    };

    const handleViewDetais = async (permission) => {
        setFileShowModal(true);
        setSelectedPermission(permission);
    }

    // Onay Bekleyen İzinlerin Listelenmesi
    const getPendingApprovals = async () => {
        try {
            const response = await axios.get(`${request}/api/Izin/KullaniciBekleme?id=${user?.id}`);
            if (response.status === 200) {
                setApprovalPermissions(response.data);
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.error("Error fetching leave request data:", error);
        }
    }

    // Tüm İzinlerin Listelenmesi
    const getAllPermissions = async () => {
        try {
            const response = await axios.get(`${request}/api/Izin/Kullanici?id=${user?.id}`);
            console.log(response.data);
            if (response.status === 200) {
                setAllPermissions(response.data.filter(permission => permission.aktiflikDurumu === true));
            }
        } catch (error) {
            console.error("All Permission:", error);
        }
    }


    // İptal işlemini gerçekleştirmek için fonksiyon
    const handleCancelPermissionRequest = async () => {
        try {
            const permissionToBeCanceled = approvalPermissions.find(permissions => permissions.id === currentId);

            // Eğer İzin Yoksa
            if (!permissionToBeCanceled) {
                throw new Error("Permission not found");
            }
            const response = await axios.put(`${request}/api/Izin/Iptal?id=${currentId}`);
            if (response.status === 200) {
                toast.success("İzin talebi başarıyla iptal edilmiştir.");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.log("Error cancelling permission request:", error);
            toast.error("İzin talebi iptal edilirken bir sorun oluştu.");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
        setIsModalOpen(false);
    }

    const declineCancel = () => {
        setIsModalOpen(false);
    };

    // İptal etme işlemi modal bileşeni
    const ConfirmationModal = () => (
        <Modal show={isModalOpen} onHide={declineCancel}>
            <Modal.Header
                closeButton>
                <Modal.Title
                    style={{
                        color: colors.blueAccent[700],
                        fontWeight: "bold"
                    }}>
                    ONAY İPTAL</Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    background: `${colors.primary[700]}`,
                    fontSize: `1rem`
                }}>
                <p>Harcama talebini iptal etmek istediğinizden emin misiniz?</p>
                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px',
                        marginBottom: '20px'
                    }}>
                    <Button
                        style={{
                            backgroundColor: colors.blueAccent[700],
                            marginRight: '10px',
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: '0'
                        }}
                        onClick={handleCancelPermissionRequest}>
                        Evet
                    </Button>
                    <Button
                        style={{
                            backgroundColor: colors.greenAccent[500],
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: '0'
                        }}
                        onClick={declineCancel}>
                        Hayır
                    </Button>
                </Box>
            </Modal.Body>

        </Modal >
    );

    // Talep formunu açma fonksiyonu
    const handleAddClick = () => {
        setShowModal(true);
    };

    // Tablodaki veriler
    const rowsData = approvalPermissions ? approvalPermissions.map(permission => ({
        id: permission.id,
        permissionType: permission.izinTuru.ad,
        permissionStartDate: permission.izinBaslangicTarihi,
        permissionEndDate: permission.izinBitisTarihi,
        permissionNumberOfDays: permission.gunSayisi,
        permissionApprovalStatus: permission.onayDurumu === true ? "Onaylandı" : (permission.onayDurumu === false ? "Reddedildi" : "Beklemede"),
        permissionRequestDate: permission.talepTarihi,
        documentName: permission.belge,
    })) : [];


    // Sayfanın ana bileşeninin döndürülmesi
    return (
        <Box m="20px">
            <Header title="YENİ İZİN TALEBİ OLUŞTURMA VE ONAY BEKLEYEN İZİNLER LİSTESİ"
                subtitle="İzin talebi oluşturabilir ve geçmiş izin taleplerinizi onaylanmış izin talepleri, reddedilmiş izin talepleri, onay bekleyen izin talepleri olarak filtreleyerek görüntüleyebilirsiniz." />

            <Box
                style={{
                    backgroundColor: colors.primary[600],
                    padding: '15px',
                    fontSize: "1rem",
                    color: colors.greenAccent[400],
                    marginBottom: '20px'
                }}>
                <Typography
                    variant="h4"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    borderBottom="2px solid"
                    borderColor={colors.grey[400]}
                    sx={{ my: "5px", mb: "20px" }}
                >
                    İZİN HAKKI KULLANIM BİLGİLENDİRME ÖZETİ
                </Typography>
                <Typography
                    variant="h5"
                    color={colors.greenAccent[200]}
                    fontWeight="bold"
                    sx={{ my: "10px" }}
                >
                    TOPLAM YILLIK İZİN HAKKI : {user?.toplamYillikIzin}
                </Typography>

                <Typography
                    variant="h5"
                    color={colors.greenAccent[200]}
                    fontWeight="bold"
                    sx={{ my: "10px" }}
                >
                    KALAN YILLIK İZİN HAKKI :  {user?.kalanYillikIzin}
                </Typography>

            </Box>

            <Button variant="contained"
                style={{
                    marginBottom: '10px',
                    padding: '10px',
                    fontSize: "1rem",
                    color: 'white',
                    border: 'none',
                }}
                onClick={handleAddClick}
            >
                <Typography
                    variant="h4"
                    backgroundColor={colors.blueAccent[700]}
                    padding="5px 10px"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0" }}
                >
                    + İZİN TALEP FORMU OLUŞTUR
                </Typography>
            </Button>

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

            <Box
                m="20px 0 0 0"
                height="50vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        fontSize: "1rem"
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        fontSize: "1rem",
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        height: "50px",
                        borderTop: "none",
                        backgroundColor: colors.primary[500],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}>
                <DataGrid rows={rowsData} columns={columns} />
            </Box>

            {/* İptal onay modali */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={declineCancel}
                onConfirm={handleCancelPermissionRequest}
            />

            <PremissionRequestFormModal
                showModal={showModal}
                setShowModal={setShowModal}
                user={user}
                setApprovalPermissions={setApprovalPermissions}
                allPermissions={allPermissions}
            />

            <PermissionRequestInformationModal
                fileShowModal={fileShowModal}
                setFileShowModal={setFileShowModal}
                selectedPermission={selectedPermission}
            />

        </Box>
    );
}

export default PermissionRequestPage;
