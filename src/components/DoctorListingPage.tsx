
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

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

const DOCTOR_LIST_API_URL = 'https://node-backend-tau-three.vercel.app/api/auth/availableDoctors';
const BOOKING_API_BASE_URL_START = 'https://node-backend-tau-three.vercel.app/api/auth/appointmentrequest?doctorId='; 
const APPOINTMENT_FROM_TIME = "10:00 AM"; 
const APPOINTMENT_TO_TIME = "12:00 AM"; 

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose }) => {
  const [formData, setFormData] = useState({ patientNameInput: '', days: '' });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');
  const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);

  const availableDays = doctor.availability
    .flatMap(item => item.days)
    .filter((value, index, self) => self.indexOf(value) === index);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientNameInput || !formData.days) {
      setResponseMessage('Please fill in your name and select an appointment day.');
      return;
    }
    setBookingStatus('loading');
    setResponseMessage('Sending request...');
    const token = localStorage.getItem("token");
    const API_ENDPOINT = `${BOOKING_API_BASE_URL_START}${doctor._id}`;
    const payload = { from: APPOINTMENT_FROM_TIME, to: APPOINTMENT_TO_TIME, days: formData.days, token };

    try {
      const res = await axios.post(API_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setBookingStatus('success');
      setResponseMessage(`Appointment booked successfully! Confirmation sent.`);
    } catch (error) { 
      const err = error as { response?: { data?: { message?: string } }, message: string };
      const errorMsg = err.response?.data?.message || err.message || 'Failed to connect to booking service.';
      setBookingStatus('error');
      setResponseMessage(`Booking failed: ${errorMsg}`);
    }
  };

  const handleDaySelect = (day: string) => {
    setFormData(prev => ({ ...prev, days: day }));
    setIsDaysDropdownOpen(false);
  };

  return (
    <div 
      onClick={onClose} 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', minWidth: '350px', maxWidth: '450px' }}
      >
        <button onClick={onClose} style={{ float: 'right', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2em' }}>
          &times;
        </button>

        <h2>Book Appointment with Dr. {doctor.name}</h2> 
        <p style={{ textAlign: 'center', color: '#555', marginTop: '-10px', marginBottom: '20px' }}>
          Specialty: {doctor.service}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label htmlFor="doctorNameDisplay" style={{ fontWeight: 'bold' }}>Doctor:</label>
          <input id="doctorNameDisplay" type="text" readOnly value={`Dr. ${doctor.name}`} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f5f5f5' }} />

          <label htmlFor="patientNameInput" style={{ fontWeight: 'bold' }}>Your Name:</label>
          <input id="patientNameInput" type="text" required placeholder="Enter your full name" value={formData.patientNameInput} onChange={(e) => setFormData(prev => ({ ...prev, patientNameInput: e.target.value }))} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />

          <label htmlFor="days" style={{ fontWeight: 'bold' }}>Appointment Day:</label>
          <div>
            <input id="days" type="text" required readOnly placeholder="Select an available day" value={formData.days} onClick={() => setIsDaysDropdownOpen(prev => !prev)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', cursor: 'pointer' }} />
            {isDaysDropdownOpen && (
              <div style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', position: 'absolute', width: '90%', backgroundColor: 'white', zIndex: 1001, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                {availableDays.length > 0 ? (
                  availableDays.map(day => (
                    <div key={day} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px dotted #eee' }} onClick={() => handleDaySelect(day)}>
                      {day}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '10px', color: 'gray' }}>No available days listed.</div>
                )}
              </div>
            )}
          </div>

          <label htmlFor="timeDisplay" style={{ fontWeight: 'bold' }}>Appointment Time:</label>
          <input id="timeDisplay" type="text" readOnly value={APPOINTMENT_FROM_TIME} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f5f5f5' }} />

          <button type="submit" disabled={bookingStatus === 'loading'} style={{ padding: '10px', marginTop: '15px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            {bookingStatus === 'loading' ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>

        {responseMessage && (
          <p style={{ color: bookingStatus === 'error' ? 'red' : 'green', marginTop: '10px', textAlign: 'center' }}>
            {responseMessage}
            {bookingStatus === 'success' && <button onClick={onClose} style={{ marginLeft: '10px' }}>Close</button>}
          </p>
        )}
      </div>
    </div>
  );
};

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; 
  const availableDaysShort = doctor.availability.flatMap(item => item.days).map(day => day.substring(0, 3)); 

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px', maxWidth: '400px' }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div>
          <img
            src={doctor.image || 'https://via.placeholder.com/150'} 
            alt={`Dr. ${doctor.name}`}
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
          />
          <div style={{ textAlign: 'center', fontSize: '0.8em', color: 'gray' }}>
            {doctor.experienceYears} Years Experience 
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>Dr {doctor.name}</h3>
          {doctor.isVerified && <span style={{ color: 'green', fontSize: '0.8em' }}>Verified</span>} 
          <p style={{ margin: '5px 0' }}>{doctor.service} | {doctor.specialized}</p> 
          <p style={{ margin: '5px 0', fontSize: '0.9em' }}>{doctor.education}</p> 
        </div>
      </div>

      <hr style={{ margin: '10px 0' }}/>
      <div>
        <h4>Schedule</h4>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          {allDays.map(day => (
            <span
              key={day}
              style={{ 
                  padding: '3px 8px', 
                  borderRadius: '5px', 
                  backgroundColor: availableDaysShort.includes(day) ? '#e6ffe6' : '#f0f0f0', 
                  border: `1px solid ${availableDaysShort.includes(day) ? 'green' : '#ccc'}`, 
                  fontSize: '0.8em'
              }}
            >
              {day}
            </span>
          ))}
        </div>

        <div>
          <span role="img" aria-label="location-pin">📍</span>
          {doctor.location || 'Location not specified'} 
        </div>

        <button 
            onClick={() => onBook(doctor)}
            style={{ 
                marginTop: '15px', 
                padding: '10px', 
                backgroundColor: 'blue', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
            }}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

const DoctorListingPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const handleBookAppointment = (doctor: Doctor) => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to book an appointment. Please log in first.");
        return; 
    }
    setSelectedDoctor(doctor);
  };

  const handleCloseModal = () => setSelectedDoctor(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(DOCTOR_LIST_API_URL);
        if (!response.ok) throw new Error(`API returned status ${response.status}`);
        const rawData = await response.json();
        let doctorsArray: any[] = [];
        if (rawData && typeof rawData === 'object' && Array.isArray(rawData.doctors)) doctorsArray = rawData.doctors;
        else if (Array.isArray(rawData)) doctorsArray = rawData;
        const mappedDoctors: Doctor[] = doctorsArray.map((apiDoc, index) => ({
          _id: apiDoc._id || index.toString(),
          name: apiDoc.Full_name || apiDoc.name || 'N/A',
          email: apiDoc.email_Address || apiDoc.email || 'N/A',
          service: apiDoc.Service || apiDoc.service || 'N/A',
          education: apiDoc.Education || apiDoc.education || 'N/A',
          specialized: apiDoc.Specialized || apiDoc.specialized || 'N/A',
          image: apiDoc.image || 'https://via.placeholder.com/150',
          availability: apiDoc.availability && Array.isArray(apiDoc.availability) ? apiDoc.availability : [],
          isVerified: true,
          experienceYears: 5,
          location: apiDoc.city || 'Remote/Not Specified',
        }));
        setDoctors(mappedDoctors);
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

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading available doctors...</div>;
  if (!loading && doctors.length === 0) return <div>No doctors are currently available. Please check back later.</div>;

  return (
    <div style={{ padding: '20px' }}>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search doctor by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', width: '250px' }}
        />
      </div>

      {error && (
        <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
           Failed to fetch live doctor data. Please check the API status.
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBookAppointment} />
          ))
        ) : (
          <p>No doctors found for "{searchQuery}".</p>
        )}
      </div>

      {selectedDoctor && (
        <BookingModal doctor={selectedDoctor} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default DoctorListingPage;
