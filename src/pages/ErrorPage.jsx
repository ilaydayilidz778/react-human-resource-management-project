import React, { useEffect } from 'react';
import { tokens } from "../scripst/theme";
import { Box, useTheme, Typography } from "@mui/material";
import { Image } from 'react-bootstrap';
import ErrorIcon from '../../public/images/ErrorPageIcon.png';
import { Link } from 'react-router-dom';

const ErrorPage = ({ code, message, setIsErrorPage }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        setIsErrorPage(true);
        return () => {
            setIsErrorPage(false); // Component sonlandığında durumu geri sıfırlanmasını sağlar.
        }
    }, [setIsErrorPage]);

    return (
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "100vh",
                width: "100vw",
                margin: 20,
                padding: 50,
            }}
        >

            {/* OPPS! */}
            <Typography
                style={{
                    color: `${colors.greenAccent[400]}`,
                    fontSize: "5.4rem",
                    fontWeight: "bold",
                }}
            >
                Ooops!
            </Typography>

            {/* Error code */}
            <Typography
                style={{
                    color: `${colors.greenAccent[400]}`,
                    fontSize: "4.4rem",
                }}
            >
                {code}
            </Typography>

            {/* Error message */}
            <Typography
                variant="h6"
                style={{
                    color: `${colors.grey[400]}`,
                    fontSize: "1.4rem",
                    marginBottom: "20px",
                }}
            >
                {message}
            </Typography>

            {/* Ana Sayfaya Dön Linki */}
            <Link
                to="/"
                style={{
                    marginTop: "20px",
                    color: `${colors.blueAccent[400]}`,
                    fontSize: "1.4rem",
                }}
            >
                Ana Sayfaya Dön
            </Link>

            {/* Error Icon */}
            <Image
                src={ErrorIcon}
                alt="Error Icon"
                style={{
                    width: "50%",
                }}
            />
        </Box>
    );
}

export default ErrorPage;
