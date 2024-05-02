let expenses = [];

const expense1 = {
    id: 1,
    kullanici: {
        tcKimlikNumarasi: "12345678901",
        photoByte: "base64_encoded_photo_string_1",
        ad: "Ali",
        ikinciAd: "",
        soyad: "Yılmaz",
        ikinciSoyad: "",
    },
    izinTuru: {
        ad: "İzin Tipi 1",
    },
    tutar: 150.0,
    paraBirimi: "TL",
    talepTarihi: "2023-04-15",
    onayDurumu: true,
    talepYanitTarihi: "2023-04-16",
};

const expense2 = {
    id: 2,
    kullanici: {
        tcKimlikNumarasi: "23456789012",
        photoByte: "base64_encoded_photo_string_2",
        ad: "Ayşe",
        ikinciAd: "Fatma",
        soyad: "Kaya",
        ikinciSoyad: "",
    },
    izinTuru: {
        ad: "İzin Tipi 2",
    },
    tutar: 200.0,
    paraBirimi: "USD",
    talepTarihi: "2023-04-17",
    onayDurumu: false,
    talepYanitTarihi: "2023-04-18",
};

const expense3 = {
    id: 3,
    kullanici: {
        tcKimlikNumarasi: "34567890123",
        photoByte: "base64_encoded_photo_string_3",
        ad: "Mehmet",
        ikinciAd: "Ali",
        soyad: "Demir",
        ikinciSoyad: "",
    },
    izinTuru: {
        ad: "İzin Tipi 3",
    },
    tutar: 250.0,
    paraBirimi: "EUR",
    talepTarihi: "2023-04-19",
    onayDurumu: null, // Beklemede
    talepYanitTarihi: null,
};

expenses.push(expense1);
expenses.push(expense2);
expenses.push(expense3);

export const mockDataExpenses = expenses;
