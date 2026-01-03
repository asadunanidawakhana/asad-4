import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Public/Home';
import Shop from './pages/Public/Shop';
import ProductDetails from './pages/Public/ProductDetails';
import Categories from './pages/Public/Categories';
import Cart from './pages/Public/Cart';
import FacebookPixel from './components/FacebookPixel';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserLayout from './layouts/UserLayout';
import DashboardOverview from './pages/User/Dashboard';
import MyOrders from './pages/User/Orders';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminLogin from './pages/Admin/Login';

import ProductList from './pages/Admin/Products/ProductList';
import ProductForm from './pages/Admin/Products/ProductForm';

import Checkout from './pages/Public/Checkout';
import OrderList from './pages/Admin/Orders/OrderList';

import UserPrescriptions from './pages/User/Prescriptions';
import PrescriptionList from './pages/Admin/Prescriptions/PrescriptionList';

import CategoryList from './pages/Admin/Categories/CategoryList';
import CategoryForm from './pages/Admin/Categories/CategoryForm';
import BlogList from './pages/Admin/Blogs/BlogList';
import BlogForm from './pages/Admin/Blogs/BlogForm';
import Wishlist from './pages/User/Wishlist';

import About from './pages/Public/About';
import Contact from './pages/Public/Contact';
import Blog from './pages/Public/Blog';
import Profile from './pages/User/Profile';
import SavedAddresses from './pages/User/SavedAddresses';

import UserList from './pages/Admin/Users/UserList';
import TicketList from './pages/Admin/Tickets/TicketList';
import SupportTickets from './pages/User/SupportTickets';
import AdminReports from './pages/Admin/Reports.tsx';
import AdminSettings from './pages/Admin/Settings.tsx';



function App() {
  return (
    <>
      <FacebookPixel />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />

          {/* Static Pages */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard Routes */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="prescriptions" element={<UserPrescriptions />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="addresses" element={<SavedAddresses />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<SupportTickets />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Product Management */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />

          {/* Category Management */}
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />

          {/* Order Management */}
          <Route path="orders" element={<OrderList />} />
          <Route path="users" element={<UserList />} />
          <Route path="prescriptions" element={<PrescriptionList />} />
          <Route path="tickets" element={<TicketList />} />

          {/* Blog Management */}
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/new" element={<BlogForm />} />
          <Route path="blogs/edit/:id" element={<BlogForm />} />

          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
