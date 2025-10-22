import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import styles from '../styles/DoctorListingPage.module.css'; 
import cardStyles from '../styles/DoctorCard.module.css'; 

// --- 1. TYPE DEFINITIONS ---
interface Doctor {
  _id: string; 
  name: string;
  email: string; 
  service: string; 
  education: string; 
  specialized: string; 
  image: string; 
  availability: Array<{ days: string[], from: string, to: string }>; 
  isVerified: boolean; 
  experienceYears: number; 
  location: string; 
}

type SelectedDoctor = Doctor | null;

// --- 2. API CONSTANTS ---
const DOCTOR_LIST_API_URL = 'https://node-backend-tau-three.vercel.app/api/auth/availableDoctors';
const BOOKING_API_BASE_URL = 'https://node-backend-tau-three.vercel.app/api/auth/appointmentrequest';


// --------------------------------------------------------------------------------
// --- 3. BOOKING MODAL COMPONENT (FINAL PAYLOAD KEYS CORRECTED) ---
// --------------------------------------------------------------------------------

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose }) => {
  // State holds user-friendly fields for display and selection
  const [formData, setFormData] = useState({
    doctorName: `Dr. ${doctor.name}`, 
    patientName: '', // Maps to 'patientName' in payload 
    selectedDay: '', // Maps to 'days' in payload
    selectedTime: '9:00 AM', // Used as the fixed time slot 
  });
  
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);
  
  // Extract all unique available days for the dropdown
  const availableDays = doctor.availability
    .flatMap(item => item.days)
    .filter((value, index, self) => self.indexOf(value) === index);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.selectedDay) {
        setResponseMessage('Please fill in your name and select an appointment day.');
        return;
    }
    
    setBookingStatus('loading');
    setResponseMessage('Sending request...');

    // 1. Construct the API URL with the doctor's ID as a query parameter
    const API_ENDPOINT = `${BOOKING_API_BASE_URL}?doctorId=${doctor._id}`;

    // 2. Construct the FINAL payload (request body) with the EXACT keys requested: "from", "to", and "days"
    const payload = {
        patientName: formData.patientName,
        patientEmail: 'patient@example.com', // Placeholder for logged-in user email
        doctorId: doctor._id, 
        
        // --- Keys expected by the API endpoint ---
        "from": "9:00 AM", // Using the fixed time for both 'from' and 'to' as per the form image
        "to": "10:00 AM", // Note: The form only shows '9:00 AM', setting a simple range here
        "days": formData.selectedDay, // The selected day
    };
    
    try {
        // 3. Send the POST request
        const res = await axios.post(API_ENDPOINT, payload);
        
        console.log("Appointment Success:", res.data);
        setBookingStatus('success');
        setResponseMessage(`Appointment booked successfully! Confirmation sent to your email.`);

    } catch (error: any) { 
        // Safely handle error response (Addresses image_273e42.png)
        const errorMsg = error.response?.data?.message || error.message || 'Failed to connect to booking service.';
        console.error("Appointment Error:", error.response?.data || error.message);
        setBookingStatus('error');
        setResponseMessage(`Booking failed: ${errorMsg}`);
    }
  };

  const handleDaySelect = (day: string) => {
    setFormData(prev => ({ ...prev, selectedDay: day }));
    setIsDaysDropdownOpen(false);
  };
  
  const getMessageClass = () => {
    if (bookingStatus === 'success') return styles.success;
    if (bookingStatus === 'error') return styles.failure;
    return '';
  };


  return (
    // Modal Overlay
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times; 
        </button>

        <h2>Book Appointment with {formData.doctorName}</h2>
        <p>Specialty: {doctor.service}</p>

        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          {/* Doctor Field (Read-only) */}
          <label htmlFor="doctorName">Doctor:</label>
          <input
            id="doctorName"
            type="text"
            value={formData.doctorName}
            readOnly
            className={styles.readOnlyInput}
          />

          {/* Patient Name (User Input) */}
          <label htmlFor="patientName">Your Name:</label>
          <input
            id="patientName"
            type="text"
            required
            placeholder="Enter your full name"
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
          />

          {/* Days Field (Dropdown) */}
          <label htmlFor="selectedDay">Appointment Day:</label>
          <div className={styles.daysDropdownContainer}>
            <input
              id="selectedDay"
              type="text"
              required
              readOnly
              placeholder="Select an available day"
              value={formData.selectedDay}
              onClick={() => setIsDaysDropdownOpen(prev => !prev)}
              className={styles.dropdownInput}
            />
            {isDaysDropdownOpen && (
              <div className={styles.daysDropdown}>
                {availableDays.length > 0 ? (
                  availableDays.map(day => (
                    <div
                      key={day}
                      className={styles.dayOption}
                      onClick={() => handleDaySelect(day)}
                    >
                      {day}
                  </div>
                  ))
                ) : (
                  <div className={styles.noDays}>No available days listed.</div>
                )}
              </div>
            )}
          </div>
          
          {/* Appointment Time Input (Fixed for this version) */}
          <label htmlFor="selectedTime">Appointment Time:</label>
          <input
            id="selectedTime"
            type="text"
            readOnly
            value={formData.selectedTime}
            className={styles.readOnlyInput}
          />

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={bookingStatus === 'loading'}
          >
            {bookingStatus === 'loading' ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
        
        {/* Status Message Display */}
        {responseMessage && (
            <p 
                className={`${styles.message} ${getMessageClass()}`}
            >
                {responseMessage}
                {bookingStatus === 'success' && <button className={styles.closeModalButton} onClick={onClose}>Close</button>}
            </p>
        )}
      </div>
      </div>
  );
};


// --------------------------------------------------------------------------------
// --- 4. DOCTOR CARD COMPONENT (UNCHANGED) ---
// --------------------------------------------------------------------------------

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; 
  const availableDaysShort = doctor.availability
    .flatMap(item => item.days)
    .map(day => day.substring(0, 3)); 

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.detailsSection}>
        <div className={cardStyles.imageContainer}>
          <img
            src={doctor.image || 'https://via.placeholder.com/150'} 
            alt={`Dr. ${doctor.name}`}
            className={cardStyles.doctorImage}
          />
          <div className={cardStyles.experience}>
            {doctor.experienceYears} Years Experience 
          </div>
        </div>

        <div className={cardStyles.info}>
          <h3 className={cardStyles.name}>Dr {doctor.name}</h3>
          {doctor.isVerified && <span className={cardStyles.verified}>Verified</span>} 

          <p className={cardStyles.specialty}>{doctor.service} | {doctor.specialized}</p> 
          <p className={cardStyles.board}>{doctor.education}</p> 
        </div>
      </div>

      <div className={cardStyles.scheduleSection}>
        <h4 className={cardStyles.scheduleTitle}>Schedule</h4>
        <div className={cardStyles.scheduleDays}>
          {allDays.map(day => (
            <span
              key={day}
              className={`${cardStyles.dayPill} ${availableDaysShort.includes(day) ? cardStyles.available : cardStyles.unavailable}`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className={cardStyles.location}>
          <span role="img" aria-label="location-pin">📍</span>
          {doctor.location || 'Location not specified'} 
        </div>

        <button className={cardStyles.bookButton} onClick={() => onBook(doctor)}>
          Book Appointment
        </button>
      </div>
    </div>
  );
};


// --------------------------------------------------------------------------------
// --- 5. MAIN LISTING PAGE COMPONENT ---
// --------------------------------------------------------------------------------

const DoctorListingPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState<SelectedDoctor>(null);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
  };

  // API Fetch Logic
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(DOCTOR_LIST_API_URL);

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const rawData = await response.json();
        
        // Handle non-array data structure (Addresses image_27a779.png)
        let doctorsArray: any[] = [];
        
        if (Array.isArray(rawData)) {
            doctorsArray = rawData;
        } else if (rawData && typeof rawData === 'object' && Array.isArray(rawData.doctors)) {
            doctorsArray = rawData.doctors;
        }

        if (doctorsArray.length > 0) {
            const mappedDoctors: Doctor[] = doctorsArray.map((apiDoc, index) => ({
                _id: apiDoc._id || index.toString(), 
                name: apiDoc.Full_name || apiDoc.name || 'N/A',
                email: apiDoc.email_Address || apiDoc.email || 'N/A',
                service: apiDoc.Service || apiDoc.service || 'N/A',
                education: apiDoc.Education || apiDoc.education || 'N/A',
                specialized: apiDoc.Specialized || apiDoc.specialized || 'N/A',
                image: apiDoc.image || 'https://via.placeholder.com/150',
                availability: apiDoc.availability && Array.isArray(apiDoc.availability) ? apiDoc.availability : [],
                
                // Placeholder/Default values
                isVerified: true,
                experienceYears: 5,
                location: apiDoc.city || 'Remote/Not Specified',
            }));
            setDoctors(mappedDoctors);
        } else {
            console.warn("API returned no doctor data or an unexpected structure:", rawData);
            setDoctors([]);
        }

        setError(false);
      } catch (e) {
        console.error("API Fetch Failed:", e);
        setError(true);
        setDoctors([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []); 

  if (loading) {
    return <div className={styles.pageContainer}>Loading available doctors...</div>;
  }
  
  if (!loading && doctors.length === 0) {
    return <div className={styles.pageContainer}>No doctors are currently available. Please check back later.</div>;
  }

  return (
    <div className={styles.pageContainer}>

      {/* Search and Filter Bar */}
      <div className={styles.searchBar}>
        <div className={styles.filters}>
          <span className={styles.filterIcon}>⚙️</span> Filters
        </div>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Search" />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <p className={styles.errorMessage}>
          ⚠️ Failed to fetch live doctor data. Please check the API status.
        </p>
      )}

      {/* Doctor List */}
      <div className={styles.doctorList}>
        {doctors.map(doctor => (
          <DoctorCard
            key={doctor._id} 
            doctor={doctor}
            onBook={handleBookAppointment}
          />
        ))}
      </div>

      {/* Booking Modal Rendering */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DoctorListingPage;