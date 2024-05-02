import React from 'react';
import { tokens } from "../../scripst/theme";
import { useTheme } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import Login from '../Login/Login';
import LoginPage from '../../../public/images/LoginPage.png';

const LoginPageContent = ({ setUser }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Row style={{ height: '100vh' }}>
            <Col xs={12} lg={6} className="d-flex align-items-center justify-content-start"
                style={{
                    background: "#f7f7f7",
                    paddingLeft: '0',
                    paddingRight: '0'
                }}>
                <img src={LoginPage} alt="login" style={{ width: '100%' }} />
            </Col>
            <Col xs={12} lg={6} className="d-flex  align-items-center justify-content-center"
                style={{

                    paddingLeft: '0',
                    paddingRight: '0'
                }}>
                <Login setUser={setUser} />
            </Col>
        </Row>
    );
}

export default LoginPageContent;
