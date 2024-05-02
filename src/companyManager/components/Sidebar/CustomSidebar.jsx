import React, { useState } from 'react';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../scripst/theme";
import { Image } from 'react-bootstrap';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PortraitIcon from '@mui/icons-material/Portrait';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';


const Item = ({ title, to, icon, selected, setSelected }) => {
    const navigate = useNavigate();
    const handleNavigation = (to) => {
        navigate(to);
        setSelected(title);
    };

    return (
        <MenuItem
            active={selected === title}
            onClick={() => handleNavigation(to)}
            icon={icon}
            className="pro-inner-item"
        >
            <Typography>{title}</Typography>
        </MenuItem>
    );
};



const CustomSidebar = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    height: "140vh",
                    background: `${colors.primary[500]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item:hover": {
                    color: `${colors.blueAccent[400]} !important`,
                },
                "& .pro-menu-item.active": {
                    color: `${colors.blueAccent[600]} !important`
                },

            }}
        >
            <Sidebar collapsed={isCollapsed} className="">
                <Menu iconShape="square" className="pro-sidebar-inner">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    Yönetici
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && user && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Image
                                    src={`data:image/jpg;base64,${user?.photoByte}`}
                                    alt="Profile Picture"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.greenAccent[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    {`${user?.firstName} ${user?.secondName ?? ""} ${user?.lastName} ${user?.secondLastName ?? ""}`}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    {user?.department}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Ana Sayfa"
                            to="/"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Profil Bilgileri
                        </Typography>
                        <Item
                            title="Profil Özeti "
                            to="profile/summary"
                            icon={<PersonOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Profil Detayları"
                            to="profile/details"
                            icon={<PortraitIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Personel Yönetimi
                        </Typography>
                        <Item
                            title="Personel Yönetimi"
                            to="personnels/personnelmanagement"
                            icon={<PersonAddIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Personel Özlük Dosyası"
                            to="personnels/listofpersonnel"
                            icon={<RecentActorsIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            İzin Yönetimi
                        </Typography>
                        <Item
                            title="İzin Talebi Yönetimi"
                            to="permissions/premissionrequestmanagement"
                            icon={<PlaylistAddCheckIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Harcama Yönetimi
                        </Typography>
                        <Item
                            title="Harcama Talebi Yönetimi"
                            to="expenses/expenserequestmanagement"
                            icon={<PlaylistAddCheckIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Avans Yönetimi
                        </Typography>
                        <Item
                            title="Avans Talebi Yönetimi"
                            to="advances/advancerequestmanagement"
                            icon={<PlaylistAddCheckIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Vardiya Yönetimi
                        </Typography>
                        <Item
                            title="Vardiya Takvimi"
                            to="shifts/shiftschedule"
                            icon={<CalendarMonthIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Etkinlik Yönetimi
                        </Typography>
                        <Item
                            title="Yıllık Etkilik Takvimi"
                            to="events/calendarofevents"
                            icon={<InsertInvitationIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </Sidebar>
        </Box>
    );
};

export default CustomSidebar;