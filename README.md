# BSNote - Modern Not Defteri Uygulaması ✍️

**BSNote**, modern web teknolojileri ile geliştirilmiş, zengin içerik tiplerini (metin, kod, yapılacaklar listesi, video, müzik, görsel, dosya, etiketler) destekleyen kapsamlı bir not alma uygulamasıdır.

Bu proje, daha önce harici bir .NET servisi (`BsNotesServices`) olarak çalışan arka yüzü **Node.js + Express + Prisma (MySQL)** mimarisine taşıyarak; `frontend` ve `backend` servislerini tek bir monorepo yapısında birleştirmiştir.

---

## 🏗 Mimari ve Proje Yapısı

```
bsnotes/
├── frontend/                     # React (TypeScript + Tailwind CSS + Framer Motion)
│   ├── src/                      # Ön yüz bileşenleri, sayfalar ve servisler
│   ├── public/                   # Statik varlıklar
│   ├── Dockerfile                # Nginx tabanlı üretim Docker imajı
│   └── nginx.conf                # SPA yönlendirmeleri için Nginx ayarı
├── backend/                      # Node.js (Express + TypeScript + Prisma)
│   ├── src/                      # API endpoint'leri, servisler, middleware'ler
│   ├── prisma/                   # MySQL şeması ve Prisma konfigürasyonu
│   ├── uploads/                  # Yüklenen dosyalar
│   └── Dockerfile                # Multi-stage Node.js üretim Docker imajı
├── docker-compose.yml            # Frontend ve Backend orkestrasyonu
├── .env.example                  # Çevre değişkenleri şablonu
├── .env                          # Aktif çevre değişkenleri
└── README.md
```

---

## 🛠 Kullanılan Teknolojiler

### Frontend
- **React 19** & **TypeScript**
- **Tailwind CSS** (Modern ve duyarlı arayüz)
- **Framer Motion** (Animasyonlar ve geçişler)
- **Axios** (REST API iletişimi)
- **Prism.js** (Kod renklendirme)

### Backend
- **Node.js** & **Express**
- **TypeScript**
- **Prisma ORM** (Tip güvenli veritabanı yönetimi)
- **MySQL 8.0**
- **JWT** (JSON Web Token kimlik doğrulama)
- **Multer** (Dosya yükleme yönetimi)
- **Crypto MD5** (.NET ile tam uyumlu parola doğrulaması)

---

## 🚀 Hızlı Başlangıç (Docker Compose)

### 1. Ortam Değişkenlerini Ayarlayın
Kök dizindeki `.env.example` dosyasını `.env` olarak kopyalayın ve veritabanı bilgilerinizi düzenleyin:
```bash
cp .env.example .env
```

`.env` içeriği örneği:
```env
FRONTEND_PORT=3002
BACKEND_PORT=5002
REACT_APP_API_URL=https://bsnote.buraksaglik.com/api/
DATABASE_URL="mysql://kullanici:sifre@localhost:3306/ProductManagementDb"
JWT_KEY="GucluSecretKeyiniz123456!"
JWT_ISSUER="BsNotesServices"
JWT_AUDIENCE="BsNotesClient"
```

### 2. Docker Ağını Oluşturun (Gerekiyorsa)
Eğer sunucunuzda Nginx Proxy Manager kullanıyorsanız ve ağ henüz yoksa:
```bash
docker network create npm-network
```

### 3. Uygulamayı Başlatın
```bash
docker compose up -d --build
```

- **Frontend**: `http://localhost:3002`
- **Backend API**: `http://localhost:5002/api`
- **Sağlık Kontrolü**: `http://localhost:5002/api/health`

---

## 💻 Yerel Geliştirme (Local Development)

### Backend:
```bash
cd backend
npm install
npx prisma generate
# Veritabanı tablolarını eşitlemek için:
# npx prisma db push
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm start
```

---

## 📡 API Endpoint Haritası

| Metot | Endpoint | Yetki | Açıklama |
|---|---|---|---|
| `POST` | `/api/User/register` | Herkese Açık | Yeni kullanıcı kaydı |
| `POST` | `/api/User/login` | Herkese Açık | Kullanıcı girişi ve token alma |
| `GET` | `/api/User/users-async` | Bearer Token | Giriş yapan kullanıcının profil bilgileri |
| `PUT` | `/api/User/update` | Bearer Token | Kullanıcı profili güncelleme |
| `GET` | `/api/User/user-image` | Bearer Token | Kullanıcı profil görseli |
| `GET` | `/api/Workplace` | Bearer Token | Aktif çalışma alanlarını listeleme |
| `POST` | `/api/Workplace` | Bearer Token | Yeni çalışma alanı oluşturma |
| `PUT` | `/api/Workplace/:id` | Bearer Token | Çalışma alanı güncelleme |
| `POST` | `/api/Workplace/Delete` | Bearer Token | Çalışma alanlarını silme |
| `GET` | `/api/Note/Workplace/:id` | Bearer Token | Çalışma alanına ait notları getirme |
| `POST` | `/api/Note` | Bearer Token | Yeni not oluşturma |
| `PUT` | `/api/Note/:id` | Bearer Token | Not güncelleme |
| `POST` | `/api/Note/Delete` | Bearer Token | Notları ve alt içeriklerini silme |
| `GET` | `/api/Content/Note/:noteId` | Bearer Token | Nota ait içerik bloklarını getirme |
| `POST` | `/api/Content` | Bearer Token | İçerik bloğu ekleme |
| `PUT` | `/api/Content/:id` | Bearer Token | İçerik bloğu güncelleme |
| `POST` | `/api/Content/SortBy` | Bearer Token | Blok sıralamasını güncelleme |
| `POST` | `/api/File/upload` | Bearer Token | Dosya/görsel yükleme |
| `GET` | `/api/File/download/:key` | Herkese Açık | Dosya indirme / görüntüleme |
