import React, { useState } from 'react';
import { Button, Card, Carousel, Col, Row } from 'react-bootstrap';
import { tokens } from "../../scripst/theme";
import { useTheme } from '@mui/material';
import PersonnelManagement from '../../../public/images/PersonnelManagement.jpg';
import SalaryCalculation from '../../../public/images/SalaryCalculation.jpg';
import PerformanceEvaluation from '../../../public/images/PerformanceEvaluation.jpg';
import TrainingAndDevelopment from '../../../public/images/TrainingAndDevelopment.jpg';
import RecruitmentProcesses from '../../../public/images/RecruitmentProcesses.jpg';
import EmployeeSatisfaction from '../../../public/images/EmployeeSatisfaction.jpg';

const cardData = [
    {
        title: "PERSONEL YÖNETİMİ",
        text: "Şirketinizin tüm personel işlemlerini kolayca yönetin. Personel bilgilerini güncelleyin, izin ve izin kullanımı takip edin, performans değerlendirmeleri yapın ve daha fazlasını yapın.",
        imageSrc: PersonnelManagement
    },
    {
        title: "PERFORMANS DEĞERLENDİRME",
        text: "Çalışan performansını değerlendirin ve raporlayın. Çalışanların performansını izleyin, hedefleri değerlendirin, geri bildirim sağlayın ve performans raporları oluşturun.",
        imageSrc: PerformanceEvaluation
    },
    {
        title: "ÇALIŞAN MEMNUNİYETİ",
        text: "Çalışan memnuniyetini artırarak verimliliği yükseltin ve verimi arttırın. Çalışan geri bildirimlerini toplayın, memnuniyeti ölçün, iyileştirme planları oluşturun ve takım motivasyonunu artırın.",
        imageSrc: EmployeeSatisfaction
    },
    {
        title: "İŞE ALIM SÜREÇLERİ",
        text: "Etkili işe alım süreçleri ile doğru yetenekleri bulun ve ekibinizi zenginleştirin. İş ilanları oluşturun, adayları değerlendirin, mülakatlar yapın ve en uygun adayları seçin.",
        imageSrc: RecruitmentProcesses
    },
    {
        title: "EĞİTİM VE GELİŞİM",
        text: "Çalışanlarınızın profesyonel gelişimini destekleyin, Güncel kalmarını sağlayın. Eğitim ihtiyaçlarını belirleyin, eğitim programları oluşturun, gelişim planları yapın ve ilerlemeyi izleyin.",
        imageSrc: TrainingAndDevelopment
    },
    {
        title: "MAAŞ HESAPLAMA",
        text: "Çalışanlarınızın maaşlarını otomatik olarak hesaplayın. Maaş hesaplamalarınızı kolayca yapın, vergileri hesaplayın, ödemeleri takip edin ve raporlar alın.",
        imageSrc: SalaryCalculation
    },
];

const ServicesContent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <>
            <Row className="justify-content-center">
                <Col xs={10}>
                    <h2 className='fw-bold'
                        style={{
                            color: colors.greenAccent[500],
                            marginTop: "2rem",
                            marginBottom: "2rem",
                            borderBottom: `2px solid ${colors.greenAccent[400]}`,
                            textAlign: "center",
                            fontSize: "3.2rem",
                            width: '100%',
                        }}>
                        Hizmetlerimiz
                    </h2>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={10}>
                    <Carousel activeIndex={index} onSelect={handleSelect} interval={null} controls={false}>
                        {cardData.map((card, idx) => {
                            if (idx % 3 === 0) {
                                return (
                                    <Carousel.Item key={idx}>
                                        <Row>
                                            {cardData.slice(idx, idx + 3).map((item, i) => (
                                                <Col key={i} sm={4}>
                                                    <Card
                                                        style={{
                                                            width: '100%',
                                                            marginBottom: '100px',
                                                            backgroundColor: colors.primary[600],
                                                            pointerEvents: 'none',
                                                            borderRadius: '0px',
                                                        }}>
                                                        <Card.Img variant="top"
                                                            style={{
                                                                height: "400px",
                                                                marginBottom: "40px"
                                                            }}
                                                            src={item.imageSrc} />
                                                        <Card.Body
                                                            style={{
                                                                height: "250px"
                                                            }}>
                                                            <Card.Title
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontSize: '1.4rem',
                                                                    fontWeight: 'bold',
                                                                    color: colors.greenAccent[400],
                                                                }}>{item.title}</Card.Title>
                                                            <Card.Text
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontSize: '1.12rem',
                                                                    color: colors.grey[200],
                                                                }}
                                                            >{item.text}</Card.Text>
                                                            <Button
                                                                style={{
                                                                    backgroundColor: colors.blueAccent[700],
                                                                    marginTop: '20px',
                                                                    border: 'none',
                                                                    borderRadius: '0',
                                                                    fontSize: '1.12rem',
                                                                }}>Bilgi için Tıklayın</Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Carousel.Item>
                                );
                            }
                            return null;
                        })}
                    </Carousel>
                </Col>
            </Row>
        </>
    );
};

export default ServicesContent;
