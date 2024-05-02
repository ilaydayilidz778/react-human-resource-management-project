import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import { tokens } from "../../scripst/theme";
import { useTheme } from '@mui/material';
import AboutUs from '../../../public/images/AboutUs.jpg';
import OurMission from '../../../public/images/OurMission.jpg';
import OurVision from '../../../public/images/OurVision.jpg';
import OurTeam from '../../../public/images/OurTeam.jpg';

const AboutContent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const aboutData = [
        {
            imageSrc: AboutUs,
            title: "HAKKIMIZDA",
            description: "HRHub, 2007 yılında kurulmuş, kısa sürede genelde Türkiye'nin ilk 500 şirketi arasında yer alan kurumsal firmalara hizmet vermeye başlamış, kurduğu sıcak ilişki ve doğru personel yönlendirmesi sayesinde müşterileri ile artan bir verimlilikle çalışmayı sürdürmektedir. Geniş kadrosunu sektörlerde ve pozisyonlarda uzmanlaştırarak farklılık yaratmayı başarmıştır. Satıştan mühendisliğe, mavi yakadan genel müdürlüğe kadar geniş bir yelpazede, konusunda uzman ve farklı sektörlerden kişileri bulmayı bu uzmanlaşma sayesinde sağlamıştır. Dolayısıyla HRHub adayları yüksek kabul görmüş ve bu sayede referansları ile büyümüştür. Teknolojinin yoğun kullanımı ve CRM sayesinde, Türkiye'nin her bölgesine bireysel ve toplu işe alımlarda başarıyla hizmet vermiştir."
        },
        {
            imageSrc: OurMission,
            title: "VİZYONUMUZ",
            description: "HRHub, 2015 yılı itibarı ile firmaların ve sektörlerin değişen ihtiyaçlarını karşılamak amacıyla işe alım süreçlerinden çıkarak, esnek iş gücü ve dönemsel personel kiralama hizmetini sürdürmektedir. Bu doğrultuda kendi bünyesinde çalışan personelleri firmalara kiralamakta ve böylece firmaların bordrosuna alamadığı veya almak istemediği personelleri firmalara temin etmektedir. Bu personeller firmanın kendi personeliymiş gibi çalışabilmektedir. Özellikle son yıllarda kadro sıkıntısı, gider gösterebilme, kendi ana işine odaklanma için diğer bölümleri dış kaynak (outsource) kullanma gereği vb sebepler ile artan talepleri karşılayan önemli firmalardan biri haline gelmektedir."
        },
        {
            imageSrc: OurVision,
            title: "DEĞERLERİMİZ",
            description: "İş Ahlakı: İşimizi etik değerlere uygun olarak yürütürüz ve dürüstlüğü esas alırız. Müşteri Memnuniyeti: Müşteri memnuniyetini sağlamak için kararlılıkla çalışırız ve müşterilerimizin beklentilerini aşmayı hedefleriz. Yenilikçilik: Sürekli olarak yenilikçi çözümler geliştirir, ileriye yönelik düşünürüz ve değişime ayak uydururuz. Takım Çalışması: Birlikte çalışmanın gücünü bilir, işbirliği içinde hareket eder ve birbirimize destek oluruz. Sosyal Sorumluluk: Topluma ve çevreye karşı sorumluluklarımızın bilincinde olarak, sürdürülebilirlik ilkelerine bağlı kalır ve toplumsal fayda sağlayacak projelere katkıda bulunuruz. Kalite: Müşteri odaklı yaklaşımımızla sürekli olarak kalite standartlarını yükseltir ve en üst düzeyde hizmet sunarız. Sürekli Gelişim: Bireysel ve kurumsal olarak sürekli öğrenmeyi ve gelişmeyi teşvik ederiz, kişisel ve profesyonel olarak kendimizi sürekli iyileştiririz."
        },
        {
            imageSrc: OurTeam,
            title: "EKİBİMİZ",
            description: "HRHub olarak, müşterilerimize en iyi hizmeti sunabilmek için bir araya gelmiş dinamik ve çeşitli bir ekibe sahibiz. Her biri kendi alanında uzmanlaşmış ve tutkulu olan ekibimiz, işlerine olan bağlılıkları ve müşterilerimize değer katma konusundaki kararlılıklarıyla bilinir. Aramızdaki etkili iletişim ve işbirliği, projelerimizi başarıya ulaştırmak için temel taşlarımızdandır. Müşteri memnuniyetini en üst düzeye çıkarmak ve her zaman öncelikli olarak müşteri ihtiyaçlarına odaklanmak için sürekli olarak çalışıyoruz. Profesyonellik, esneklik ve yenilikçilik ekibimizin temel değerleridir. Ekip ruhuyla bir araya gelerek, zorluklarla başa çıkıyor ve en zorlu projeleri bile başarıyla tamamlıyoruz. Müşterilerimize sadece hizmet sunmakla kalmıyor, aynı zamanda onlarla uzun vadeli bir ilişki kurmayı ve ortak hedeflere ulaşmayı hedefliyoruz."
        }
    ];

    return (

        <div className="row justify-content-center">
            <div className="col-12">
                <Carousel data-bs-theme="light" className='carousel' controls={false}>
                    {aboutData.map((item, index) => (
                        <Carousel.Item key={index}>
                            <div className="d-flex justify-content-center">
                                <div className="w-75">
                                    <img
                                        className="d-block w-100"
                                        src={item.imageSrc}
                                        alt={item.title}
                                        style={{ height: '100vh', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="w-50 d-flex align-items-center justify-content-center"
                                    style={{
                                        paddingRight: "75px",
                                        paddingLeft: "50px"
                                    }}>
                                    <div className='text-center'>
                                        <h2 className='fw-bold'
                                            style={{
                                                color: colors.greenAccent[500],
                                                marginBottom: "3rem",
                                                borderBottom: `2px solid ${colors.greenAccent[400]} `,
                                                fontSize: "3.2rem"
                                            }}>{item.title}</h2>
                                        {item.description.includes('\n') ? (
                                            <ul>
                                                {item.description.split('\n').map((line, idx) => (
                                                    <li key={idx}>{line}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p
                                                style={{
                                                    color: colors.grey[100],

                                                    fontSize: "1.02rem"
                                                }}>
                                                {item.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default AboutContent;
