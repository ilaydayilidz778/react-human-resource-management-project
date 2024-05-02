import React from 'react';
import { Container } from 'react-bootstrap';
import LoginPageContent from '../components/LoginContent/LoginPageContent';

const LoginPage = ({ setUser }) => {

    return (
        <Container fluid style={{ height: '100vh', paddingLeft: '0', paddingRight: '0' }}>
            <LoginPageContent setUser={setUser} />
        </Container>
    );
}

export default LoginPage;
