import { Routes, Route } from 'react-router-dom';
// Import Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// // Import Page Components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import AuthCallback from './pages/AuthCallback';
import AccountProfilePage from './pages/AccountProfilePage';

import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
// // import CheckoutPage from './pages/CheckoutPage';
// // import OrderSuccessPage from './pages/OrderSuccessPage';
// // import DashboardPage from './pages/DashboardPage';
// // import ProfilePage from './pages/ProfilePage';
// // import OrderHistoryPage from './pages/OrderHistoryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <Header />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Product Pages */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />

          {/* protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="container py-5">Dashboard placeholder</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/profile"
            element={
              <ProtectedRoute>
                <AccountProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders"
            element={
              <ProtectedRoute>
                <div className="container py-5">account orders</div>
              </ProtectedRoute>
            }
          />

          {/* Authentication Pages */}
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
          
          {/* Cart & Checkout */}
          <Route path="/cart" element={<CartPage />} />
          {/* NOTE: Checkout and Order Success will later be protected routes */}
          {/* <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} /> */}

          {/* Protected User Account Pages */}
          {/* These will require the user to be logged in */}
          {/* <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/orders" element={<OrderHistoryPage />} /> */}

          {/* Catch-all 404 Not Found Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

// // -------------------------------------------------------------------
// // CREATE THE FOLLOWING PLACEHOLDER PAGE FILES
// // Create a new folder `src/pages` and add these files inside it.
// // This will prevent your app from crashing because of missing components.
// // -------------------------------------------------------------------

// // // src/pages/AboutPage.jsx
// // const AboutPage = () => <div><h1>About Us</h1></div>;
// // export default AboutPage;

// // // src/pages/ContactPage.jsx
// // const ContactPage = () => <div><h1>Contact Us</h1></div>;
// // export default ContactPage;

// // // src/pages/FaqPage.jsx
// // const FaqPage = () => <div><h1>FAQ</h1></div>;
// // export default FaqPage;

// // // src/pages/TermsPage.jsx
// // const TermsPage = () => <div><h1>Terms & Conditions</h1></div>;
// // export default TermsPage;

// // // src/pages/PrivacyPolicyPage.jsx
// // const PrivacyPolicyPage = () => <div><h1>Privacy Policy</h1></div>;
// // export default PrivacyPolicyPage;

// // // src/pages/LoginPage.jsx
// // const LoginPage = () => <div><h1>Login Page</h1></div>;
// // export default LoginPage;

// // // src/pages/RegisterPage.jsx
// // const RegisterPage = () => <div><h1>Register Page</h1></div>;
// // export default RegisterPage;

// // // src/pages/ForgotPasswordPage.jsx
// // const ForgotPasswordPage = () => <div><h1>Forgot Password</h1></div>;
// // export default ForgotPasswordPage;

// // // src/pages/ProductsPage.jsx
// // const ProductsPage = () => <div><h1>Products Page</h1></div>;
// // export default ProductsPage;

// // // src/pages/ProductDetailPage.jsx
// // const ProductDetailPage = () => <div><h1>Product Detail Page</h1></div>;
// // export default ProductDetailPage;

// // // src/pages/CartPage.jsx
// // const CartPage = () => <div><h1>Shopping Cart</h1></div>;
// // export default CartPage;

// // // src/pages/CheckoutPage.jsx
// // const CheckoutPage = () => <div><h1>Checkout Page</h1></div>;
// // export default CheckoutPage;

// // // src/pages/OrderSuccessPage.jsx
// // const OrderSuccessPage = () => <div><h1>Order Success!</h1></div>;
// // export default OrderSuccessPage;

// // // src/pages/DashboardPage.jsx
// // const DashboardPage = () => <div><h1>User Dashboard</h1></div>;
// // export default DashboardPage;

// // // src/pages/ProfilePage.jsx
// // const ProfilePage = () => <div><h1>User Profile</h1></div>;
// // export default ProfilePage;

// // // src/pages/OrderHistoryPage.jsx
// // const OrderHistoryPage = () => <div><h1>Order History</h1></div>;
// // export default OrderHistoryPage;
