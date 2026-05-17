const axios = require('axios');

async function checkProfit() {
  try {
    const response = await axios.get('https://novaokur.onrender.com/api/products');
    const products = response.data;
    
    let totalProfit = 0;
    console.log('--- Ürün Bazlı Kâr Analizi ---');
    products.forEach(p => {
      const profitPerUnit = p.price - (p.costPrice || 0);
      const totalProductProfit = profitPerUnit * (p.stock || 0);
      totalProfit += totalProductProfit;
      
      console.log(`${p.title}:`);
      console.log(`  Fiyat: ${p.price} | Maliyet: ${p.costPrice || 0} | Stok: ${p.stock}`);
      console.log(`  Birim Kâr: ${profitPerUnit.toFixed(2)} | Toplam: ${totalProductProfit.toLocaleString('tr-TR')} ₺`);
    });
    
    console.log('\n==============================');
    console.log(`HESAPLANAN TOPLAM POTANSİYEL KÂR: ${totalProfit.toLocaleString('tr-TR')} ₺`);
    console.log('==============================');
  } catch (error) {
    console.error('Hata:', error.message);
  }
}

checkProfit();
