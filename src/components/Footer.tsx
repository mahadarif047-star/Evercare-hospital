import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Section 1: Logo and Motto */}
        <div className={styles.footerColumn}>
          <h3 className={styles.logo}>
            Health<span className={styles.logoSpan}>Care</span>
          </h3>
          <p className={styles.motto}>
            Your trusted partner for online doctor appointments and wellness. Committed to a healthier tomorrow.
          </p>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialLink} aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className={styles.socialLink} aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className={styles.footerColumn}>
          <h4 className={styles.heading}>Quick Links</h4>
          <ul className={styles.linkList}>
            <li><a href="#" className={styles.link}>Home</a></li>
            <li><a href="#" className={styles.link}>Find a Doctor</a></li>
            <li><a href="#" className={styles.link}>Book Appointment</a></li>
            <li><a href="#" className={styles.link}>About Us</a></li>
          </ul>
        </div>

        {/* Section 3: Our Services */}
        <div className={styles.footerColumn}>
          <h4 className={styles.heading}>Our Services</h4>
          <ul className={styles.linkList}>
            <li><a href="#" className={styles.link}>General Checkups</a></li>
            <li><a href="#" className={styles.link}>Specialist Consults</a></li>
            <li><a href="#" className={styles.link}>Telemedicine</a></li>
            <li><a href="#" className={styles.link}>Health Articles</a></li>
          </ul>
        </div>

        {/* Section 4: Contact Info */}
        <div className={styles.footerColumn}>
          <h4 className={styles.heading}>Contact</h4>
          <p className={styles.contactInfo}>
            <i className="fas fa-map-marker-alt"></i> 123 Health Blvd, Wellness City, 10001
          </p>
          <p className={styles.contactInfo}>
            <i className="fas fa-envelope"></i> Email: support@healthcare.com
          </p>
          <p className={styles.contactInfo}>
            <i className="fas fa-phone"></i> Phone: (123) 456-7890
          </p>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          &copy; {new Date().getFullYear()} HealthCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;