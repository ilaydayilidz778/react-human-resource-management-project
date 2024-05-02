import React, { useEffect, useState } from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, useTheme, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import Header from "../../../components/Header/Header";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import ForwardIcon from '@mui/icons-material/Forward';
import axios from 'axios';
import { request } from '../../../constants/constants';
import ExpenseDetailModal from './ExpenseRequestDetailModal';
import ExpenseRequestDocumentViewerModal from './ExpenseRequestDocumentViewerModal';
import FilePresentIcon from '@mui/icons-material/FilePresent';

const ExpenseRequestManagementPage = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('pending');
    const [fileShowModal, setFileShowModal] = useState(false)
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (user && user.companyName) {
            getExpenses('pending');
        }
    }, [user]);

    useEffect(() => {
        if (user && user.companyName) {
            getExpenses(selectedFilter);
        }
    }, [selectedFilter]);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "identityNumber", headerName: "T.C. Kimlik No", flex: 1 },
        { field: "firstName", headerName: "Ad", flex: 1 },
        { field: "lastName", headerName: "Soyad", flex: 1 },
        { field: "expenseType", headerName: "Harcama Türü", flex: 1 },
        { field: "expenseAmount", headerName: "Harcama Tutarı", flex: 1 },
        { field: "expenseCurrency", headerName: "Harcama Para Birimi", flex: 1 },
        { field: "expenseRequestDate", headerName: "Harcama Talep Tarihi", flex: 1 },
        { field: "expenseApprovalStatus", headerName: "Harcama Onay Durumu", flex: 1 },
        { field: "expenseResponseDate", headerName: "Harcama Yanıt Tarihi", flex: 1 },
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
                    onClick={() => handleViewExpenseRequestDetail(params.row)}>
                    <ForwardIcon />
                </Button>
            )
        },
        {
            field: "viewToFile",
            headerName: "Belgeyi Görüntüle",
            flex: 1,
            renderCell: (params) => {
                if (params.row.expenseFiles) {
                    return (
                        <Button
                            style={{
                                backgroundColor: colors.blueAccent[700],
                                border: 'none',
                                borderRadius: '0',
                            }}
                            onClick={() => handleViewExpenseRequestFile(params.row)}
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
                            onClick={() => handleViewExpenseRequestFile(params.row)}
                        >
                            <FilePresentIcon />
                        </Button>
                    );
                }
            },
        }
    ];

    const rows = expenses ? expenses.map(expense => ({
        id: expense.id,
        identityNumber: expense.kullanici.tcKimlikNumarasi,
        photoByte: expense.kullanici.photoByte,
        firstName: expense.kullanici.ad,
        secondName: expense.kullanici.ikinciAd,
        lastName: expense.kullanici.soyad,
        secondLastName: expense.kullanici.ikinciSoyad,
        expenseType: expense.harcamaTuru.ad,
        expenseAmount: expense.tutar,
        expenseCurrency: expense.paraBirimi.simge,
        expenseRequestDate: expense.talepTarihi,
        expenseApprovalStatus: expense.onayDurumu === true ? "Onaylandı" : (expense.onayDurumu === false ? "Reddedildi" : "Beklemede"),
        expenseResponseDate: expense.cevaplanmaTarihi,
        expenseFiles: expense.dosya,
    })) : [];

    const handleViewExpenseRequestDetail = (expense) => {
        setSelectedExpense(expense);
        setShowModal(true);
    };

    const handleViewExpenseRequestFile = (expense) => {
        setSelectedExpense(expense);
        setFileShowModal(true);
    };

    const getExpenses = async (filter) => {
        let url = '';
        switch (filter) {
            case 'all':
                url = `/api/Harcama/Firma?firmaAd=${user?.companyName}`;
                break;
            case 'approved':
                url = `/api/Harcama/FirmaOnayli?firmaAd=${user?.companyName}`;
                break;
            case 'rejected':
                url = `/api/Harcama/FirmaRed?firmaAd=${user?.companyName}`;
                break;
            default:
                url = `/api/Harcama/FirmaBekleme?firmaAd=${user?.companyName}`;
                break;
        }
        try {
            const response = await axios.get(request + url);
            if (response.status === 200) {
                const activeexpenses = response.data.filter(expense => expense.aktiflikDurumu !== false);
                setExpenses(activeexpenses);
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.error("Error fetching expense data:", error);
        }
    }

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    return (
        <Box m="20px">
            <Header title="HARCAMA TALEP YÖNETİMİ" subtitle="Ekibinizde yer alan çalışanların onay bekleyen harcama taleplerinin listesi yer almaktadır. Detayları görüntüle ile harcamanın detaylarını görüntüleyerek harcama taleplerini onaylayabilir ya da reddebilirsiniz. Filtereleme alanı ile reddettiğiniz harcama taleplerini, onayladığınız harcama taleplerini ve tüm harcama taleplerini görüntüleyebilirsiniz." />

            {/* Kullanıcı Bilgilendirme  */}
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
                height="75vh"
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

            <ExpenseDetailModal
                selectedExpense={selectedExpense}
                setSelectedExpense={setSelectedExpense}
                showModal={showModal}
                setShowModal={setShowModal} />

            <ExpenseRequestDocumentViewerModal
                fileShowModal={fileShowModal}
                setFileShowModal={setFileShowModal}
                selectedExpense={selectedExpense}
            />
        </Box>
    )
}

export default ExpenseRequestManagementPage