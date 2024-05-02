import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../../scripst/theme";
import { Routes, Route } from 'react-router-dom';
import CustomNavbar from "../../components/Navbar/CustomNavbar";
import CustomSidebar from "../../components/Sidebar/CustomSidebar";
import ProfileDetailPage from "../ProfileDetail/ProfileDetailPage";
import ProfileSummaryPage from "../ProfileSummary/ProfileSummaryPage";
import PersonnelManagementPage from '../PersonnelManagement/PersonnelManagementPage'
import ListOfAllPersonnelPage from "../PersonnelManagement/ListOfAllPersonnelPage";
import PremissionRequestManagementPage from "../PremissionRequestManagement/PremissionRequestManagementPage";
import ExpenseRequestManagementPage from "../ExpenseRequestManagement/ExpenseRequestManagementPage";
import AdvanceRequestManagementPage from "../AdvanceRequestManagement/AdvanceRequestManagementPage";
import EventManagementPage from "../EventManagement/EventManagementPage";
import ShiftManagementPage from "../ShiftManagement/ShiftManagementPage";
import ErrorPage from "../../../pages/ErrorPage";
import { errorMessages } from "../../../data/errorMessages"

const CompanyManagerMainPage = ({ user, setUser }) => {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    const [isErrorPage, setIsErrorPage] = useState(false);


    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="dashboard-app">
                    {!isErrorPage && <CustomSidebar isSidebar={isSidebar} user={user} />}
                    <main className="dashboard-content">
                        {!isErrorPage && <CustomNavbar setIsSidebar={setIsSidebar} />}
                        <Routes>
                            <Route path="/" element={<ProfileSummaryPage user={user} />} />
                            <Route path="profile/summary" element={<ProfileSummaryPage user={user} />} />
                            <Route path="profile/details" element={<ProfileDetailPage user={user} setUser={setUser} />} />
                            <Route path="personnels/personnelmanagement" element={<PersonnelManagementPage companyName={user?.companyName} />} />
                            <Route path="personnels/listofpersonnel" element={<ListOfAllPersonnelPage companyName={user?.companyName} />} />
                            <Route path="permissions/premissionrequestmanagement" element={<PremissionRequestManagementPage user={user} />} />
                            <Route path="expenses/expenserequestmanagement" element={<ExpenseRequestManagementPage user={user} />} />
                            <Route path="advances/advancerequestmanagement" element={<AdvanceRequestManagementPage user={user} />} />
                            <Route path="shifts/shiftschedule" element={<ShiftManagementPage user={user} />} />
                            <Route path="events/calendarofevents" element={<EventManagementPage user={user} />} />
                            <Route path="*" element={<ErrorPage code={404} message={errorMessages[404]} setIsErrorPage={setIsErrorPage} />} />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default CompanyManagerMainPage