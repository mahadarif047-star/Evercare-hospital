import React from 'react';
import styles from '../styles/HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.contentContainer}>
        <div className={styles.textContent}>
          <h1 className={styles.mainHeading}>
            Book Your Doctor Appointment Online.
          </h1>
          <p className={styles.subText}>
            A Healthier Tomorrow Starts Today: Schedule Your Appointment! Your Wellness, Our Expertise: Set Up Your Appointment Today.
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.appointmentButton}>
              Book An Appointment
            </button>
            <button className={styles.callButton}>
              Call now
            </button>
          </div>
        </div>

        <div className={styles.imageWrapper}> {/* Added a wrapper for better positioning */}
          <img 
            src="/doctor.png" // Ensure this image is in your public folder
            alt="Smiling Doctor"
            className={styles.doctorImage}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;