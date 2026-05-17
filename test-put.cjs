const axios = require('axios');

async function testPut() {
  try {
    const res = await axios.put('https://novaokur.onrender.com/api/products/k1_zaman_makinesi', {
      title: "Zaman Makinesi (NovaOkur Tasarım Koyu Ciltli - 1. Baskı)",
      description: "H.G. Wells'in ölümsüz eseri Zaman Makinesi...",
      price: 249.9,
      costPrice: 100,
      stock: 500,
      type: "BOOK",
      format: "PHYSICAL",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80"
    });
    console.log("Success:", res.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

testPut();
