import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();

  const products = [
    // ----------------------------------------------------
    // KATEGORI: KITAPLAR (6 Adet)
    // ----------------------------------------------------
    { 
      id: 'k1_zaman_makinesi', 
      title: 'Zaman Makinesi (NovaOkur Tasarım Koyu Ciltli - 1. Baskı)', 
      description: 'H.G. Wells\'in ölümsüz eseri Zaman Makinesi... Sadece 500 adet basılmış, altın varaklı ve koyu mavi bez ciltli bu özel edisyon tamamen NovaOkur üyeleri için tasarlandı.\n\nKitaplığınıza değer katacak bu premium baskı, koleksiyonerler için sınırlı sayıda üretilmiştir. Eşşiz kapak tasarımı ve kaliteli sayfa dokusuyla okuma deneyiminizi bir üst seviyeye taşıyın.', 
      price: 249.90, type: 'BOOK', format: 'PHYSICAL', stock: 500,
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80' 
    },
    { 
      id: 'k2_yapay_zeka', 
      title: 'Yapay Zeka ve E-Ticaretin Geleceği (E-Kitap)', 
      description: 'E-Ticaret dünyası dönüşüyor! Yapay zekanın pazar dinamiklerini nasıl değiştireceğini verilerle inceleyen bu kapsamlı rapor, vizyonunuzu genişletecek.\n\nSatın aldıktan saniyeler sonra bilgisayarınıza indirebilir ve hemen okumaya başlayabilirsiniz. İş dünyasındaki yeni trendleri yakalamak isteyenler için vazgeçilmez bir e-kitap kaynağı.', 
      price: 35.0, type: 'BOOK', format: 'DIGITAL', stock: 9999,
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80' 
    },
    { 
      id: 'k3_dune', 
      title: 'Dune: Çöl Gezegeni - Özel İllüstrasyonlu Baskı', 
      description: 'Frank Herbert’in bilim kurgu başyapıtı Dune, özel çizimleri ve kalın dokulu kağıdıyla yeniden hayat buluyor.\n\nArrakis gezegeninin acımasız çöllerinde geçen bu epik macerayı okurken, kitabın her sayfasında yer alan görsellerle o dünyaya adım atacaksınız. Koleksiyoner kütüphanelerinin vazgeçilmezi.', 
      price: 185.50, type: 'BOOK', format: 'PHYSICAL', stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80' 
    },
    { 
      id: 'k4_kucuk_prens', 
      title: 'Küçük Prens (Cep Boy & İpek Kapak)', 
      description: 'Antoine de Saint-Exupéry’nin zamansız klasik eseri Küçük Prens, her an yanınızda taşıyabilmeniz için özel cep boy formatıyla karşınızda.\n\nYumuşacık ipek kaplı yüzeyi ve minimalist tasarımıyla hem kendinize hem de sevdiklerinize harika bir hediye alternatifi.', 
      price: 45.00, type: 'BOOK', format: 'PHYSICAL', stock: 350,
      imageUrl: 'https://images.unsplash.com/photo-1542867623-2895f5144b62?w=500&q=80' 
    },
    { 
      id: 'k5_sapiens', 
      title: 'Sapiens: Hayvanlardan Tanrılara (E-Kitap)', 
      description: 'İnsanlık tarihinin kökenlerine doğru sarsıcı bir yolculuk. Yuval Noah Harari’nin tüm dünyada milyonlarca satan eseri şimdi dijital cihazlarınızda.\n\nHiçbir kargo beklemeden, yolda, işte veya evde anında okumaya başlayın.', 
      price: 49.90, type: 'BOOK', format: 'DIGITAL', stock: 9999,
      imageUrl: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=500&q=80' 
    },
    { 
      id: 'k6_suc_ve_ceza', 
      title: 'Suç ve Ceza - Keten Cilt (Dostoyevski)', 
      description: 'Rus edebiyatının zirve noktalarından biri olan Suç ve Ceza, Raskolnikov\'un psikolojik buhranlarını en derin şekilde hissettiren eşsiz bir eser.\n\nBu özel baskı, esnemeyen keten cildi ve altın varaklı sırt yazılarıyla kütüphanenizin baş köşesinde yer almayı hak ediyor.', 
      price: 210.00, type: 'BOOK', format: 'PHYSICAL', stock: 65,
      imageUrl: 'https://images.unsplash.com/photo-1456615074700-1dc12aa7364d?w=500&q=80' 
    },

    // ----------------------------------------------------
    // KATEGORI: DERGILER (6 Adet)
    // ----------------------------------------------------
    { 
      id: 'd1_socrates_kutu', 
      title: 'Socrates & Nitelikli Kahve (Aylık Kutu Seti)', 
      description: 'Her ay spor kültürünün en kaliteli yazılarını kahvenizi yudumlayarak okuma ayrıcalığına sahip olun. Bu özel paketimiz aylık olarak özenle hazırlanır ve kapınıza teslim edilir.\n\nPaket İçeriği:\n- 1 Adet Socrates Aylık Spor Dergisi\n- 100gr Taze Kavrulmuş Filtre Kahve\n- NovaOkur Özel Tasarım Ayraç', 
      price: 185.0, type: 'MAGAZINE', format: 'PHYSICAL', stock: 45, // Kritik stok ornegi
      imageUrl: 'https://images.unsplash.com/photo-1540324155970-145aa81444de?w=500&q=80' 
    },
    { 
      id: 'd2_national', 
      title: 'Gezegenin Keşfi (Fotoğraf Dergisi - PDF)', 
      description: 'Dünyanın en ücra köşelerinden, nefes kesen doğa olaylarına ve nesli tükenmekte olan canlı türlerine dair muhteşem bir görsel şölen.\n\nBu yüksek çözünürlüklü dijital dergiyi tabletinizden veya bilgisayarınızdan tüm detaylarıyla inceleyebilirsiniz.', 
      price: 19.90, type: 'MAGAZINE', format: 'DIGITAL', stock: 9999,
      imageUrl: 'https://images.unsplash.com/photo-1498677231914-50efe6bd8f16?w=500&q=80' 
    },
    { 
      id: 'd3_kafkaokur', 
      title: 'Kafkaokur Fikir ve Sanat Dergisi - Yeni Sayı', 
      description: 'Türkiye\'nin en çok okunan edebiyat, fikir ve sanat dergilerinden biri olan Kafkaokur\'un yepyeni sayısı raflarda.\n\nBavulun dergisinde bu ay: Kafka\'nın Prag günleri, modern şiirin yükselişi ve bağımsız sinema incelemeleri var.', 
      price: 35.00, type: 'MAGAZINE', format: 'PHYSICAL', stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1543329094-13bb01c324af?w=500&q=80' 
    },
    { 
      id: 'd4_pop_science', 
      title: 'Geleceğin Teknolojileri Özel Sayısı (Dergi)', 
      description: 'Kuantum bilgisayarlarından Mars görevlerine, genetik kurgudan yapay zekaya kadar bilimin ufkunu açan dosya konularıyla Popüler Bilim özel sayısı.\n\n250 sayfalık kalın ve kuşe kağıda basılı bu arşivlik sayı, bilim meraklıları için özenle hazırlandı.', 
      price: 65.00, type: 'MAGAZINE', format: 'PHYSICAL', stock: 85,
      imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80' 
    },
    { 
      id: 'd5_vogue', 
      title: 'Moda ve Mimari İncelemeleri (Dijital Sayı)', 
      description: 'Bu ayın odak noktasında, dönemin en ünlü kıyafet tasarımcıları ile fütüristik iç mimarinin ortak kesişimi inceleniyor.\n\nDijital olarak anında erişebileceğiniz bu moda ve mimari ortak sayısı, renkleri tabletinizden doyasıya yaşamanız için optimize edildi.', 
      price: 25.00, type: 'MAGAZINE', format: 'DIGITAL', stock: 9999,
      imageUrl: 'https://images.unsplash.com/photo-1512404090956-2db1ff1db5ed?w=500&q=80' 
    },
    { 
      id: 'd6_bavul', 
      title: 'Bavul Dergisi - "Yol Açık, Yola Çık"', 
      description: 'Sokak edebiyatı, seyahat yazıları ve bol bol umut! Bavul dergisinin en son sayısında tren yolculuklarının romantizmine kapılacaksınız.\n\nDeneme yazıları, şiirler ve röportajlarla dolu dopdolu bir "Yol" sayısı sizleri bekliyor.', 
      price: 28.00, type: 'MAGAZINE', format: 'PHYSICAL', stock: 210,
      imageUrl: 'https://images.unsplash.com/photo-1533038676646-e5c7efed49f6?w=500&q=80' 
    },

    // ----------------------------------------------------
    // KATEGORI: AKSESUARLAR TAKIM (6 Adet)
    // ----------------------------------------------------
    { 
      id: 'a1_bez_canta', 
      title: 'NovaOkur Özel Tasarım Siyah Bez Çanta', 
      description: 'Hem çevre dostu hem de şık! NovaOkur kalitesiyle üretilen bu bez çanta ile hem kitaplarınızı güvenle taşıyabilir hem de tarzınızı sokağa yansıtabilirsiniz.\n\n%100 biyolojik olarak parçalanabilen doğal pamuktan üretilmiştir. Uzun yıllar kullanılabilecek dayanıklılığa ve geniş hacme sahiptir.', 
      price: 89.90, type: 'ACCESSORY', format: 'PHYSICAL', stock: 200, 
      imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80' 
    },
    { 
      id: 'a2_kupa', 
      title: 'Seramik Okuma Kupası ("Sadece 1 Bölüm Daha")', 
      description: 'Kitap okurken kahvenizin veya çayınızın soğumasına engel olmak biraz zor... Ama bu kalın duvarlı mat siyah seramik kupa, içimi çok keyifli kılıyor.\n\nÜzerindeki "Sadece Bir Bölüm Daha" mottosuyla, uzun gece okumalarının en sadık yoldaşı.', 
      price: 115.00, type: 'ACCESSORY', format: 'PHYSICAL', stock: 80, 
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' 
    },
    { 
      id: 'a3_okuma_isigi', 
      title: 'Esnek Kitap Okuma Işığı (Şarjlı & LED)', 
      description: 'Geceleri, başkalarını rahatsız etmeden kitabınıza gömülmek isteyenler için mükemmel bir icat.\n\nSayfaya mandalla tutturulur, 3 farklı renk tonu ayarlanabilir ve tek şarjla 10 saate kadar kesintisiz okuma süresi sunar. Göz yormayan sarı ışığı ile huzurlu bir ortam yaratır.', 
      price: 159.00, type: 'ACCESSORY', format: 'PHYSICAL', stock: 45, // Kritik stok urunu
      imageUrl: 'https://images.unsplash.com/photo-1588666309858-a551de74ab89?w=500&q=80' 
    },
    { 
      id: 'a4_kitap_tutucu', 
      title: 'Ahşap Başparmak Kitap Tutucu', 
      description: 'Kalın bir kitabı tek elle okumanın zorluğunu hepimiz biliriz. Baş parmağınıza takılan bu minimal ahşap ürün sayesinde, yüzlerce sayfalık ciltli eserleri bile tek elinizle yorulmadan açık tutabilirsiniz.\n\nEl isçiliği ile üretilmiş doğal ceviz ağacından yapılmıştır.', 
      price: 55.00, type: 'ACCESSORY', format: 'PHYSICAL', stock: 350, 
      imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&q=80' 
    },
    { 
      id: 'a5_ayrac_seti', 
      title: 'Vintage Metal Ayraç Seti (3\'lü)', 
      description: 'Sıradan karton ayraçlardan sıkıldıysanız, kitabınızın sayfaları arasında ışıldayan gümüş renkli, paslanmaz metalden oyulmuş bu yaprak tasarımlı ayraçları denemelisiniz.\n\nSet olarak gönderilir ve özel NovaOkur kutusunda gelir. Hediyelik olarak şık bir tercihtir.', 
      price: 79.90, type: 'ACCESSORY', format: 'PHYSICAL', stock: 120, 
      imageUrl: 'https://images.unsplash.com/photo-1524578589255-a0ca0635293d?w=500&q=80' 
    },
    { 
      id: 'a6_defter', 
      title: 'NovaOkur Özel Çizgisiz Not Defteri', 
      description: 'Okuduğunuz romanlardan notlar almak, altını çizdiğiniz cümleleri listelemek veya sadece en iyi fikirlerinizi karalamak için...\n\nSuni deri kaplamalı, sayfaları fildişi renginde 160 sayfalık bu premium not defteri çantanın değişmez bir parçası olacak.', 
      price: 65.00, type: 'ACCESSORY', format: 'PHYSICAL', stock: 250, 
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80' 
    }
  ];

  await prisma.product.createMany({
    data: products
  });

  console.log("TAM 18 ADET URUN EKLENDI! Seed basarili.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
