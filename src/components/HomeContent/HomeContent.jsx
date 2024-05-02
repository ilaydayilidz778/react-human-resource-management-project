import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Carousel, Image } from 'react-bootstrap';
import './HomeContent.scss';
import FirstSlide from '../../../public/images/FirstSlide.jpg';
import SecondSlide from '../../../public/images/SecondSlide.jpg';
import ThirdSlide from '../../../public/images/ThirdSlide.jpg';
import FifthSlide from '../../../public/images/FifthSlide.jpg';
import { useTheme } from '@mui/material';
import { tokens } from "../../scripst/theme";

const HomeContent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const slides = [
        {
            image: FirstSlide,
            title: 'İNSAN KAYNAKLARI YÖNETİMİ',
            subTitle: 'EN İYİ İNSAN KAYNAKLARI YÖNETİM ÇÖZÜMLERİNİ TECRÜBE EDİN',
            content: 'Şirketimiz, insan kaynakları yönetimi konusunda liderdir ve müşterilerimize en iyi hizmeti sunmayı taahhüt eder.'
        },
        {
            image: SecondSlide,
            title: 'İZİN YÖNETİMLERİ ',
            subTitle: 'EN İYİ İNSAN KAYNAKLARI YÖNETİM ÇÖZÜMLERİNİ TECRÜBE EDİN',
            content: 'Müşterilerimize dijital pazarlama stratejileri konusunda rehberlik eder ve marka bilinirliğini artırmak, müşteri etkileşimini artırmak ve satışları artırmak için etkili çözümler sunarız.'
        },
        {
            image: ThirdSlide,
            title: 'VARDİYA VE İŞ TAKİBİ',
            subTitle: 'EN İYİ İNSAN KAYNAKLARI YÖNETİM ÇÖZÜMLERİNİ TECRÜBE EDİN',
            content: 'Web geliştirme alanında uzman ekibimiz, kullanıcı dostu, işlevsel ve etkileyici web siteleri oluşturmak için modern teknolojileri kullanır.'
        },
        {
            image: FifthSlide,
            title: 'VERİ ANALİZİ VE RAPORLAMA',
            subTitle: 'EN İYİ İNSAN KAYNAKLARI YÖNETİM ÇÖZÜMLERİNİ TECRÜBE EDİN',
            content: 'Veri analizi ve raporlama, işletmelerin verilerinden değerli içgörüler elde etmelerine ve stratejik kararlar almalarına yardımcı olur. Uzman ekibimiz, verilerinizi analiz eder ve size doğru raporları sunar.'
        },
    ];

    return (
        <div className="home-content">
            <Carousel className='slider'>
                {slides.map((slide, index) => (
                    <Carousel.Item key={index}>
                        <div className="slider-image-overlay"></div>
                        <Image
                            className="d-block w-100 slider-image"
                            src={slide.image}
                            alt={`Slide ${index + 1}`}
                        />
                        <Carousel.Caption className='slider-caption'>
                            <h1 className="content-subtitle" style={{ color: colors.grey[300] }}>{slide.subTitle}</h1>
                            <h2 className="content-title" style={{ color: colors.greenAccent[600] }}>{slide.title}</h2>
                            <p className="content-text">{slide.content}</p>
                            <Link to="/services"
                                style={{
                                    color: colors.greenAccent[500],
                                    fontSize: "1.15rem",
                                    fontWeight: 900,
                                }}>
                                DAHA FAZLA BİLGİ EDİN
                            </Link>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );

}

export default HomeContent;
