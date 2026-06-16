import Toast from '../components/Toast';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { usePhones } from '../hooks/usePhones';
import { useToast } from '../hooks/useToast';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import MyOrdersPage from './MyOrdersPage';
import CustomerHomePage from './CustomerHomePage';
import CustomerLayout from './CustomerLayout';
import './CustomerApp.css';

function CustomerApp() {
  const auth = useAuth();
  const { toast, showToast } = useToast();
  const phones = usePhones({ enabled: true, showToast });
  const cart = useCart();

  const handleAddToCart = (phone) => {
    cart.addToCart(phone);
    showToast('Đã thêm sản phẩm vào giỏ hàng');
  };

  const renderPage = () => {
    if (auth.currentPage === 'login') {
      return (
        <LoginPage
          onLoginSuccess={auth.handleLoginSuccess}
          onNavigateToRegister={() => auth.navigateTo('register')}
        />
      );
    }

    if (auth.currentPage === 'register') {
      return <RegisterPage onNavigateToLogin={() => auth.navigateTo('login')} />;
    }

    if (auth.currentPage === 'profile') {
      return auth.currentUser ? (
        <ProfilePage />
      ) : (
        <LoginPage
          onLoginSuccess={auth.handleLoginSuccess}
          onNavigateToRegister={() => auth.navigateTo('register')}
        />
      );
    }

    if (auth.currentPage === 'cart') {
      return auth.currentUser ? (
        <CartPage
          items={cart.items}
          totalPrice={cart.totalPrice}
          onUpdateQuantity={cart.updateQuantity}
          onRemove={cart.removeFromCart}
          onCheckout={() => auth.navigateTo('checkout')}
          onContinueShopping={() => auth.navigateTo('home')}
        />
      ) : (
        <LoginPage
          subtitle="Vui lòng đăng nhập để xem giỏ hàng của bạn"
          onLoginSuccess={(user) => {
            auth.handleLoginSuccess(user);
            auth.navigateTo('cart');
          }}
          onNavigateToRegister={() => auth.navigateTo('register')}
        />
      );
    }

    if (auth.currentPage === 'checkout') {
      return auth.currentUser ? (
        <CheckoutPage
          items={cart.items}
          totalPrice={cart.totalPrice}
          onOrderSuccess={() => {
            cart.clearCart();
            showToast('Đặt hàng thành công!');
            auth.navigateTo('orders');
          }}
          onCancel={() => auth.navigateTo('cart')}
        />
      ) : (
        <LoginPage
          subtitle="Vui lòng đăng nhập để thực hiện thanh toán"
          onLoginSuccess={(user) => {
            auth.handleLoginSuccess(user);
            auth.navigateTo('checkout');
          }}
          onNavigateToRegister={() => auth.navigateTo('register')}
        />
      );
    }

    if (auth.currentPage === 'orders') {
      return auth.currentUser ? (
        <MyOrdersPage />
      ) : (
        <LoginPage
          subtitle="Vui lòng đăng nhập để xem lịch sử đơn hàng"
          onLoginSuccess={(user) => {
            auth.handleLoginSuccess(user);
            auth.navigateTo('orders');
          }}
          onNavigateToRegister={() => auth.navigateTo('register')}
        />
      );
    }

    return (
      <CustomerHomePage
        phones={phones.phones}
        loading={phones.loading}
        search={phones.search}
        brandFilter={phones.brandFilter}
        onSearchChange={phones.setSearch}
        onBrandFilterChange={phones.setBrandFilter}
        onAddToCart={handleAddToCart}
      />
    );
  };

  return (
    <CustomerLayout
      currentUser={auth.currentUser}
      currentPage={auth.currentPage}
      cartCount={cart.totalItems}
      onNavigate={auth.navigateTo}
      onLogout={auth.handleLogout}
    >
      {renderPage()}
      <Toast toast={toast} />
    </CustomerLayout>
  );
}

export default CustomerApp;
