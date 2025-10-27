// src/components/LoginForm.tsx
import React, { useState } from 'react';
import styles from '../styles/UserForm.module.css'; 

interface User {
  id: string;
  role: 'user' | 'doctor';
  email: string;
  token: string;
}

interface LoginFormProps {
  onClose: () => void;
  role: 'user' | 'doctor'; 
  onLoginSuccess: (user: User) => void; 
}

const USER_LOGIN_API = 'https://node-backend-tau-three.vercel.app/api/auth/login';
const DOCTOR_LOGIN_API = 'https://node-backend-tau-three.vercel.app/api/doc/login'; 

const LoginForm: React.FC<LoginFormProps> = ({ onClose, role, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null); 

    const apiUrl = role === 'user' ? USER_LOGIN_API : DOCTOR_LOGIN_API;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || `${role} login failed.`);

      const userData: User = {
        id: result.id || result.userId || 'mock-id',
        role,
        email,
        token: result.token,
      };

      if (userData.token) localStorage.setItem('token', userData.token);

      onLoginSuccess(userData);
      onClose(); 
    } catch (error: any) {
      setApiError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formCard}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <h2 className={styles.formTitle}>{role === 'doctor' ? 'Doctor Login' : 'User Login'}</h2>
        <form onSubmit={handleSubmit} className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
          {apiError && <p style={{ color: 'red', textAlign: 'center' }}>{apiError}</p>}
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder="user@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitButton}
            style={{ marginTop: '30px' }}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
            <a href="#" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>Forgot Password?</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
