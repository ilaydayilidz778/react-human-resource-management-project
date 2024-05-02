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
import ExpenseRequestFormModal from './ExpenseRequestFormModal';
import ExpenseRequestInformationModal from './ExpenseRequestInformationModal';
import FilePresentIcon from '@mui/icons-material/FilePresent';


const ExpenseRequestPage = ({ user }) => {
    // Tema ve renk ayarları
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Durum değişkenleri
    const [allExpenses, setAllExpenses] = useState(null);
    const [pendingApprovalExpenses, setPendingApprovalExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileShowModal, setFileShowModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Tablodaki alanlar
    const columns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "expenseType", headerName: "Harcama Türü", flex: 1 },
        { field: "expenseAmount", headerName: "Harcama Tutarı", flex: 1 },
        { field: "expenseCurrency", headerName: "Harcama Para Birimi", flex: 1 },
        { field: "expenseRequestDate", headerName: "Harcama Talep Tarihi", flex: 1 },
        { field: "expenseApprovalStatus", headerName: "Harcama Onay Durumu", flex: 1 },
        {
            field: "cancelExpenseRequest",
            headerName: "Harcama Talebini İptal Et",
            flex: 1,
            renderCell: (params) => (
                <Button
                    style={{
                        backgroundColor: colors.blueAccent[700],
                        border: 'none',
                        borderRadius: '0',
                    }}
                    onClick={() => openCancelModal(params.row.id)}
                >
                    <ClearIcon />
                </Button>
            ),
        },
        {
            field: "viewToFiles",
            headerName: "Belge Görüntüleme",
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
            getPendingApprovalExpenses();
            getAllExpenses();
        }
    }, [user]);

    // İptal modalını açmak için fonksiyon
    const openCancelModal = (id) => {
        setCurrentId(id);
        setIsModalOpen(true);
    };

    const handleViewDetais = async (expense) => {
        setFileShowModal(true);
        setSelectedExpense(expense);
    }

    // Onay bekleyen harcama taleplerini almak için fonksiyon
    const getPendingApprovalExpenses = async () => {
        try {
            const response = await axios.get(`${request}/api/Harcama/KullaniciBekleme?id=${user?.id}`);
            if (response.status === 200) {
                setPendingApprovalExpenses(response.data.filter(expense => expense.aktiflikDurumu !== false));
            } else {
                console.log(`Error fetching pending approval expenses data: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching pending approval expenses data: ${error}`);
        }
    }

    // Tüm harcama taleplerini almak için fonksiyon
    const getAllExpenses = async () => {
        try {
            const response = await axios.get(`${request}/api/Harcama/Kullanici?id=${user?.id}`);
            if (response.status === 200) {
                const filteredExpenses = response.data.filter(expense => expense.aktiflikDurumu);
                setAllExpenses(filteredExpenses);
            }
        } catch (error) {
            console.error(`Error fetching all expenses data: ${error}`);
        }
    }

    // İptal işlemini gerçekleştirmek için fonksiyon
    const handleCancelRequest = async () => {
        try {
            const expenseToBeCanceled = pendingApprovalExpenses.find(expense => expense.id === currentId);
            if (!expenseToBeCanceled) {
                throw new Error("Expense not found");
            }

            const response = await axios.put(`${request}/api/Harcama/Iptal?id=${currentId}`);
            if (response.status === 200) {
                toast.success("Harcama talebi başarıyla iptal edilmiştir.");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                console.log(`Error during cancellation: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error cancelling expense request: ${error}`);
            toast.error("Harcama talebi iptal edilirken bir sorun oluştu.");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
        setIsModalOpen(false);
    };

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

    // Tablodaki veriler
    const rows = pendingApprovalExpenses ? pendingApprovalExpenses.map(expense => ({
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

    // Sayfanın ana bileşeninin döndürülmesi
    return (
        <Box m="20px">
            <Header title="YENİ HARCAMA TALEBİ OLUŞTURMA VE ONAY BEKLEYEN HARCAMA TALEPLERİ LİSTESİ"
                subtitle="Harcama talebi oluşturabilir ve geçmiş harcama taleplerinizi onaylanmış harcama talepleri, reddedilmiş harcama talepleri, onay bekleyen harcama talepleri olarak filtreleyerek görüntüleyebilirsiniz." />

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
                    + HARCAMA TALEP FORMU OLUŞTUR
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

            <ExpenseRequestFormModal
                showModal={showModal}
                setShowModal={setShowModal}
                user={user}
                setPendingApprovalExpenses={setPendingApprovalExpenses}
            />

            <ExpenseRequestInformationModal
                fileShowModal={fileShowModal}
                setFileShowModal={setFileShowModal}
                selectedExpense={selectedExpense}
            />
        </Box >
    );
};

export default ExpenseRequestPage;
