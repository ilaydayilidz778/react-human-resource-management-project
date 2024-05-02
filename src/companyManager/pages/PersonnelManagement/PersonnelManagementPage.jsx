import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Box, useTheme, Radio, RadioGroup, FormControlLabel, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FowardIcon from "@mui/icons-material/Forward";
import { tokens } from "../../../scripst/theme";
import Header from "../../../components/Header/Header";
import axios from "axios";
import { request } from '../../../constants/constants';
import PersonnelInformationModal from "./PersonnelInformationModal";
import { toast, ToastContainer } from 'react-toastify';

const PersonnelManagementPage = ({ companyName }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [users, setUsers] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [salaryTypes, setSalaryTypes] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('active');

    // Tabloda gösterilecek alanlar
    const columns = [
        { field: "identityNumber", headerName: "T.C. Kimlik No", flex: 1 },
        { field: "firstName", headerName: "Ad", flex: 1 },
        { field: "lastName", headerName: "Soyad", flex: 1 },
        { field: "email", headerName: "E-posta", flex: 1 },
        { field: "contact", headerName: "İletişim", flex: 1 },
        { field: "department", headerName: "Departman", flex: 1 },
        { field: "job", headerName: "Meslek", flex: 1 },
        {
            field: "viewToDetail",
            headerName: "Detayları Görüntüle",
            flex: 1,
            renderCell: (params) => (
                <Button
                    style={{
                        backgroundColor: colors.blueAccent[700],
                        marginLeft: '10px',
                        border: 'none',
                        borderRadius: '0'
                    }}
                    onClick={() => handleEditClick(params.row)}>
                    <FowardIcon />
                </Button>
            )
        },
    ];

    // Tablo verileri
    const rows = users ? users.map(user => ({
        id: user.id,
        photoByte: user.photoByte || "",
        identityNumber: user.identityNumber || "",
        firstName: user.firstName || "",
        secondName: user.secondName || "",
        lastName: user.lastName || "",
        secondLastName: user.secondLastName || "",
        birthDate: user.birthDate || "",
        birthPlace: user.birthPlace || "",
        email: user.email || "",
        contact: user.contact || "",
        address: user.address || "",
        companyName: companyName,
        department: user.department || "",
        job: user.job || "",
        dateOfRecruitment: user.dateOfRecruitment || "",
        dateOfDismissal: user.dateOfDismissal || "",
        salaryType: user.salaryType || "",
        salary: user.salary || "",
        gender: user.gender || "",
    })) : [];

    useEffect(() => {
        getUsers();
        getDepartments();
        getSalaryTypes();
    }, []);

    useEffect(() => {
        getUsers();
    }, [selectedFilter]);


    const handleEditClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const getDepartments = async () => {
        try {
            const response = await axios.get(`${request}/api/Departman`)
            console.log(response.data);
            setDepartments(response.data);
        } catch (error) {
            console.error("Departmenlar:", error);
        }
    };

    const getSalaryTypes = async () => {
        try {
            const response = await axios.get(`${request}/api/MaasTipi`)
            console.log(response.data);
            setSalaryTypes(response.data);
        } catch (error) {
            console.error("Departmenlar:", error);
        }
    };

    const getUsers = async () => {
        try {
            const response = await axios.get(`${request}/api/Kullanici`);
            let filteredUsers;
            if (selectedFilter === "active") {
                filteredUsers = response.data.filter(user => user.dateOfDismissal === null && user.role === 'Personel');
            } else if (selectedFilter === "passive") {
                filteredUsers = response.data.filter(user => user.dateOfDismissal !== null && user.role === 'Personel');
            } else {
                filteredUsers = response.data.filter(user => user.role === 'Personel');
            }
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleAddClick = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    return (
        <Box m="20px">
            <Header title="PERSONEL YÖNETİMİ" subtitle="Ekibinizde yer alan çalışan bilgilerini ekleyebilir ve güncelleyebilirsiniz." />
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
                    + YENİ PERSONEL EKLE
                </Typography>
            </Button>

            {/* Filtre */}
            <Box display="flex" justifyContent="flex-end" me={2}>
                <RadioGroup row
                    value={selectedFilter}
                    onChange={handleFilterChange}>
                    <FormControlLabel
                        value="active"
                        control={<Radio />}
                        label="Aktif Çalışanlar" />
                    <FormControlLabel
                        value="passive"
                        control={<Radio />}
                        label="Pasif Çalışanlar" />
                    <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label="Tümü" />
                </RadioGroup>
            </Box>

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
                        display: "flex",
                        alignItems: "center",
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

            <PersonnelInformationModal
                showModal={showModal}
                setShowModal={setShowModal}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                companyName={companyName}
                departments={departments}
                salaryTypes={salaryTypes}
                users={users}
            />
        </Box>
    );
};

export default PersonnelManagementPage;
