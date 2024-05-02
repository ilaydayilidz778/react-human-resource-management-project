import React, { useState, useEffect } from 'react';
import { Box } from "@mui/material";;
import Header from '../../../components/Header/Header';
import ProfileSummaryCard from '../../components/ProfileSummary/ProfileSummaryCard';

const ProfileSummaryPage = ({ user }) => {
    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="PROFİL ÖZET BİLGİLERİ" subtitle="Hoşgeldiniz." />
            </Box>
            <ProfileSummaryCard {...user} />
        </Box>
    )
}

export default ProfileSummaryPage