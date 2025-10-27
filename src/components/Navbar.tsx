
import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css';

type SignUpRole = 'none' | 'user' | 'doctor';
type Role = 'user' | 'doctor';
type Page = 'home' | 'doctors' | 'appointment' | 'search'; 
type LoggedInRole = Role | 'unauthenticated';

interface NavbarProps {
  onRoleSelect: (role: SignUpRole) => void;
  onLoginRoleSelected: (role: Role) => void;
  onNavigate: (page: Page) => void;
  loggedInRole: LoggedInRole;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onRoleSelect,
  onLoginRoleSelected,
  onNavigate,
  loggedInRole,
  onLogout,
}) => {
  const [showSignUpRoles, setShowSignUpRoles] = useState(false);
  const [showLoginRoles, setShowLoginRoles] = useState(false);

  const handleLoginClick = () => {
    setShowLoginRoles((prev) => !prev);
    setShowSignUpRoles(false);
  };

  const handleSignUpClick = () => {
    setShowSignUpRoles((prev) => !prev);
    setShowLoginRoles(false);
    if (showSignUpRoles) {
      onRoleSelect('none');
    }
  };

  const handleSignUpRoleSelection = (role: Role) => {
    onRoleSelect(role);
    setShowSignUpRoles(false);
  };

  const handleLoginRoleSelection = (role: Role) => {
    onLoginRoleSelected(role);
    setShowLoginRoles(false);
  };

  const baseNavItems = [
    { name: 'Home', page: 'home' as Page },
    { name: 'Search', page: 'search' as Page },
  ];

  const getDynamicNavItems = () => {
    let dynamicItems = [];

    if (loggedInRole === 'user') {
      dynamicItems.push(
        { name: 'Doctors', page: 'doctors' as Page },
        { name: 'Appointment', page: 'appointment' as Page }
      );
    } else if (loggedInRole === 'doctor') {
      dynamicItems.push({ name: 'Appointment', page: 'appointment' as Page });
    }

    return dynamicItems;
  };

  const finalNavItems = [...baseNavItems, ...getDynamicNavItems()];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => onNavigate('home')}>
          Health<span style={{ color: 'var(--primary-blue)' }}>Care</span>
        </div>

        <div className={styles.navLinks}>
          {finalNavItems.map((item) => (
            <a
              key={item.name}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.page);
              }}
              className={styles.navLink}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className={styles.authContainer}>
          {loggedInRole === 'unauthenticated' ? (
            <>
              <button onClick={handleLoginClick} className={styles.loginButton}>
                Login
              </button>

              {showLoginRoles && (
                <div className={styles.roleDropdown}>
                  <h4
                    style={{
                      margin: '0 0 10px',
                      color: 'var(--text-dark)',
                      fontSize: '1rem',
                      padding: '0 15px',
                    }}
                  >
                    Login as:
                  </h4>
                  <button
                    onClick={() => handleLoginRoleSelection('user')}
                    className={styles.roleButton}
                  >
                    as User
                  </button>
                  <button
                    onClick={() => handleLoginRoleSelection('doctor')}
                    className={styles.roleButton}
                  >
                    as Doctor
                  </button>
                </div>
              )}

              <button onClick={handleSignUpClick} className={styles.signUpButton}>
                Sign Up
              </button>

              {showSignUpRoles && (
                <div className={styles.roleDropdown} style={{ right: 0 }}>
                  <h4
                    style={{
                      margin: '0 0 10px',
                      color: 'var(--text-dark)',
                      fontSize: '1rem',
                      padding: '0 15px',
                    }}
                  >
                    Sign Up as:
                  </h4>
                  <button
                    onClick={() => handleSignUpRoleSelection('user')}
                    className={styles.roleButton}
                  >
                    as User
                  </button>
                  <button
                    onClick={() => handleSignUpRoleSelection('doctor')}
                    className={styles.roleButton}
                  >
                    as Doctor
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={onLogout}
              className={styles.signUpButton}
              style={{ backgroundColor: '#e74c3c' }}
            >
              Logout ({loggedInRole})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
