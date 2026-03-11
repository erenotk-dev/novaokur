import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import Subscriptions from './pages/Subscriptions'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Blog from './pages/Blog'
import Checkout from './pages/Checkout'
import AdminRoute from './components/AdminRoute'
import Footer from './components/Footer'
import Contact from './pages/Contact'
import InfoPage from './pages/InfoPage'
import ProductDetail from './pages/ProductDetail'
import BlogDetail from './pages/BlogDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<InfoPage />} />
        <Route path="/faq" element={<InfoPage />} />
        <Route path="/returns" element={<InfoPage />} />
        <Route path="/shipping" element={<InfoPage />} />
        <Route path="/privacy" element={<InfoPage />} />
        
        {/* Sadece ADMIN Rolundeki Kullanicilar Girebilir */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        {/* Blog vb. sayfalar buraya eklenecek */}
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
