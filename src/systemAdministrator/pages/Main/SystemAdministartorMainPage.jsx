import { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import CustomNavbar from "../../components/Navbar/CustomNavbar";
import CustomSidebar from "../../components/Sidebar/CustomSidebar";
import CompanyList from "../../pages/CompanyList/CompanyList"
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../../scripst/theme";
import axios from 'axios';

const SystemAdministartorMainPage = () => {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);

    const [user, setUser] = useState(null);
    const url = "https://localhost:7086/api/Kullanici/id?id=56dbf2bd-72c2-45f6-a3a2-44181a2a2be5";

    useEffect(() => {
        getUserById();
    }, []);

    const getUserById = async () => {
        try {
            const response = await axios.get(url);
            console.log(response.data);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="dashboard-app">
                    <div className="dashboard-sidebar">
                        <CustomSidebar isSidebar={isSidebar} user={user} />
                    </div>
                    <main className="dashboard-content">
                        <CustomNavbar setIsSidebar={setIsSidebar} />
                        <Routes>
                            <Route path="companylist" element={<CompanyList />} />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default SystemAdministartorMainPage