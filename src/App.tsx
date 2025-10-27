// src/components/App.tsx

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UserForm from './components/UserForm';
import DoctorForm from './components/DoctorForm';
import LoginForm from './components/LoginForm'; 
import DoctorListingPage from './components/DoctorListingPage'; 
import AppointmentPage from './components/AppointmentPage'; 
import Footer from './components/Footer';
import SearchPage from "./components/SearchPage"; // ✅ already imported
import './styles/App.css';

// --- TYPES (Centralized in App.tsx) ---
interface User {
  id: string;
  role: 'user' | 'doctor';
  email: string;
  token: string;
}

type SignUpRole = 'none' | 'user' | 'doctor';
// ✅ Added "search" page type
type Page = 'home' | 'doctors' | 'appointment' | 'search';

// All mock authentication functions and constants removed.
// ------------------------------------------

const App: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<SignUpRole>('none'); 
  const [showLogin, setShowLogin] = useState(false);
  const [loginRole, setLoginRole] = useState<'user' | 'doctor'>('user'); 
  const [currentPage, setCurrentPage] = useState<Page>('home');
  // Central source of truth for logged-in status
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null); 

  // SUCCESS HANDLER for both Login/Sign Up
  const handleAuthSuccess = (user: User) => {
      setLoggedInUser(user);
      handleCloseForm(); 
      // Redirect to home after successful login/signup
      handleNavigate('home'); 
  }
  
  // LOGOUT HANDLER
  const handleLogout = () => {
      setLoggedInUser(null);
      handleNavigate('home');
  }

  // Handler for form selection
  const handleRoleSelect = (role: SignUpRole) => {
    setSelectedRole(role);
    setShowLogin(false);
    setCurrentPage('home'); 
  };
  
  // Handler for opening the Login modal (called from Navbar)
  const handleOpenLoginModal = (role: 'user' | 'doctor') => { 
      setLoginRole(role); 
      setShowLogin(true);
      setSelectedRole('none');
      setCurrentPage('home');
  }

  // Handler for Navbar navigation links
  const handleNavigate = (page: Page) => {
      setCurrentPage(page);
      setSelectedRole('none');
      setShowLogin(false);
  }

  // Handler to close any active form/modal
  const handleCloseForm = () => {
    setSelectedRole('none');
    setShowLogin(false);
  };
  
  const renderContent = () => {
    // ✅ Added new route for Search Page
    if (currentPage === 'search') return <SearchPage />;

    // Priority 2: Page Routing
    if (currentPage === 'doctors') return <DoctorListingPage />;
    
    // Renders the new AppointmentPage component
    if (currentPage === 'appointment') {
        return <AppointmentPage />; 
    }
    
    return <HeroSection />; 
  };

  return (
    <div className="app-container">
      <Navbar 
          onRoleSelect={handleRoleSelect} 
          onLoginRoleSelected={handleOpenLoginModal}
          onNavigate={handleNavigate}
          loggedInRole={loggedInUser?.role || 'unauthenticated'} // PASS ROLE
          onLogout={handleLogout} // PASS LOGOUT HANDLER
      /> 
      
      <main style={{ flexGrow: 1 }}>
        {renderContent()}
        
        {/* Render Forms conditionally (as overlays) */}
        {showLogin && (
            <LoginForm 
                onClose={handleCloseForm} 
                role={loginRole} 
                onLoginSuccess={handleAuthSuccess} // Pass success handler
            />
        )}
        {selectedRole === 'user' && (
            <UserForm 
                onClose={handleCloseForm} 
                onSignUpSuccess={handleAuthSuccess} // Pass success handler
            />
        )}
        {selectedRole === 'doctor' && (
            <DoctorForm 
                onClose={handleCloseForm} 
                onSignUpSuccess={handleAuthSuccess} // Pass success handler
            />
        )}
      </main>

      <Footer /> 
    </div>
  );
};

export default App;
