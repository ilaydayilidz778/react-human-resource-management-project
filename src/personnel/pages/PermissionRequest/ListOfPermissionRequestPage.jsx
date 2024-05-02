import React, { useState, useEffect } from 'react';
import Header from "../../../components/Header/Header";
import { Box, useTheme, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { tokens } from "../../../scripst/theme";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { request } from '../../../constants/constants';

const ListOfPermissionRequestPage = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [permissions, setPermissions] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('pending');

    useEffect(() => {
        if (user) {
            fetchPermissions(selectedFilter);
        }
    }, [user, selectedFilter]);

    const fetchPermissions = async (filter) => {
        let url = '';
        switch (filter) {
            case 'all':
                url = `/api/Izin/Kullanici?id=${user?.id}`;
                break;
            case 'approved':
                url = `/api/Izin/KullaniciOnayli?id=${user?.id}`;
                break;
            case 'rejected':
                url = `/api/Izin/KullaniciRed?id=${user?.id}`;
                break;
            default:
                url = `/api/Izin/KullaniciBekleme?id=${user?.id}`;
                break;
        }
        try {
            const response = await axios.get(request + url);
            if (response.status === 200) {
                // Aktif Olmayan İzinlerin Gösterilmemesi
                const activePermissions = response.data.filter(permission => permission.aktiflikDurumu !== false);
                setPermissions(activePermissions);
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.error("Error fetching permission data:", error);
        }
    }

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "permissionType", headerName: "İzin Türü", flex: 1 },
        { field: "permissionStartDate", headerName: "İzin Başlangıç Tarihi", flex: 1 },
        { field: "permissionEndDate", headerName: "İzin Bitiş Tarihi", flex: 1 },
        { field: "permissionNumberOfDays", headerName: "İzin Günü Sayısı", flex: 1 },
        { field: "permissionApprovalStatus", headerName: "İzin Onay Durumu", flex: 1 },
        { field: "permissionRequestDate", headerName: "İzin Talep Tarihi", flex: 1 },
    ];

    const rowsData = permissions ? permissions.map(permission => ({
        id: permission.id,
        permissionType: permission.izinTuru.ad,
        permissionStartDate: permission.izinBaslangicTarihi,
        permissionEndDate: permission.izinBitisTarihi,
        permissionNumberOfDays: permission.gunSayisi,
        permissionApprovalStatus: permission.onayDurumu === true ? "Onaylandı" : (permission.onayDurumu === false ? "Reddedildi" : "Beklemede"),
        permissionRequestDate: permission.talepTarihi,
    })) : [];

    return (
        <Box m="20px">
            <Header title="GEÇMİŞ İZİNLER LİSTESİ"
                subtitle="Geçmiş izin taleplerinizi onaylanmış izin talepleri, reddedilmiş izin talepleri, onay bekleyen izin talepleri olarak filtreleyerek görüntüleyebilirsiniz." />

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


            <Box
                m="40px 0 0 0"
                height="70vh"
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
                }}
            >
                <DataGrid checkboxSelection rows={rowsData} columns={columns} />
            </Box>

        </Box>
    );
}

export default ListOfPermissionRequestPage;
