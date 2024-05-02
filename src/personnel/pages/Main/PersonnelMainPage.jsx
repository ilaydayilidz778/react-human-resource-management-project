import { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { ColorModeContext, useMode } from "../../../scripst/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import CustomNavbar from "../../components/Navbar/CustomNavbar";
import CustomSidebar from "../../components/Sidebar/CustomSidebar";
import ProfileDetailPage from "../ProfileDetail/ProfileDetailPage";
import ProfileSummaryPage from "..//ProfileSummary/ProfileSummaryPage";
import PermissionRequestPage from "../PermissionRequest/PermissionRequestPage";
import ListOfPermissionRequestPage from "../PermissionRequest/ListOfPermissionRequestPage";
import ExpenseRequestPage from "../ExpenseRequest/ExpenseRequestPage";
import AdvanceRequestPage from "../AdvanceRequest/AdvanceRequestPage";
import ListOfAdvancesRequestPage from "../AdvanceRequest/ListOfAdvancesRequestPage";
import ListOfExpensesRequestPage from "../ExpenseRequest/ListOfExpensesRequestPage";
import ErrorPage from "../../../pages/ErrorPage";
import { errorMessages } from "../../../data/errorMessages"

const PersonnelMainPage = ({ user, setUser }) => {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    const [isErrorPage, setIsErrorPage] = useState(false);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="dashboard-app">
                    <div className="dashboard-sidebar">
                        {!isErrorPage && <CustomSidebar isSidebar={isSidebar} user={user} />}
                    </div>
                    <main className="dashboard-content">
                        {!isErrorPage && <CustomNavbar setIsSidebar={setIsSidebar} />}
                        <Routes>
                            <Route path="/" element={<ProfileSummaryPage user={user} />} />
                            <Route path="profile/summary" element={<ProfileSummaryPage user={user} />} />
                            <Route path="profile/detail" element={<ProfileDetailPage user={user} setUser={setUser} />} />
                            <Route path="premission/premissionrequest" element={<PermissionRequestPage user={user} />} />
                            <Route path="premission/listofpermission" element={<ListOfPermissionRequestPage user={user} />} />
                            <Route path="expense/expenserequest" element={<ExpenseRequestPage user={user} />} />
                            <Route path="expense/listofexpenses" element={<ListOfExpensesRequestPage user={user} />} />
                            <Route path="advance/advancerequest" element={<AdvanceRequestPage user={user} />} />
                            <Route path="advance/listofadvances" element={<ListOfAdvancesRequestPage user={user} />} />
                            <Route path="*" element={<ErrorPage code={404} message={errorMessages[404]} setIsErrorPage={setIsErrorPage} />} />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default PersonnelMainPage