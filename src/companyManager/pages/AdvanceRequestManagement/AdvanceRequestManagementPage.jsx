import React, { useEffect, useState } from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, useTheme, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Header from "../../../components/Header/Header";
import { toast, ToastContainer } from 'react-toastify';
import { DataGrid } from "@mui/x-data-grid";
import { Button } from 'react-bootstrap';
import ForwardIcon from '@mui/icons-material/Forward';
import { mockDataAdvances } from '../../../data/advanceData';
import axios from 'axios';
import { request } from '../../../constants/constants';
import AdvanceDetailModal from './AdvanceRequestDetailModal';

// ÖNEMLİ NOT KULLANICIN KALAN AVANS HAKKI HESAPLANACAK !!! 

const AdvanceRequestManagementPage = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [advances, setAdvances] = useState(mockDataAdvances);
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('pending');
    const [showModal, setShowModal] = useState(false);

    // Tablo Alanları
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "identityNumber", headerName: "T.C. Kimlik No", flex: 1 },
        { field: "firstName", headerName: "Ad", flex: 1 },
        { field: "lastName", headerName: "Soyad", flex: 1 },
        { field: "advanceDescription", headerName: "Avans Talebi Açıklaması", flex: 2 },
        { field: "advanceAmount", headerName: "Avans Tutarı", flex: 1 },
        { field: "advanceCurrency", headerName: "Para Birimi", flex: 1 },
        { field: "advanceRequestDate", headerName: "Talep Tarihi", flex: 1 },
        { field: "advanceApprovalStatus", headerName: "Onay Durumu", flex: 1 },
        { field: "advanceResponseDate", headerName: "Avans Talebi Yanıt Tarihi", flex: 1 },
        {
            field: "viewToDetails",
            headerName: "Detayları Görüntüle",
            flex: 1,
            renderCell: (params) => (
                <Button
                    onClick={() => handleViewAdvanceRequestDetail(params.row)}
                    style={{
                        backgroundColor: colors.blueAccent[700],
                        border: 'none',
                        borderRadius: '0'
                    }}>
                    <ForwardIcon />
                </Button>
            )
        },
    ];

    const handleViewAdvanceRequestDetail = (advance) => {
        setSelectedAdvance(advance);
        setShowModal(true);
    }

    // Tablo Verileri
    const rows = advances ? advances.map(advance => ({
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
        if (user && user.companyName) {
            getAdvances('pending');
        }
    }, [user]);

    useEffect(() => {
        if (user && user.companyName) {
            getAdvances(selectedFilter);
        }
    }, [selectedFilter]);

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const getAdvances = async (filter) => {
        let url = '';
        switch (filter) {
            case 'all':
                url = `/api/Avans/Firma?firmaAd=${user?.companyName}`;
                break;
            case 'approved':
                url = `/api/Avans/FirmaOnayli?firmaAd=${user?.companyName}`;
                break;
            case 'rejected':
                url = `/api/Avans/FirmaRed?firmaAd=${user?.companyName}`;
                break;
            default:
                url = `/api/Avans/FirmaBekleme?firmaAd=${user?.companyName}`;
                break;
        }

        try {
            const response = await axios.get(request + url);
            if (response.status === 200) {
                const activeAdvances = response.data.filter(advance => advance.aktiflikDurumu !== false);
                setAdvances(activeAdvances);
            }
            else {

            }
        } catch (error) {
            console.error("Error fetching advances data:", error);
        }
    }

    return (
        <Box m="20px">
            <Header title="AVANS TALEP YÖNETİMİ" subtitle="Ekibinizde yer alan çalışanların onay bekleyen avans taleplerinin listesi yer almaktadır. Detayları görüntüle ile avansın detaylarını görüntüleyerek avans taleplerini onaylayabilir ya da reddebilirsiniz. Filtereleme alanı ile reddetiğiniz avans taleplerini, onayladığınız avans taleplerini ve tüm avans taleplerini görüntüleyebilirsiniz." />

            {/* Kullanıcı Bilgilendirme */}
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

            {/* Filtre */}
            <Box display="flex" justifyContent="flex-end" me={2}>
                <RadioGroup row
                    value={selectedFilter}
                    onChange={handleFilterChange}>
                    <FormControlLabel
                        value="pending"
                        control={<Radio />}
                        label="Onay Bekleyen" />
                    <FormControlLabel
                        value="approved"
                        control={<Radio />}
                        label="Onaylanan" />
                    <FormControlLabel
                        value="rejected"
                        control={<Radio />}
                        label="Reddedilen" />
                    <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label="Tümü" />
                </RadioGroup>
            </Box>

            {/* Tablo */}
            <Box
                m="40px 0 0 0"
                height="70vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        fontSize: "0.9rem"
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
                <DataGrid checkboxSelection rows={rows} columns={columns} />
            </Box>

            {/* Modal */}
            <AdvanceDetailModal
                selectedAdvance={selectedAdvance}
                setSelectedAdvance={setSelectedAdvance}
                showModal={showModal}
                setShowModal={setShowModal} />
        </Box>
    )
}

export default AdvanceRequestManagementPage