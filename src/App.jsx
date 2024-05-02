import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './scripst/theme';
import CompanyManagerMainPage from './companyManager/pages/Main/CompanyManagerMainPage';
import PasswordSettingPage from './pages/PasswordSettingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PersonnelMainPage from './personnel/pages/Main/PersonnelMainPage';
import ErrorPage from './pages/ErrorPage';
import { errorMessages } from "./data/errorMessages";
import axios from 'axios';
import { request } from './constants/constants';

function App() {
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isErrorPage, setIsErrorPage] = useState(false);

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  const getUserByToken = async (token) => {
    try {
      const url = `${request}/api/Kullanici/token?token=${token}`;
      const response = await axios.get(url);
      setUser(response.data);
      setIsLoading(false); // Kullanıcı verileri yüklendiğinde yükleme durumunu false olarak ayarlayın
      console.log("Kullanıcı Bulundu.");
    } catch (error) {
      console.log('Kullanıcı bulunamadı: ' + error);
      setIsLoading(false); // Kullanıcı bulunamadığında da yükleme durumunu false olarak ayarlayın
    }
  };

  useEffect(() => {
    const token = getCookie('loginTokenCookie');
    if (token) {
      getUserByToken(token);
    } else {
      setIsLoading(false);
      // navigate('/login');
    }
  }, [navigate]);

  const isAuthorized = (role) => {
    return user && user.role === role;
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  fontSize: '2.4rem',
                  fontWeight: 'bold',
                }}
              >
                Loading...
              </div>
            ) : (
              <Routes>
                <Route path="/*" element={<HomePage user={user} setUser={setUser} />} />
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/passwordsetting" element={<PasswordSettingPage />} />

                <Route path="/companymanager/*"
                  element={isAuthorized('Firma Sahibi') ? (
                    <CompanyManagerMainPage user={user} setUser={setUser} />
                  ) : (
                    <Navigate to="/error/403" replace />
                  )}
                />

                <Route path="/personnel/*"
                  element={isAuthorized('Personel') ? (
                    <PersonnelMainPage user={user} setUser={setUser} />
                  ) : (
                    <Navigate to="/error/403" replace />
                  )}
                />
                <Route path="/error/403" element={<ErrorPage code={403} message={errorMessages[403]} setIsErrorPage={setIsErrorPage} />} />

              </Routes>
            )}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
