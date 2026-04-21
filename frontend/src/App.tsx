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
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminListings from './pages/admin/AdminListings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminMessages from './pages/admin/AdminMessages';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAddListing from './pages/admin/AdminAddListing';
import { useAuthStore } from './store/authStore';
import { useWishlistStore } from './store/wishlistStore';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const { loadUser, user } = useAuthStore();
  const { load } = useWishlistStore();

  useEffect(() => { loadUser(); }, []);
  useEffect(() => { if (user) load(); }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Main Site */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/listings" element={<Layout><ListingsPage /></Layout>} />
        <Route path="/listing/:id" element={<Layout><ListingDetailPage /></Layout>} />
        <Route path="/post-ad" element={<Layout><PostAdPage /></Layout>} />
        <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
        <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
        <Route path="/my-listings" element={<Layout><MyListingsPage /></Layout>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="listings/new" element={<AdminAddListing />} />
          <Route path="materials/new" element={<AdminAddListing />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
