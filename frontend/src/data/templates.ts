export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'dev' | 'personal' | 'planning';
  categoryLabel: string;
  icon: string;
  tags: string;
  previewSummary: string;
  contents: {
    contentType: number;
    contentValue: string;
    order: number;
  }[];
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'meeting-notes',
    title: 'Toplantı Notları ve Kararlar',
    description: 'Toplantı gündemi, katılımcılar, alınan kararlar ve takip edilecek aksiyon listesi.',
    category: 'work',
    categoryLabel: 'İş & Toplantı',
    icon: 'FiUsers',
    tags: 'toplantı,gündem,aksiyon',
    previewSummary: 'Katılımcılar, Gündem Maddeleri, Alınan Kararlar ve Yapılacaklar Listesi',
    contents: [
      { contentType: 0, contentValue: 'Toplantı Notları', order: 0 },
      { contentType: 6, contentValue: 'Tarih: ' + new Date().toLocaleDateString('tr-TR') + ' | Katılımcılar: Proje Ekibi', order: 1 },
      { contentType: 1, contentValue: 'Gündem Maddeleri', order: 2 },
      { contentType: 6, contentValue: '1. Haftalık sprint değerlendirmesi ve mevcut blokajlar\n2. Yeni mimari gereksinimlerin gözden geçirilmesi', order: 3 },
      { contentType: 1, contentValue: 'Alınan Kararlar', order: 4 },
      { contentType: 6, contentValue: 'Backend servislerinin Node.js üzerinde birleştirilmesine ve testlerin tamamlanmasına karar verildi.', order: 5 },
      { contentType: 1, contentValue: 'Aksiyon Listesi (To-Do)', order: 6 },
      { contentType: 13, contentValue: 'API endpointlerini test et,Docker compose dosyasını sunucuda çalıştır,Dokümantasyonu ekiple paylaş', order: 7 },
      { contentType: 11, contentValue: '#toplantı,#sprint,#aksiyon', order: 8 }
    ]
  },
  {
    id: 'project-roadmap',
    title: 'Proje Yol Haritası ve Planlama',
    description: 'Proje hedefleri, kilometre taşları, kaynaklar ve görev dağılımı.',
    category: 'planning',
    categoryLabel: 'Planlama',
    icon: 'FiCompass',
    tags: 'proje,planlama,roadmap',
    previewSummary: 'Proje Özeti, Kilometre Taşları, Önemli Bağlantılar ve Fazlar',
    contents: [
      { contentType: 0, contentValue: 'Proje Yol Haritası (Roadmap)', order: 0 },
      { contentType: 6, contentValue: 'Bu döküman projenin ana hedeflerini ve teslimat takvimini özetler.', order: 1 },
      { contentType: 1, contentValue: 'Kilometre Taşları', order: 2 },
      { contentType: 6, contentValue: 'Faz 1: Mimari Kurulumu ve Veritabanı Modelleri\nFaz 2: Ön Yüz Entegrasyonu ve Testler\nFaz 3: Canlıya Çıkış ve İzleme', order: 3 },
      { contentType: 1, contentValue: 'Önemli Bağlantılar', order: 4 },
      { contentType: 14, contentValue: 'https://github.com/buraksaglik/bsnotes', order: 5 },
      { contentType: 1, contentValue: 'Öncelikli Görevler', order: 6 },
      { contentType: 13, contentValue: 'Docker ortamını hazırla,Tüm servis testlerini çalıştır,Staging ortamında doğrula', order: 7 },
      { contentType: 11, contentValue: '#proje,#roadmap,#faz1', order: 8 }
    ]
  },
  {
    id: 'daily-standup',
    title: 'Günlük Standup & Refleksiyon',
    description: 'Dün neler yaptım? Bugün ne yapacağım? Karşılaşılan engeller neler?',
    category: 'work',
    categoryLabel: 'İş & Takım',
    icon: 'FiCheckSquare',
    tags: 'standup,günlük,odak',
    previewSummary: 'Dün Yapılanlar, Bugünün Odak Noktaları ve Engel / Blokajlar',
    contents: [
      { contentType: 0, contentValue: 'Günlük Standup - ' + new Date().toLocaleDateString('tr-TR'), order: 0 },
      { contentType: 1, contentValue: 'Dün Neler Yaptım?', order: 1 },
      { contentType: 6, contentValue: '• Backend mimarisi TypeScript ve Express ile yapılandırıldı.\n• Docker yapılandırması tamamlandı.', order: 2 },
      { contentType: 1, contentValue: 'Bugün Ne Yapacağım?', order: 3 },
      { contentType: 13, contentValue: 'Templates modalını tamamla,Import ve Export akışını doğrula,Çöp kutusu 15 gün testini yap', order: 4 },
      { contentType: 1, contentValue: 'Blokajlar / Engeller', order: 5 },
      { contentType: 6, contentValue: 'Şu an bilinen bir blokaj bulunmuyor.', order: 6 },
      { contentType: 11, contentValue: '#standup,#günlük,#hedef', order: 7 }
    ]
  },
  {
    id: 'developer-cheatsheet',
    title: 'Yazılım Geliştirici Kod Rehberi',
    description: 'Kod blokları, sık kullanılan komutlar, mimari notlar ve kaynaklar.',
    category: 'dev',
    categoryLabel: 'Yazılım',
    icon: 'FiCode',
    tags: 'kod,rehber,developer',
    previewSummary: 'Açıklama, Kod Parçacıkları (Snippet) ve Referans Kaynaklar',
    contents: [
      { contentType: 0, contentValue: 'Geliştirici Kod Rehberi (Cheat Sheet)', order: 0 },
      { contentType: 6, contentValue: 'Sık kullanılan yardımcı fonksiyonlar ve komut satırı örnekleri.', order: 1 },
      { contentType: 1, contentValue: 'Pratik JavaScript / TypeScript Fonksiyonu', order: 2 },
      { contentType: 12, contentValue: '// Güvenli JSON ayrıştırıcı\nexport function safeJsonParse(str, fallback) {\n  try {\n    return JSON.parse(str);\n  } catch (err) {\n    return fallback;\n  }\n}', order: 3 },
      { contentType: 1, contentValue: 'Referans Bağlantısı', order: 4 },
      { contentType: 14, contentValue: 'https://developer.mozilla.org', order: 5 },
      { contentType: 1, contentValue: 'Geliştirme Yapılacaklar', order: 6 },
      { contentType: 13, contentValue: 'Birim testleri yaz,Tip tanımlarını kontrol et,Linter hatalarını düzelt', order: 7 },
      { contentType: 11, contentValue: '#dev,#typescript,#snippet', order: 8 }
    ]
  },
  {
    id: 'weekly-planner',
    title: 'Haftalık Planlayıcı & Alışkanlıklar',
    description: 'Haftalık hedefler, yapılacaklar listesi ve alışkanlık takip tablosu.',
    category: 'personal',
    categoryLabel: 'Kişisel',
    icon: 'FiCalendar',
    tags: 'haftalık,plan,alışkanlık',
    previewSummary: 'Haftalık Hedefler, Günlük Kontrol Listesi ve Notlar',
    contents: [
      { contentType: 0, contentValue: 'Haftalık Planlayıcı', order: 0 },
      { contentType: 6, contentValue: 'Bu haftanın en önemli 3 hedefi ve günlük takip listesi.', order: 1 },
      { contentType: 1, contentValue: 'Haftanın Öncelikleri', order: 2 },
      { contentType: 13, contentValue: 'bsnotes projesini sunucuda yayına al,Kitap oku (en az 50 sayfa),Spor ve yürüyüş (haftada 3 gün)', order: 3 },
      { contentType: 1, contentValue: 'Haftalık Değerlendirme Notları', order: 4 },
      { contentType: 6, contentValue: 'Hafta boyunca kaydedilen ilerleme ve önümüzdeki hafta için çıkarılan dersler.', order: 5 },
      { contentType: 11, contentValue: '#haftalık,#odak,#kişisel', order: 6 }
    ]
  },
  {
    id: 'brainstorming',
    title: 'Beyin Fırtınası & Fikir Analizi',
    description: 'Problem tanımı, yeni fikirler, artı & eksi yönler ve sonraki adımlar.',
    category: 'planning',
    categoryLabel: 'Fikir & Analiz',
    icon: 'FiCpu',
    tags: 'fikir,analiz,beyinfırtınası',
    previewSummary: 'Problem Tanımı, Fikir Önerileri ve Değerlendirme',
    contents: [
      { contentType: 0, contentValue: 'Beyin Fırtınası & Fikir Havuzu', order: 0 },
      { contentType: 6, contentValue: 'Çözülmesi hedeflenen ana problem ve yenilikçi çözüm yaklaşımları.', order: 1 },
      { contentType: 1, contentValue: 'Problem Tanımı', order: 2 },
      { contentType: 6, contentValue: 'Kullanıcıların notlarını başkalarıyla kolayca paylaşabilmesi ve hazır şablonlarla hız kazanması.', order: 3 },
      { contentType: 1, contentValue: 'Olası Çözümler & Fikirler', order: 4 },
      { contentType: 13, contentValue: 'Tek tıkla JSON export/import özelliği ekle,Hazır şablon galerisi sun,Çöp kutusu ile silinen notları güvenceye al', order: 5 },
      { contentType: 1, contentValue: 'Sonraki Adım', order: 6 },
      { contentType: 6, contentValue: 'Özellikleri kullanıcılara sunup geri bildirimleri toplamak.', order: 7 },
      { contentType: 11, contentValue: '#fikir,#analiz,#çözüm', order: 8 }
    ]
  }
];

