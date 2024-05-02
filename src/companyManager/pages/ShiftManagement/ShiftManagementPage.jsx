import React from 'react';
import { tokens } from "../../../scripst/theme";
import { Box, useTheme } from "@mui/material";
import Header from "../../../components/Header/Header";

const ShiftManagementPage = ({ user }) => {
    // Tema ve renk ayarları
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Header title="VARDİYA YÖNETİMİ"
                subtitle="Vardiya talebi yönetimi." />
        </Box>
    );
}

export default ShiftManagementPage