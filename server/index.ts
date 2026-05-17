import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: 'sandbox-apiKeyMOCK', // TODO: Gercek Sandbox veya Canli API Key
  secretKey: 'sandbox-secretKeyMOCK', // TODO: Gercek Sandbox veya Canli Secret Key
  uri: 'https://sandbox-api.iyzipay.com'
});

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'varsayilan-guvenli-sifre'; 

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- URUN (PRODUCT) ENDPOINT'LERI ---

// Tum urunleri getir
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Urunler getirilemedi." });
  }
});

// Yeni urun ekle
app.post('/api/products', async (req, res) => {
  const { title, description, price, costPrice, type, format, stock, imageUrl } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        costPrice: costPrice ? parseFloat(costPrice) : 0,
        type,
        format,
        stock: parseInt(stock),
        imageUrl
      }
    });
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Urun eklenemedi." });
  }
});

// Urunu sil
app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Urun silinemedi." });
  }
});

// Urunu guncelle
app.put('/api/products/:id', async (req, res) => {
  const { title, description, price, costPrice, type, format, stock, imageUrl } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        costPrice: costPrice !== undefined ? parseFloat(costPrice) : undefined,
        type,
        format,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        imageUrl
      }
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Urun Guncelleme Hatasi:", error);
    res.status(500).json({ error: "Urun guncellenemedi." });
  }
});

// --- KULLANICI YONETIMI (AUTH) ENDPOINT'LERI ---

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Bu email adresi zaten kullanılıyor." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Eger kayit olan e-posta sana ozel belirttigimiz "admin@sahafdergi.com" ise ona VIP (ADMIN) yetkisi ver.
    const userRole = email === 'admin@sahafdergi.com' ? 'ADMIN' : 'USER';
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole
      }
    });

    res.json({ success: true, message: "Kayıt başarılı! VIP yetkileriniz ayarlanmış olabilir." });
  } catch (error) {
    res.status(500).json({ error: "Kayıt işlemi başarısız oldu." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(400).json({ error: "Hatalı e-posta veya şifre." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Hatalı e-posta veya şifre." });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Giriş işlemi başarısız oldu." });
  }
});

// --- BLOG ENDPOINT'LERI ---

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Blog yazilari getirilemedi." });
  }
});

app.post('/api/posts', async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        content,
        imageUrl,
        authorName: 'NovaOkur Editör' 
      }
    });
    res.json(newPost);
  } catch (error) {
    console.error("Blog Ekleme Hatasi:", error);
    res.status(500).json({ error: "Blog yazısı eklenemedi." });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    const updatedPost = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        imageUrl
      }
    });
    res.json(updatedPost);
  } catch (error) {
    console.error("Blog Guncelleme Hatasi:", error);
    res.status(500).json({ error: "Blog guncellenemedi." });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await prisma.post.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Blog yazısı silinemedi." });
  }
});

// --- SITE AYARLARI ENDPOINT'LERI ---

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Site ayarlari getirilemedi." });
  }
});

app.post('/api/settings', async (req, res) => {
  const { heroTitle, heroSubtitle, bannerTitle, bannerDesc } = req.body;
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { heroTitle, heroSubtitle, bannerTitle, bannerDesc }
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: { heroTitle, heroSubtitle, bannerTitle, bannerDesc }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Site ayarlari guncellenemedi." });
  }
});

// --- MUSTERI ILISKILERI VE KISISELLESTIRME (GOREV A & B) ---

// 1. Bir urune ait yorumlari getir
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    // @ts-ignore
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Yorumlar getirilemedi." });
  }
});

// 2. Bir urune yorum yap (Topluluk Hissi)
app.post('/api/products/:id/reviews', async (req, res) => {
  const { rating, comment, userId } = req.body;
  const productId = req.params.id;

  try {
    // @ts-ignore
    const newReview = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId,
        productId
      },
      include: { user: { select: { name: true } } }
    });
    res.json(newReview);
  } catch (error) {
    console.error("Yorum Ekleme Hatasi:", error);
    res.status(500).json({ error: "Yorum eklenemedi." });
  }
});

// 3. Basit AI Oneri Algoritmasi (Bunu alanlar bunlari da inceledi)
app.get('/api/recommendations/:productId', async (req, res) => {
  try {
    // Ilgili urunu bul
    const currentProduct = await prisma.product.findUnique({
      where: { id: req.params.productId }
    });

    if (!currentProduct) {
      return res.status(404).json({ error: "Urun bulunamadi." });
    }

    // Ayni formatta (Basili veya E-kitap) veya ayni tipte olan baska 3 urunu rastgele sec
    const recommendations = await prisma.product.findMany({
      where: {
        id: { not: currentProduct.id },
        OR: [
          { type: currentProduct.type },
          { format: currentProduct.format }
        ]
      },
      take: 3
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Oneriler getirilemedi." });
  }
});

// --- SETTINGS ENDPOINTS ---

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {}
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Ayarlar getirilemedi." });
  }
});

app.post('/api/settings', async (req, res) => {
  const { heroTitle, heroSubtitle, bannerTitle, bannerDesc, instagramUrl, twitterUrl } = req.body;
  try {
    const settings = await prisma.siteSettings.findFirst();
    let updated;
    if (settings) {
      updated = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { heroTitle, heroSubtitle, bannerTitle, bannerDesc, instagramUrl, twitterUrl }
      });
    } else {
      updated = await prisma.siteSettings.create({
        data: { heroTitle, heroSubtitle, bannerTitle, bannerDesc, instagramUrl, twitterUrl }
      });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Ayarlar guncellenemedi." });
  }
});

// --- IYZICO ODEME ENTEGRASYONU ---

app.post('/api/payments/initialize', async (req, res) => {
  const { buyerName, address, city, items, totalPrice } = req.body;
  
  // Basit Iyzico Istek Modeli
  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: 'NOVA-' + Date.now(),
    price: totalPrice.toString(),
    paidPrice: totalPrice.toString(),
    currency: Iyzipay.CURRENCY.TRY,
    basketId: 'B-' + Date.now(),
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: 'http://localhost:5173/api/payments/callback', // Gercekte uygulamanin veya backend'in callback URL'si
    enabledInstallments: [2, 3, 6, 9],
    buyer: {
      id: 'BY789',
      name: buyerName.split(' ')[0] || 'Nova',
      surname: buyerName.split(' ').slice(1).join(' ') || 'Okur',
      gsmNumber: '+905350000000',
      email: 'email@email.com',
      identityNumber: '74300864791',
      lastLoginDate: '2023-10-05 12:43:35',
      registrationDate: '2023-04-21 15:12:09',
      registrationAddress: address,
      ip: req.ip || '85.34.78.112',
      city: city,
      country: 'Turkey',
      zipCode: '34732'
    },
    shippingAddress: {
      contactName: buyerName,
      city: city,
      country: 'Turkey',
      address: address,
      zipCode: '34742'
    },
    billingAddress: {
      contactName: buyerName,
      city: city,
      country: 'Turkey',
      address: address,
      zipCode: '34742'
    },
    basketItems: items.map((item: any) => ({
      id: item.id || 'BI101',
      name: item.title || 'Urun',
      category1: 'Kategori',
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toString()
    }))
  };

  iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
    if (err) {
      console.error("Iyzico Error:", err);
      return res.status(500).json({ error: "Ödeme başlatılamadı." });
    }
    // Result icinde paymentPageUrl ve token bulunur.
    res.json(result);
  });
});

app.post('/api/payments/callback', async (req, res) => {
  // Iyzico bu adrese POST atar
  const { token } = req.body;
  
  if (!token) {
    return res.redirect('http://localhost:5173/checkout?status=failed');
  }

  // Token'i Iyzico'dan dogrula
  iyzipay.checkoutForm.retrieve({
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    token: token
  }, (err: any, result: any) => {
    if (err || result.status !== 'success') {
      return res.redirect('http://localhost:5173/checkout?status=failed');
    }
    // Odeme basarili, kullaniciyi frontend basarili sayfasina yonlendir
    res.redirect('http://localhost:5173/checkout?status=success');
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API Sunucusu http://localhost:${PORT} portunda calisiyor.`);
});
