import React, { useState, useEffect } from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../../components/Header/Header";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal } from "react-bootstrap";
import ClearIcon from '@mui/icons-material/Clear';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { request } from '../../../constants/constants';
import AdvanceRequestFormModal from './AdvanceRequestFormModal';

const AdvanceRequestPage = ({ user }) => {
    // Tema ve renk ayarları
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Durum değişkenleri
    const [allAdvances, setAllAdvances] = useState(null);
    const [pendingApprovalAdvances, setPendingApprovalAdvances] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Tablodaki alanlar
    const columns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "advanceType", headerName: "Avans Talebi Türü", flex: 1 },
        { field: "advanceDescription", headerName: "Avans Talebi Açıklaması", flex: 2 },
        { field: "advanceAmount", headerName: "Avans Tutarı", flex: 1 },
        { field: "advanceCurrency", headerName: "Para Birimi", flex: 1 },
        { field: "advanceRequestDate", headerName: "Talep Tarihi", flex: 1 },
        { field: "advanceApprovalStatus", headerName: "Onay Durumu", flex: 1 },
        {
            field: "cancelAdvanceRequest",
            headerName: "İptal Et",
            flex: 1,
            renderCell: (params) => (
                <Button
                    onClick={() => openCancelModal(params.row.id)}
                    style={{
                        backgroundColor: colors.blueAccent[700],
                        border: 'none',
                        borderRadius: '0'
                    }}>
                    <ClearIcon />
                </Button>
            )
        },
    ];

    // Tablodaki veriler
    const rows = pendingApprovalAdvances ? pendingApprovalAdvances.map(advance => ({
        id: advance.id,
        identityNumber: advance.kullanici.tcKimlikNumarasi,
        photoByte: advance.kullanici.photoByte,
        firstName: advance.kullanici.ad,
        secondName: advance.kullanici.ikinciAd,
        lastName: advance.kullanici.soyad,
        secondLastName: advance.kullanici.ikinciSoyad,
        advanceType: advance.avansTuru.ad,
        advanceDescription: advance.aciklama,
        advanceAmount: advance.tutar,
        advanceCurrency: advance.paraBirimi.simge,
        advanceRequestDate: advance.talepTarihi,
        advanceApprovalStatus: advance.onayDurumu === true ? "Onaylandı" : (advance.onayDurumu === false ? "Reddedildi" : "Beklemede"),
        advanceResponseDate: advance.cevaplanmaTarihi,
    })) : [];

    useEffect(() => {
        if (user) {
            getPendingApprovalAdvances();
            getAllAdvances();
        }
    }, [user]);

    // İptal modalını açmak için fonksiyon
    const openCancelModal = (id) => {
        setCurrentId(id);
        setIsModalOpen(true);
    };

    // Onay bekleyen avans taleplerini almak için fonksiyon
    const getPendingApprovalAdvances = async () => {
        try {
            const response = await axios.get(`${request}/api/Avans/KullaniciBekleme?id=${user?.id}`);
            if (response.status === 200) {
                setPendingApprovalAdvances(response.data.filter(advance => advance.aktiflikDurumu !== false));
            } else {
                console.log(`Error fetching pending approval advances data: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching pending approval advances data: ${error}`);
        }
    }

    // Tüm avans taleplerini almak için fonksiyon
    const getAllAdvances = async () => {
        try {
            const response = await axios.get(`${request}/api/Avans/Kullanici?id=${user?.id}`);
            if (response.status === 200) {
                const filteredAdvances = response.data.filter(advance => advance.aktiflikDurumu);
                setAllAdvances(filteredAdvances);
            }
        } catch (error) {
            console.error(`Error fetching all advances data: ${error}`);
        }
    }

    // İptal işlemini gerçekleştirmek için fonksiyon
    const handleCancelRequest = async () => {
        try {
            const advanceToBeCanceled = pendingApprovalAdvances.find(advance => advance.id === currentId);
            if (!advanceToBeCanceled) {
                throw new Error("Advance not found");
            }

            const response = await axios.put(`${request}/api/Avans/Iptal?id=${currentId}`);
            if (response.status === 200) {
                toast.success("Avans talebi başarıyla iptal edilmiştir.");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                console.log(`Error during cancellation: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error cancelling advance request: ${error}`);
            toast.error("Avans talebi iptal edilirken bir sorun oluştu.");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
        setIsModalOpen(false);
    };

    // Avans talebini iptal işleminden vazgeçmek için fonksiyon
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
                <p>Avans talebini iptal etmek istediğinizden emin misiniz?</p>
                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '10px',
                        marginBottom: '10px'
                    }}>
                    <Button
                        style={{
                            backgroundColor: colors.blueAccent[700],
                            marginRight: '20px',
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: '0'
                        }}
                        onClick={handleCancelRequest}>
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

    // Sayfanın ana bileşeninin döndürülmesi
    return (
        <Box m="20px">
            <Header title="YENİ AVANS TALEBİ OLUŞTURMA VE ONAY BEKLEYEN AVANS TALEPLERİ LİSTESİ"
                subtitle="Avans talebi oluşturabilir ve geçmiş avans taleplerinizi onaylanmış avans talepleri, reddedilmiş avans talepleri, onay bekleyen avans talepleri olarak filtreleyerek görüntüleyebilirsiniz." />

            <Button
                variant="contained"
                style={{
                    marginBottom: '10px',
                    padding: '10px',
                    fontSize: "1rem",
                    color: 'white',
                    border: 'none',
                }}
                onClick={handleAddClick}>
                <Typography
                    variant="h4"
                    backgroundColor={colors.blueAccent[700]}
                    padding="5px 10px"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0" }}
                >
                    + AVANS TALEP FORMU OLUŞTUR
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
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        fontSize: "1rem",
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
                }}
            >
                <DataGrid rows={rows} columns={columns} />
            </Box>

            {/* İptal onay modali */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={declineCancel}
                onConfirm={handleCancelRequest}
            />

            <AdvanceRequestFormModal
                showModal={showModal}
                setShowModal={setShowModal}
                user={user}
            />
        </Box >
    );
}

export default AdvanceRequestPage