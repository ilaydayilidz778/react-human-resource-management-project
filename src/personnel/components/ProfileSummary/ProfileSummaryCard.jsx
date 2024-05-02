import React from 'react';
import { tokens } from "../../../scripst/theme";
import { useTheme } from '@mui/material/styles';
import { Image } from 'react-bootstrap';
import { Box, Divider, Skeleton, Typography } from '@mui/material';


const ProfileSummaryCard = (user) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                display: 'flex',
                boxShadow: 5,
                backgroundColor: colors.blueAccent[700],
                width: "100%",
                padding: 2,
                alignItems: 'center'
            }}>
            {/* Resim */}
            <Box sx={{ marginRight: 5, marginLeft: 5 }}>
                {user?.photoByte ? (
                    <Image
                        src={`data:image/jpg;base64,${user?.photoByte}`}
                        alt="Profile Picture"
                        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%' }}
                    />
                ) : (
                    <Skeleton variant="circular" width={150} height={150} animation="wave" />
                )}

            </Box>
            <Divider orientation="vertical" flexItem sx={{ marginRight: 2 }} />

            {/* Profil Özet */}
            <Box sx={{ flexGrow: 2 }}>
                {/* İsim */}
                <Typography variant="h3" gutterBottom>
                    {`${user?.firstName} ${user?.secondName} ${user?.lastName} ${user?.secondLastName}`}
                </Typography>
                <Typography variant="h4" color="textSecondary" gutterBottom>
                    {user?.companyName}
                </Typography>
                <Typography variant="h4" gutterBottom>
                    {user?.job}, {user?.department}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                {/* Yaş, Doğum Tarihi ve Adres */}
                <Typography variant="h5">
                    <strong>Yaş : </strong> {new Date().getFullYear() - new Date(user?.birthDate).getFullYear()}
                </Typography>
                <Typography variant="h5">
                    <strong>Doğum Tarihi : </strong> {user?.birthDate}
                </Typography>
                <Typography variant="h5">
                    <strong>Adres : </strong> {user?.address}
                </Typography>
            </Box>
        </Box>
    )
}

export default ProfileSummaryCard