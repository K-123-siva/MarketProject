import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import LoginPage from './pages/LoginPage';
import PostAdPage from './pages/PostAdPage';
import WishlistPage from './pages/WishlistPage';
import ChatPage from './pages/ChatPage';
import MyListingsPage from './pages/MyListingsPage';
import { useAuthStore } from './store/authStore';
import { useWishlistStore } from './store/wishlistStore';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const { loadUser, user } = useAuthStore();
  const { load } = useWishlistStore();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/listings" element={<Layout><ListingsPage /></Layout>} />
        <Route path="/listing/:id" element={<Layout><ListingDetailPage /></Layout>} />
        <Route path="/post-ad" element={<Layout><PostAdPage /></Layout>} />
        <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
        <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
        <Route path="/my-listings" element={<Layout><MyListingsPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
