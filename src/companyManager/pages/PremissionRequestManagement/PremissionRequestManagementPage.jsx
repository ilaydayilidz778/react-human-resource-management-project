import { useEffect, useState } from 'react';
import { tokens } from "../../../scripst/theme";
import { ToastContainer } from 'react-toastify';
import { Box, useTheme, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Header from "../../../components/Header/Header";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import axios from 'axios';
import { request } from '../../../constants/constants';
import ForwardIcon from '@mui/icons-material/Forward';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PermissionDetailModal from './PermissionRequestDetailModal';
import PermissionRequestDocumentViewerModal from './PermissionRequestDocumentViewerModal';

// ÖNEMLİ NOT KULLANICIN KALAN İZİN HAKKI HESAPLANACAK !!! 

const PermissionRequestManagementPage = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('pending');
    const [fileShowModal, setFileShowModal] = useState(false)
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (user && user.companyName) {
            getPermissions('pending');
        }
    }, [user]);

    useEffect(() => {
        if (user && user.companyName) {
            getPermissions(selectedFilter);
        }
    }, [selectedFilter]);

    const columns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "identityNumber", headerName: "T.C. Kimlik No", flex: 1 },
        { field: "firstName", headerName: "Ad", flex: 1 },
        { field: "lastName", headerName: "Soyad", flex: 1 },
        { field: "permissionType", headerName: "İzin Türü", flex: 1 },
        { field: "permissionStartDate", headerName: "İzin Başlangıç Tarihi", flex: 1 },
        { field: "permissionEndDate", headerName: "İzin Bitiş Tarihi", flex: 1 },
        { field: "permissionNumberOfDays", headerName: "İzin Günü Sayısı", flex: 1 },
        { field: "permissionApprovalStatus", headerName: "İzin Onay Durumu", flex: 1 },
        { field: "permissionRequestDate", headerName: "İzin Talep Tarihi", flex: 1 },
        {
            field: "viewToDetails",
            headerName: "Detayları Görüntüle",
            flex: 1,
            renderCell: (params) => (
                <Button
                    style={{
                        backgroundColor: colors.blueAccent[700],
                        border: 'none',
                        borderRadius: '0'
                    }}
                    onClick={() => handleViewPermissionRequestDetail(params.row)}>
                    <ForwardIcon />
                </Button>
            )
        },
        {
            field: "viewToFile",
            headerName: "Belgeyi Görüntüle",
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
                            onClick={() => handleViewPermissionRequestFile(params.row)}
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
                            onClick={() => handleViewPermissionRequestFile(params.row)}
                        >
                            <FilePresentIcon />
                        </Button>
                    );
                }
            },
        }
    ];

    const rows = permissions ? permissions.map(permission => ({
        id: permission.id,
        identityNumber: permission.kullanici.tcKimlikNumarasi,
        photoByte: permission.kullanici.photoByte,
        firstName: permission.kullanici.ad,
        secondName: permission.kullanici.ikinciAd,
        lastName: permission.kullanici.soyad,
        secondLastName: permission.kullanici.ikinciSoyad,
        permissionType: permission.izinTuru.ad,
        permissionStartDate: permission.izinBaslangicTarihi,
        permissionEndDate: permission.izinBaslangicTarihi,
        permissionNumberOfDays: permission.gunSayisi,
        permissionApprovalStatus: permission.onayDurumu === true ? "Onaylandı" : (permission.onayDurumu === false ? "Reddedildi" : "Beklemede"),
        permissionRequestDate: permission.talepTarihi,
        documentName: permission.belge
    })) : [];

    const handleViewPermissionRequestFile = (permission) => {
        setSelectedPermission(permission);
        setFileShowModal(true);
    };


    const handleViewPermissionRequestDetail = (permission) => {
        setSelectedPermission(permission);
        setShowModal(true);
    };

    const getPermissions = async (filter) => {
        let url = '';
        switch (filter) {
            case 'all':
                url = `/api/Izin/Firma?firmaAd=${user?.companyName}`;
                break;
            case 'approved':
                url = `/api/Izin/FirmaOnayli?firmaAd=${user?.companyName}`;
                break;
            case 'rejected':
                url = `/api/Izin/FirmaRed?firmaAd=${user?.companyName}`;
                break;
            default:
                url = `/api/Izin/FirmaBekleme?firmaAd=${user?.companyName}`;
                break;
        }
        try {
            const response = await axios.get(request + url);
            if (response.status === 200) {
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

    return (
        <Box m="20px">
            <Header title="İZİN TALEP YÖNETİMİ" subtitle="Ekibinizde yer alan çalışanların onay bekleyen izinlerininin listesi yer almaktadır. Detayları görüntüle ile izinin detaylarını görüntüleyerek izini onaylayabilir ya da reddebilirsiniz. Filtereleme alanı ile reddetiğiniz izinleri, onayladığınız izinleri ve tüm izinleri görüntüleyebilirsiniz." />

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
            <PermissionDetailModal
                selectedPermission={selectedPermission}
                setSelectedPermission={setSelectedPermission}
                showModal={showModal}
                setShowModal={setShowModal}
            />

            <PermissionRequestDocumentViewerModal
                fileShowModal={fileShowModal}
                setFileShowModal={setFileShowModal}
                selectedPermission={selectedPermission}
            />

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
        </Box>
    );
}

export default PermissionRequestManagementPage;
