import React, { useState, useEffect } from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, useTheme, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Header from "../../../components/Header/Header";
import { DataGrid } from "@mui/x-data-grid";
import { request } from '../../../constants/constants';
import axios from 'axios';

const ListOfExpensesRequestPage = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [expenses, setExpenses] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('pending');

    useEffect(() => {
        if (user && user.id) {
            fetchExpenses(selectedFilter);
        } else {
            console.error("Kullanıcı verileri bulunamadı veya geçerli değil.");
        }
    }, [user, selectedFilter]);


    // Tablo Alanaları
    const columns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "expenseAmount", headerName: "Harcama Tutarı", flex: 1 },
        { field: "expenseCurrency", headerName: "Para Birimi", flex: 1 },
        { field: "expenseRequestDate", headerName: "Talep Tarihi", flex: 1 },
        { field: "expenseApprovalStatus", headerName: "Onay Durumu", flex: 1 },
        { field: "expenseResponseDate", headerName: "Harcama Talebi Yanıt Tarihi", flex: 1 },
    ];


    const fetchExpenses = async (filter) => {
        let url = '';
        switch (filter) {
            case 'all':
                url = `/api/Harcama/Kullanici?id=${user?.id}`;
                break;
            case 'approved':
                url = `/api/Harcama/KullaniciOnayli?id=${user?.id}`;
                break;
            case 'rejected':
                url = `/api/Harcama/KullaniciRed?id=${user?.id}`;
                break;
            default:
                url = `/api/Harcama/KullaniciBekleme?id=${user?.id}`
                break;
        }
        try {
            const response = await axios.get(request + url);
            if (response.status === 200) {
                const activeExpenses = response.data.filter(expense => expense.aktiflikDurumu !== false);
                setExpenses(activeExpenses);

            }
        } catch (error) {
            console.error("Error fetching expenses data:", error);
        }
    }

    // Tablo Verileri
    const rows = expenses ? expenses.map(expense => ({
        id: expense.id,
        identityNumber: user.tcKimlikNumarasi,
        photoByte: user.photoByte,
        firstName: expense.kullanici.ad,
        secondName: expense.kullanici.ikinciAd,
        lastName: expense.kullanici.soyad,
        secondLastName: expense.kullanici.ikinciSoyad,
        expenseType: expense.harcamaTuru.ad,
        expenseAmount: expense.tutar,
        expenseCurrency: expense.paraBirimi.simge,
        expenseRequestDate: expense.talepTarihi,
        expenseApprovalStatus: expense.onayDurumu === true ? "Onaylandı" : (expense.onayDurumu === false ? "Reddedildi" : "Beklemede"),
        expenseResponseDate: expense.talepYanitTarihi,
    })) : [];

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    return (
        <Box m="20px">
            <Header title="TÜM HARCAMA TALEPLERİ LİSTESİ"
                subtitle="Geçmiş Harcama taleplerinizi, onaylanmış Harcama talepleri, reddedilmiş Harcama talepleri, onay bekleyen Harcama talepleri olarak filtreleyerek görüntüleyebilirsiniz." />

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

export default ListOfExpensesRequestPage