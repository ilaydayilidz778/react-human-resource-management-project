import React, { useState } from 'react';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../../scripst/theme";
import { Image } from 'react-bootstrap';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AddCardIcon from '@mui/icons-material/AddCard';
import PortraitIcon from '@mui/icons-material/Portrait';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';


const Item = ({ title, to, icon, selected, setSelected }) => {
    const navigate = useNavigate();
    const handleNavigation = (to) => {
        navigate(to);
        setSelected(title);
    }
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
                                    Personel
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
                            to="profile/detail"
                            icon={<PortraitIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            İzin Bilgileri
                        </Typography>
                        <Item
                            title="İzin Talebi Oluştur"
                            to="premission/premissionrequest"
                            icon={<PlaylistAddIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="İzin Taleplerini Listele"
                            to="premission/listofpermission"
                            icon={<FormatListBulletedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Harcama Bilgileri
                        </Typography>
                        <Item
                            title="Harcama Talebi Oluştur"
                            to="expense/expenserequest"
                            icon={<AddCardIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Harcamaları Listele"
                            to="expense/listofexpenses"
                            icon={<FormatListBulletedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Avans Bilgileri
                        </Typography>
                        <Item
                            title="Avans Talebi Oluştur"
                            to="advance/advancerequest"
                            icon={<AddCardIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Avansları Listele"
                            to="advance/listofadvances"
                            icon={<FormatListBulletedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.greenAccent[500]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Vardiya Bilgileri
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
                            Etkinlik Bilgileri
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