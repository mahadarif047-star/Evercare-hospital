// src/components/UserForm.tsx

import React, { useState } from 'react';
import styles from '../styles/UserForm.module.css';

// --- TYPES for Props ---
interface User {
  id: string;
  role: 'user' | 'doctor';
  email: string;
  token: string;
}

interface UserFormProps {
  onClose: () => void;
  // Prop expected from App.tsx for state management
  onSignUpSuccess: (user: User) => void;
}
// ---------------------------------------------


const UserForm: React.FC<UserFormProps> = ({ onClose, onSignUpSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Existing State Variables
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [provience, setProvience] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [service, setService] = useState(''); 
  // New State Variable for 'date'
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    // Prepare data object with all fields
    const registrationData = {
      // role: 'user', // Explicitly setting role for the API endpoint
      name,
      email,
      password,
      phoneNumber,
      city,
      provience,
      country,
      service, 
      date, // <<< ADDED DATE KEY HERE
      // Use zip_code to match your desired API key, converting to number
      zip_code: zipCode ? parseInt(zipCode, 10) : undefined, 
    };
    
    // --- API INTEGRATION ---
    const API_URL = 'https://node-backend-tau-three.vercel.app/api/auth/signup';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed due to server error.');
      }

      const userData: User = result as User;

      console.log("User Sign Up Success:", userData);
      onSignUpSuccess(userData);
      onClose();

    } catch (error: any) {
      console.error("User Sign Up Error:", error);
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formCard}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <h2 className={styles.formTitle}>User Registration</h2>

        <form onSubmit={handleSubmit} className={styles.formGrid}>

          {apiError && <p style={{ gridColumn: '1 / -1', color: 'red', textAlign: 'center' }}>{apiError}</p>}

          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input type="text" className={styles.input} name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" className={styles.input} name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input type="tel" className={styles.input} name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input type="text" className={styles.input} name="city" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Province</label>
            <input type="text" className={styles.input} name="province" value={provience} onChange={(e) => setProvience(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Country</label>
            <input type="text" className={styles.input} name="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Service (e.g., General Patient)</label>
            <input type="text" className={styles.input} name="service" value={service} onChange={(e) => setService(e.target.value)} required />
          </div>
          
          {/* New Field: Date */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Registration Date</label>
            <input type="date" className={styles.input} name="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Zip Code</label>
            <input type="number" className={styles.input} name="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
          </div>

          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Registering...' : 'Register as User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;