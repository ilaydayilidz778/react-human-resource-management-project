import { useState, useEffect } from 'react';
import { tokens } from "../../../scripst/theme";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import { Input, useTheme } from "@mui/material";
import { Formik } from "formik";
import axios from "axios";
import { request, MINIMUM_WAGE } from '../../../constants/constants';
import { toast } from 'react-toastify';

const PersonnelInformationModal = ({
    showModal,
    setShowModal,
    selectedUser,
    setSelectedUser,
    companyName,
    departments,
    salaryTypes,
    users,
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            setImagePreview(null);
        }
    }, [imageFile, showModal, selectedUser]);

    // Yeni personel fotoğrafı  eklemek için
    const fileToByteArray = (imageFile) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(imageFile);
        });
    };

    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });
        return btoa(binary);
    }

    // Yeni personel eklemek için
    const handleAddNewPersonnel = async (values) => {
        try {
            console.log("buraya giriyorum")
            let base64String = "";
            if (imageFile) {
                const byteArray = await fileToByteArray(imageFile);
                base64String = arrayBufferToBase64(byteArray);
            }
            const response = await axios.post(`${request}/api/Kullanici`, {
                photoByte: base64String,
                identityNumber: values.identityNumber,
                firstName: values.firstName,
                secondName: values.secondName,
                lastName: values.lastName,
                secondLastName: values.secondLastName,
                email: values.email,
                contact: values.contact,
                address: values.address,
                birthDate: values.birthDate,
                birthPlace: values.birthPlace,
                companyName: companyName,
                department: values.department,
                job: values.job,
                dateOfRecruitment: values.dateOfRecruitment,
                dateOfDismissal: values.dateOfDismissal,
                salaryType: values.salaryType,
                salary: values.salary,
                gender: values.gender
            });
            if (response.status === 200) {
                toast.success("Kullanıcı Başarıyla Eklendi.");
                setShowModal(false);
                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            }
        } catch (error) {
            console.error("Failed to added user data:", error);
            toast.error("Kullanıcı Eklenirken Bir Hata Oluştu.");
            setTimeout(() => {
                window.location.reload();
                console.log("New personnel data:", values);
            }, 3000)
        }
    };

    // Personel bilgilerini güncelelyebilmek için
    const handleSaveChanges = async (values) => {

    }

    const handleFormSubmit = async (values) => {
        console.log(values);
        if (selectedUser) {
            handleSaveChanges(values);
        } else {
            handleAddNewPersonnel(values);
        }

        setSelectedUser(null);
        setImageFile(null);
        setImagePreview(null);
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    };

    function isValidTcId(tcId) {
        // TC Kimlik numarası 11 hane olmalıdır
        if (tcId.length !== 11) {
            return false;
        }

        // TC Kimlik numarasının ilk hanesi 0 olamaz
        if (tcId[0] === '0') {
            return false;
        }

        // TC Kimlik numarasındaki her bir karakteri sayıya dönüştürmek için parseInt() kullanılıyor
        const numericTcId = Array.from(tcId).map(char => parseInt(char));

        let totalOdd = 0;
        let totalEven = 0;

        // TC Kimlik numarasının 1. 3. 5. 7. ve 9. hanelerinin toplamı
        // ve 2. 4. 6. ve 8. hanelerinin toplamı hesaplanıyor
        for (let i = 0; i < 9; i++) {
            if (i % 2 === 0) {
                totalOdd += numericTcId[i];
            } else {
                totalEven += numericTcId[i];
            }
        }

        const totalDiff = (totalOdd * 7 - totalEven) % 10;

        // 10. hane kontrolü
        if (totalDiff !== numericTcId[9]) {
            return false;
        }

        let total = 0;

        // TC Kimlik numarasının tüm hanelerinin toplamı hesaplanıyor
        for (let i = 0; i < 10; i++) {
            total += numericTcId[i];
        }

        // 11. hane kontrolü
        if (total % 10 !== numericTcId[10]) {
            return false;
        }

        return true;
    }


    // Telefon Numarası, Email Adresi ve TC Kimlik Numarası Kontrolü
    function isDuplicateUser(users, values) {
        for (let user of users) {
            if (
                user.email === values.email ||
                user.contact === values.contact ||
                user.identityNumber === values.identityNumber
            ) {
                return true;
            }
        }
        return false;
    }

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} >
            <Modal.Header closeButton>
                <Modal.Title style={{ color: colors.blueAccent[700] }}>Personel Bilgileri Detayı</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: `${colors.primary[700]}` }}>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={{
                        id: selectedUser ? selectedUser.id : "",
                        photoByte: selectedUser ? selectedUser.photoByte : "",
                        identityNumber: selectedUser ? selectedUser.identityNumber : "",
                        firstName: selectedUser ? selectedUser.firstName : "",
                        secondName: selectedUser ? selectedUser.secondName : "",
                        lastName: selectedUser ? selectedUser.lastName : "",
                        secondLastName: selectedUser ? selectedUser.secondLastName : "",
                        email: selectedUser ? selectedUser.email : "",
                        contact: selectedUser ? selectedUser.contact : "",
                        address: selectedUser ? selectedUser.address : "",
                        birthDate: selectedUser ? selectedUser.birthDate : "",
                        birthPlace: selectedUser ? selectedUser.birthPlace : "",
                        department: selectedUser ? selectedUser.department : "",
                        job: selectedUser ? selectedUser.job : "",
                        dateOfRecruitment: selectedUser ? selectedUser.dateOfRecruitment : "",
                        dateOfDismissal: selectedUser ? selectedUser.dateOfDismissal : null,
                        salaryType: selectedUser ? selectedUser.salaryType : "",
                        salary: selectedUser ? selectedUser.salary : "",
                        gender: selectedUser ? selectedUser.gender : "",
                    }}
                    validate={(values) => {
                        const errors = {};

                        // TC Kimlik Numarası Alanı Kontrolü
                        if (!values.identityNumber) {
                            errors.identityNumber = "TC kimlik numarası alanı zorunludur";
                        } else if (!isValidTcId(values.identityNumber)) {
                            errors.identityNumber = "Geçerli bir TC kimlik numarası giriniz. ";
                        }

                        // Ad Alanı Kontrolü
                        if (!values.firstName) {
                            errors.firstName = "Ad alanı zorunludur.";
                        } else if (values.firstName.length < 3 || values.firstName.length > 25) {
                            errors.firstName = "Ad alanı en az 3, en fazla 25 karakter olmalıdır";
                        }

                        // İkinci Ad Alanı Kontrolü
                        if (values.secondName && (values.secondName.length < 3 || values.secondName.length > 25)) {
                            errors.secondName = "İkinci Soyad alanı en az 3, en fazla 25 karakter olmalıdır";
                        }

                        // Soyad Alanı Kontrolü
                        if (!values.lastName) {
                            errors.lastName = "Soyad alanı zorunludur";
                        } else if (values.lastName.length < 3 || values.lastName.length > 25) {
                            errors.lastName = "Soyad alanı en az 3, en fazla 25 karakter olmalıdır";
                        }

                        // İkinci Soyad Alanı Kontrolü
                        if (values.secondLastName && (values.secondLastName.length < 3 || values.secondLastName.length > 25)) {
                            errors.secondLastName = "İkinci Soyad alanı en az 3, en fazla 25 karakter olmalıdır";
                        }

                        // Telefon Numarası Formatı 
                        const phoneRegExp =
                            /^(\+90|0)?\s*(\(\d{3}\)[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}|\(\d{3}\)[\s-]*\d{3}[\s-]*\d{4}|\(\d{3}\)[\s-]*\d{7}|\d{3}[\s-]*\d{3}[\s-]*\d{4}|\d{3}[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2})$/;

                        // Telefon Numarası Alanı Kontrolü
                        if (!values.contact) {
                            errors.contact = 'Telefon numarası alanı zorunludur.'
                        }
                        else if (!phoneRegExp.test(values.contact)) {
                            errors.contact = 'Geçerli bir telefon numarası giriniz.';
                        } else if (isDuplicateUser(users, { contact: values.contact })) {
                            errors.contact = "Bu telefon numarası zaten kullanılıyor";
                        }

                        // E-posta geçerliliğini kontrol etmek için kullanılacak düzenli ifade

                        // Email Alanı Kontrolü
                        if (!values.email) {
                            errors.email = "Email alanı zorunludur.";
                        }

                        // NOT: ADRES API ÜZERİNDEN ADRES DOĞRULAMA İŞLEMİ NASIL YAPILIR ?
                        // Adres Alanı Kontrolü
                        if (!values.address) {
                            errors.address = "Adres alanı zorunludur";
                        } else if (values.address.length < 10) {
                            errors.address = 'Adres en az 10 karakter olmalıdır';
                        } else if (values.address.length > 100) {
                            errors.address = 'Adres en fazla 100 karakter olmalıdır';
                        }

                        // Doğum Tarihi Alanı Kontrolü
                        if (!values.birthDate) {
                            errors.birthDate = "Doğum tarihi alanı zorunludur";
                        } else {
                            const today = new Date();
                            const birthDate = new Date(values.birthDate);
                            const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

                            if (birthDate >= today) {
                                errors.birthDate = "Doğum tarihi gelecek bir tarih olamaz";
                            } else if (birthDate > minAgeDate) {
                                errors.birthDate = "En az 18 yaşında olmalıdır";
                            }
                        }

                        // Doğum Yeri Alanı Kontrolü
                        if (!values.birthPlace) {
                            errors.birthPlace = "Doğum yeri alanı zorunludur";
                        }

                        // Cinsiyet Alanı Kontrolü
                        if (!values.gender) {
                            errors.gender = "Cinsiyet alanı zorunludur";
                        }

                        // Departman Alanı Kontrolü
                        if (!values.department) {
                            errors.department = "Departman alanı zorunludur";
                        }

                        // Meslek Alanı Kontrolü
                        if (!values.job) {
                            errors.job = "Meslek alanı zorunludur";
                        }

                        // İşe Başlama Tarihi Alanı Kontrolü
                        if (!values.dateOfRecruitment) {
                            errors.dateOfRecruitment = "İşe başlama tarihi alanı zorunludur";
                        }


                        // İşten Çıkış Tarihi, İşe Başlama Tarihinden Önce Olmamalıdır
                        if (values.dateOfRecruitment && values.dateOfDismissal && new Date(values.dateOfDismissal) <= new Date(values.dateOfRecruitment)) {
                            errors.dateOfDismissal = "İşten çıkış tarihi, işe başlama tarihinden önce olamaz";
                        }

                        // İşten Çıkış Tarihi ve İşe Başlama Tarihi Arasında En Az Bir Gün Olmalıdır
                        const recruitmentDate = values.dateOfRecruitment ? new Date(values.dateOfRecruitment) : null;
                        const dismissalDate = values.dateOfDismissal ? new Date(values.dateOfDismissal) : null;
                        if (recruitmentDate && dismissalDate && (dismissalDate - recruitmentDate) < (24 * 60 * 60 * 1000)) {
                            errors.dateOfDismissal = "İşten çıkış tarihi ile işe başlama tarihi arasında en az bir gün olmalıdır";
                        }


                        // Maaş Tipi Alanı Kontrolü
                        if (!values.salaryType) {
                            errors.salaryType = "Maaş tipi alanı zorunludur";
                        }

                        // Maaş Alanı Kontrolü
                        if (!values.salary) {
                            errors.salary = "Maaş alanı zorunludur";
                        } else if (isNaN(Number(values.salary)) || Number(values.salary) <= 0) {
                            errors.salary = "Geçerli bir maaş miktarı giriniz";
                        } else if (Number(values.salary) < MINIMUM_WAGE) {
                            errors.salary = `Maaş asgari ücretten az olamaz ${MINIMUM_WAGE} TL`;
                        }
                        return errors;
                    }}
                >
                    {({ values,
                        touched,
                        errors,
                        handleChange,
                        handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Input sx={{ gridColumn: "span 4", marginBottom: 2 }} type='hidden' value={values.id} />
                            <Row className="mb-3 mt-3">
                                <Col>
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt="Profile Picture"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                    ) : (
                                        <Image
                                            src={`data:image/jpg;base64,${selectedUser?.photoByte}`}
                                            alt="Profile Picture"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                    )}


                                    <Form.Group controlId="formFile" className="mt-3">
                                        <Form.Control type="file"
                                            accept='image/*'
                                            onChange={(event) => {
                                                const selectedFile = event.target.files[0];
                                                const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
                                                if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                                                    toast.error("Lütfen geçerli bir resim dosyası seçiniz (JPG, PNG veya JPEG formatında).");
                                                    setImageFile(null);
                                                    return;
                                                }
                                                setImageFile(selectedFile);
                                            }}
                                            isInvalid={touched.photoByte && errors.photoByte}
                                            className="input-field" />
                                        <Form.Control.Feedback
                                            style={{
                                                fontSize: '14px',
                                                marginBottom: '5px'
                                            }}
                                            type="invalid">{errors.photoByte}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3 mt-5">
                                <Col>
                                    <h4
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            borderBottom: `2px solid ${colors.greenAccent[400]}`
                                        }}>
                                        Kişisel Bilgiler
                                    </h4>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="identityNumber">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        T.C. Kimlik No
                                    </Form.Label>
                                    <Form.Control type="text"
                                        onChange={handleChange}
                                        value={values.identityNumber}
                                        name="identityNumber"
                                        isInvalid={touched.identityNumber && errors.identityNumber}
                                        style={{
                                            background: `${colors.primary[500]}`,
                                            border: `1px solid ${colors.primary[400]}`,
                                            color: "#ffffff",
                                            borderRadius: '0'
                                        }} />
                                    <Form.Control.Feedback type="invalid">{errors.identityNumber}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="fullName">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        Ad - İkinci Ad
                                    </Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.firstName}
                                                name="firstName"
                                                isInvalid={touched.firstName && errors.firstName}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff", borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback
                                                style={{
                                                    fontSize: '14px',
                                                    marginBottom: '5px'
                                                }}
                                                type="invalid">{errors.firstName}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.secondName}
                                                name="secondName"
                                                isInvalid={touched.secondName && errors.secondName}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback
                                                style={{
                                                    fontSize: '14px',
                                                    marginBottom: '5px'
                                                }}
                                                type="invalid">{errors.secondName}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="fullSurname">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        Soyad - İkinci Soyad
                                    </Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.lastName}
                                                name="lastName"
                                                isInvalid={touched.lastName && errors.lastName}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback
                                                style={{
                                                    fontSize: '14px',
                                                    marginBottom: '5px'
                                                }}
                                                type="invalid">{errors.lastName}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.secondLastName}
                                                name="secondLastName"
                                                isInvalid={touched.secondLastName && errors.secondLastName}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback
                                                style={{
                                                    fontSize: '14px',
                                                    marginBottom: '5px'
                                                }}
                                                type="invalid">{errors.secondLastName}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="birthInfo">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        Doğum Yeri ve Tarihi
                                    </Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.birthPlace}
                                                name="birthPlace"
                                                isInvalid={touched.birthPlace && errors.birthPlace}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff", borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback type="invalid">{errors.birthPlace}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control type="date"
                                                onChange={handleChange}
                                                value={values.birthDate}
                                                name="birthDate"
                                                isInvalid={touched.birthDate && errors.birthDate}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Row>
                            <Row >
                                <Form.Group as={Col} controlId="gender">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        Cinsiyet
                                    </Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            label="Erkek"
                                            type="radio"
                                            id="male"
                                            name="gender"
                                            value="Erkek"
                                            checked={values.gender === "Erkek"}
                                            onChange={handleChange}
                                            style={{
                                                marginRight: '30px',
                                                fontSize: '1rem',
                                                color: `${colors.greenAccent[400]}`
                                            }}
                                        />
                                        <Form.Check
                                            inline
                                            label="Kadın"
                                            type="radio"
                                            id="female"
                                            name="gender"
                                            value="Kadın"
                                            checked={values.gender === "Kadın"}
                                            onChange={handleChange}
                                            style={{
                                                fontSize: '1rem',
                                                marginRight: '10px',
                                                color: `${colors.greenAccent[400]}`
                                            }}
                                        />
                                    </div>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3 mt-5">
                                <Col>
                                    <h4
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            borderBottom: `2px solid ${colors.greenAccent[400]}`
                                        }}>
                                        İletişim Bilgileri
                                    </h4>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="contactInfo">
                                    <Form.Label style={{
                                        color: `${colors.greenAccent[400]}`,
                                        fontSize: '1rem'
                                    }}>
                                        Telefon Numarası ve E-posta
                                    </Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control type="text"
                                                onChange={handleChange} value={values.contact}
                                                name="contact"
                                                isInvalid={touched.contact && errors.contact}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback type="invalid">{errors.contact}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control type="email"
                                                onChange={handleChange}
                                                value={values.email}
                                                name="email"
                                                isInvalid={touched.email && errors.email}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="address">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        Adres
                                    </Form.Label>
                                    <Form.Control as="textarea" rows={3}
                                        onChange={handleChange}
                                        value={values.address}
                                        name="address"
                                        isInvalid={touched.address && errors.address}
                                        style={{
                                            background: `${colors.primary[500]}`,
                                            border: `1px solid ${colors.primary[400]}`,
                                            color: "#ffffff",
                                            borderRadius: '0'
                                        }} />
                                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3 mt-5">
                                <Col>
                                    <h4
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            borderBottom: `2px solid ${colors.greenAccent[400]}`
                                        }}>
                                        Şirket Bilgileri
                                    </h4>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="workInfo">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        Şirket, Departman, Meslek
                                    </Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control
                                                as="select"
                                                onChange={handleChange}
                                                value={values.department}
                                                name="department"
                                                isInvalid={touched.department && errors.department}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}>
                                                <option value="">Departman Seçin</option>
                                                {departments?.map(department => (
                                                    <option key={department} value={department}>{department}</option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.job}
                                                name="job"
                                                isInvalid={touched.job && errors.job}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback type="invalid">{errors.job}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="workDates">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        İşe Başlama ve Çıkış Tarihi
                                    </Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control type="date"
                                                onChange={handleChange}
                                                value={values.dateOfRecruitment}
                                                name="dateOfRecruitment"
                                                isInvalid={touched.dateOfRecruitment && errors.dateOfRecruitment}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback type="invalid">{errors.dateOfRecruitment}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control type="date"
                                                onChange={handleChange}
                                                value={values.dateOfDismissal}
                                                name="dateOfDismissal"
                                                isInvalid={touched.dateOfDismissal && errors.dateOfDismissal}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback type="invalid">{errors.dateOfDismissal}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="salaryInfo">
                                    <Form.Label
                                        style={{
                                            color: `${colors.greenAccent[400]}`,
                                            fontSize: '1rem'
                                        }}>
                                        Maaş Tipi ve Maaş
                                    </Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control
                                                as="select"
                                                onChange={handleChange}
                                                value={values.salaryType}
                                                name="salaryType"
                                                isInvalid={touched.salaryType && errors.salaryType}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }}>
                                                <option value="">Maaş Tipi Seçin</option>
                                                {salaryTypes?.map(salaryType => (
                                                    <option key={salaryType} value={salaryType}>{salaryType}</option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">{errors.salaryType}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.salary}
                                                name="salary"
                                                isInvalid={touched.salary && errors.salary}
                                                style={{
                                                    background: `${colors.primary[500]}`,
                                                    border: `1px solid ${colors.primary[400]}`,
                                                    color: "#ffffff",
                                                    borderRadius: '0'
                                                }} />
                                            <Form.Control.Feedback type="invalid">{errors.salary}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Row>
                            <Button
                                style={{
                                    background: colors.greenAccent[500],
                                    marginTop: '20px',
                                    marginRight: '20px',
                                    border: 'none',
                                    borderRadius: '0',
                                    display: 'inline-block'
                                }}
                                onClick={() => setShowModal(false)}>Vazgeç</Button>
                            <Button
                                style={{
                                    background: colors.blueAccent[500],
                                    marginTop: '20px',
                                    marginRight: '20px',
                                    border: 'none',
                                    borderRadius: '0',
                                    display: 'inline-block'
                                }}
                                type="submit">Kaydet</Button>
                        </Form>

                    )}
                </Formik>
            </Modal.Body>
        </Modal>

    );
}

export default PersonnelInformationModal