import React, { useState, useEffect } from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, useTheme, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Header from "../../../components/Header/Header";
import { DataGrid } from "@mui/x-data-grid";
import { request } from '../../../constants/constants';
import axios from 'axios';

const ListOfAdvancesRequestPage = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [advances, setAdvances] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('pending');


    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "advanceType", headerName: "Avans Talebi Türü", flex: 1 },
        { field: "advanceDescription", headerName: "Avans Talebi Açıklaması", flex: 2 },
        { field: "advanceAmount", headerName: "Avans Tutarı", flex: 1 },
        { field: "advanceCurrency", headerName: "Para Birimi", flex: 1 },
        { field: "advanceRequestDate", headerName: "Talep Tarihi", flex: 1 },
        { field: "advanceApprovalStatus", headerName: "Onay Durumu", flex: 1 },
        { field: "advanceResponseDate", headerName: "Avans Talebi Yanıt Tarihi", flex: 1 },
    ];

    // Tablodaki veriler
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
        if (user) {
            fetchAdvances(selectedFilter);
        }
    }, [user, selectedFilter]);

    const fetchAdvances = async (filter) => {
        let url = '';
        switch (filter) {
            case 'all':
                url = `/api/Avans/Kullanici?id=${user?.id}`;
                break;
            case 'approved':
                url = `/api/Avans/KullaniciOnayli?id=${user?.id}`;
                break;
            case 'rejected':
                url = `/api/Avans/KullaniciRed?id=${user?.id}`;
                break;
            default:
                url = `/api/Avans/KullaniciBekleme?id=${user?.id}`
                break;
        }
        try {
            const response = await axios.get(request + url);
            if (response.status === 200) {
                const activeAdvances = response.data.filter(advance => advance.aktiflikDurumu !== false);
                setAdvances(activeAdvances);

            }
        } catch (error) {
            console.error("Error fetching advances data:", error);
        }
    }

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    return (
        <Box m="20px">
            <Header title="TÜM AVANS TALEPLERİ LİSTESİ"
                subtitle="Geçmiş avans taleplerinizi, onaylanmış avans talepleri, reddedilmiş avans talepleri, onay bekleyen avans talepleri olarak filtreleyerek görüntüleyebilirsiniz." />

            {/* Filtreleme */}
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
                height="75vh"
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
                        height: "70px",
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


        </Box>
    )
}

export default ListOfAdvancesRequestPage