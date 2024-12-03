import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackPage from './pages/FeedbackPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { AuthProvider } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner'; 
import MonthlyReport from './components/MonthlyReport';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6' 
  },
  main: {
    flexGrow: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px'
  }
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div style={styles.container}>
            <Header />
            <main style={styles.main}>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route 
                    path="/booking/confirm/:flightId" 
                    element={<BookingConfirmation />} 
                  />
                  <Route 
                    path="/payment/:bookingId" 
                    element={<PaymentPage />} 
                  />
                  <Route 
                    path="/ticket/:bookingId" 
                    element={<TicketPage />} 
                  />
                  <Route 
                    path="/user-dashboard" 
                    element={<UserDashboard />} 
                  />
                  <Route 
                    path="/admin-dashboard" 
                    element={<AdminDashboard />} 
                  />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/admin/monthly-report" element={<MonthlyReport />} />                  <Route 
                    path="*" 
                    element={
                      <div style={{ textAlign: 'center', padding: '50px' }}>
                        <h1>404 - Page Not Found</h1>
                      </div>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;