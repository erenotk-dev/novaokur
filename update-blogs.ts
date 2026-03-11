import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const posts = [
    { 
        id: 'post_1', 
        content: 'Bilim kurgu edebiyatı, sınırları zorlamaya ve geleceğe dair ufkumuzu açmaya 2026 yılında da devam ediyor. Bu yıl öne çıkan eserlerde özellikle yapay zeka etiği, uzayda kolonileşmenin psikolojik etkileri ve alternatif evren teorileri sıkça işleniyor.\n\nListenin birinci sırasında, Arthur C. Clarke ödüllü yazarın yeni romanı "Neon Ufuklar" yer alıyor. Eser, siberpunk bir evrende geçen varoluşsal bir dedektiflik hikayesini anlatıyor. İkinci olarak "Kuantum Fısıltıları" adlı kitap, paralel evrenler arasında iletişim kurmayı başaran bir grubun gerilim dolu macerasını bizlere sunuyor.\n\nBu eserleri okurken sadece uzak galaksilere gitmeyecek, aynı zamanda insan olmanın ne anlama geldiğini bir kez daha sorgulayacaksınız. İster basılı formatta arşive ekleyin, isterseniz hemen e-kitap olarak indirin. Keyifli okumalar!'
    },
    { 
        id: 'post_2', 
        content: 'Yıllardır süregelen e-kitap ve basılı kitap çekişmesi, dijitalleşmenin zirveye ulaştığı günümüzde yeni boyutlar kazandı. Peki hangisi gerçekten daha avantajlı?\n\nBasılı kitapların o eşsiz kağıt kokusu, sayfaları çevirirken hissedilen dokunma duyusu ve kitaplıkta sergilendiğinde verdiği estetik haz, birçok okur için vazgeçilemez. Fiziksel bir nesneyle bağ kurmak insan doğasının bir parçasıdır. Ancak diğer yandan, binlerce kitabı incecik bir tablette yanında taşımak, karanlıkta okuma imkanı sunan arka aydınlatma ve anında yeni bir kitabı cihazına indirebilme hızı e-kitapları modern yaşamın vazgeçilmezi yapıyor.\n\nNovaOkur olarak biz, okurları bu seçimle kısıtlamak yerine "Premium Abonelik" modelimizle her iki dünyanın da kapılarını açıyoruz. Sevdiğiniz dergileri fiziksel olarak koleksiyonunuza eklerken, devasa bir dijital arşive de erişebilirsiniz.'
    },
    { 
        id: 'post_3', 
        content: 'Dijital bombardımana tutulduğumuz şu çağda, her ay düzenli olarak posta kutunuza veya kapınıza gelen bir dergi paketi, modern hayatın karmaşasında küçük bir mola vahasıdır.\n\nBir dergi aboneliği size sadece makaleler ve fotoğraflar sunmaz; aynı zamanda aidiyet hissi verir. İlgi alanlarınıza (bilim, tarih, edebiyat, moda) özel özenle seçilmiş içeriklerin bir kürasyon dahilinde size sunulması, internetteki bilgi kirliliğinden sıyrılmanın en zarif yoludur. Ayda bir kez teknolojiden uzaklaşıp kahvenizle birlikte fiziksel sayfaları karıştırmak, odaklanma sürenizi (attention span) iyileştiren kanıtlanmış bir pratiktir.\n\nGöz atma kültürünün yerini derinlemesine okumaya ve keşfetmeye bıraktığı bu modeli, NovaOkur ayrıcalığıyla deneyimleyerek kendi kişiyel kültür köşenizi oluşturabilirsiniz.' 
    }
  ];

  for (const p of posts) {
     try {
       await prisma.post.update({
         where: { id: p.id },
         data: { content: p.content }
       });
       console.log(`Updated post: ${p.id}`);
     } catch(e) {
       console.log(`Could not update ${p.id}, maybe it doesn't exist yet.`);
     }
  }

  console.log("Blog yazilari guncellendi!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
