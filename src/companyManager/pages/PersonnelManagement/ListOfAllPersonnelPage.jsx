import { useState, useEffect } from "react";
import { tokens } from "../../../scripst/theme";
import { Box, useTheme, Grid, Card, CardMedia, CardContent, Typography, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Header from "../../../components/Header/Header";
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import { request } from '../../../constants/constants';
import PersonnelInformationModal from "./PersonnelInformationModal";
import { Button } from "react-bootstrap";
import FowardIcon from "@mui/icons-material/Forward";

const ListOfAllPersonnelPage = ({ companyName }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [users, setUsers] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [salaryTypes, setSalaryTypes] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('active');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getUsers();
        getDepartments();
        getSalaryTypes();
    }, []);

    useEffect(() => {
        getUsers();
    }, [selectedFilter]);

    const getDepartments = async () => {
        try {
            const response = await axios.get(`${request}/api/Departman`)
            console.log(response.data);
            setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const getSalaryTypes = async () => {
        try {
            const response = await axios.get(`${request}/api/MaasTipi`)
            console.log(response.data);
            setSalaryTypes(response.data);
        } catch (error) {
            console.error("Error fetching salary:", error);
        }
    };

    const handleViewPersonnelInformationDetail = (personnel) => {
        setSelectedUser(personnel);
        setShowModal(true);
    };

    const renderPersonnelCards = () => {
        if (!users) return null;

        return users.map(personnel => (
            <Grid item xs={12} sm={6} md={3} key={personnel.id}>
                <Card onClick={() => handleViewPersonnelInformationDetail(personnel)}
                    style={{
                        margin: "10px",
                        background: colors.primary[500],
                        border: `1px solid ${colors.primary[200]}`,
                        height: "100%",
                    }}>
                    <CardMedia
                        component="img"
                        alt={"Profile Image"}
                        height="250px"
                        image={`data:image/jpg;base64,${personnel?.photoByte}`}
                        style={{ objectFit: "cover" }}
                    />
                    <CardContent>
                        <Typography component="div"
                            style={{
                                color: colors.grey[100],
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "1.6rem"
                            }}>
                            {personnel.firstName} {personnel.secondName} {personnel.lastName} {personnel.secondLastName}
                        </Typography>
                        <Typography component="div"
                            style={{
                                color: colors.greenAccent[500],
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "1.2rem"
                            }}>
                            {personnel.department}
                        </Typography>
                        <Typography component="div"
                            style={{
                                color: colors.greenAccent[500],
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "1.2rem"
                            }}>
                            {personnel.job}
                        </Typography>
                        <Typography component="div"
                            style={{
                                color: colors.greenAccent[500],
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "1.2rem"
                            }}>
                            {personnel.companyName}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        ));
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

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    return (
        <Box m="20px">
            <Header title="PERSONEL ÖZLÜK DOSYASI" subtitle="Ekibinizde bugüne kadar yer almış tüm çalışanlarınızın bilgilerinin listesi yer almaktadır. Çalışan listenizi aktif çalışanlar, işten ayrılmış çalışanlar için pasif çalışanlar ve tüm çalışanlar olarak filtreleyerek görüntüleyebilir istediğiniz bilgilere kolaylıkla erişebilirsiniz." />

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

            <Grid container spacing={3}>
                {renderPersonnelCards()}
            </Grid>

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

            <PersonnelInformationModal
                showModal={showModal}
                setShowModal={setShowModal}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                companyName={companyName}
                departments={departments}
                salaryTypes={salaryTypes}
                users={users}
                getUsers={getUsers} />
        </Box>
    );
};

export default ListOfAllPersonnelPage;
