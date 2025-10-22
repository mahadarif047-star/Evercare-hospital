// src/components/AppointmentPage.tsx

import React, { useState, useEffect } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  patients: number;
}

// --- DUMMY DOCTOR DATA (Embedded) ---
const dummyDoctors: Doctor[] = [
  {
    id: 'doc_101',
    name: 'Dr. Evelyn Reed (Request 1)',
    specialty: 'Cardiology',
    location: 'New York, NY',
    rating: 4.9,
    patients: 1250,
  },
  {
    id: 'doc_102',
    name: 'Dr. Marcus Cole (Request 2)',
    specialty: 'Pediatrics',
    location: 'Los Angeles, CA',
    rating: 4.7,
    patients: 980,
  },
  {
    id: 'doc_103',
    name: 'Dr. Sofia Khan (Request 3)',
    specialty: 'Dermatology',
    location: 'Houston, TX',
    rating: 4.5,
    patients: 1520,
  },
  {
    id: 'doc_104',
    name: 'Dr. James Wu (Request 4)',
    specialty: 'Neurology',
    location: 'Chicago, IL',
    rating: 4.8,
    patients: 750,
  },
  {
    id: 'doc_105',
    name: 'Dr. Amelia Jones (Request 5)',
    specialty: 'Oncology',
    location: 'Miami, FL',
    rating: 5.0,
    patients: 1100,
  },
];
// ------------------------------------

const API_URL = 'https://node-backend-tau-three.vercel.app/api/auth/appointmentrequest?doctorId=68ee01844290257e43c04ff1';

// --- STYLING (Updated to include Modal/Pop-up styles) ---
const styles: any = { 
    container: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    info: { flexGrow: 1 },
    name: { fontSize: '1.4rem', color: 'var(--primary-blue)', marginBottom: '5px' },
    specialty: { color: '#555', marginBottom: '5px' },
    details: { fontSize: '0.9rem', color: '#777' },
    buttonGroup: { display: 'flex', gap: '10px' }, 
    acceptButton: { padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    rejectButton: { padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    error: { color: 'red', textAlign: 'center', padding: '20px', border: '1px solid #f00', borderRadius: '5px', marginBottom: '20px' },
    heading: { textAlign: 'center', marginBottom: '20px' },
    
    // NEW MODAL STYLES
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        zIndex: 1000 
    },
    modalContent: {
        backgroundColor: 'white', 
        padding: '30px 40px', 
        borderRadius: '8px', 
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        maxWidth: '400px',
        textAlign: 'center'
    },
    closeButton: {
        position: 'absolute', top: '10px', right: '10px', 
        background: 'none', border: 'none', fontSize: '1.5rem', 
        cursor: 'pointer', color: '#333'
    },
    modalMessage: {
        fontSize: '1.2rem',
        marginTop: '10px',
        color: '#333'
    }
};
// -------------------------------------------------------------

const AppointmentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [displayDoctors, setDisplayDoctors] = useState<Doctor[]>([]);
  
  // NEW STATE: Pop-up management
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // ... (fetch logic remains the same) ...
    const fetchAppointmentData = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const result = await response.json();
        
        if (Array.isArray(result) && result.length > 0) {
            setData(result); 
            setDisplayDoctors([]);
        } else {
            throw new Error("API returned success but no active appointment data.");
        }

      } catch (error: any) {
        console.error("API Error:", error.message);
        setApiError(`Failed to load appointment data: ${error.message}. Displaying fallback appointment requests.`);
        setDisplayDoctors(dummyDoctors); 
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, []);

  const handleAppointmentAction = (doctorId: string, action: 'accept' | 'reject') => {
      let message = "";
      if (action === 'accept') {
          message = "Your request has been accepted.";
      } else {
          message = "Your request has been rejected.";
      }
      
      // 1. Show the pop-up with the specific message
      setModalMessage(message);
      setShowModal(true);

      // 2. Remove the item from the list (for immediate UI feedback)
      setDisplayDoctors(prev => prev.filter(d => d.id !== doctorId));
  };
  
  const closeModal = () => {
      setShowModal(false);
      setModalMessage('');
  };

  // --- RENDERING ---

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading appointment details...</div>;
  }
  
  // Primary success content
  if (data && data.length > 0) {
      return (
          <div style={styles.container}>
              <h2 style={styles.heading}>Your Scheduled Appointments</h2>
              <p style={{textAlign: 'center'}}>Successfully loaded {data.length} appointment records from the API.</p>
          </div>
      );
  }

  // Fallback/Error content (Show dummy requests)
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Incoming Appointment Requests</h2>
      
      {apiError && <div style={styles.error}>{apiError}</div>}
      
      <h3 style={{textAlign: 'center', marginBottom: '25px', color: '#333'}}>Pending Requests (Fallback List)</h3>
      
      {displayDoctors.map((doctor) => (
        <div key={doctor.id} style={styles.card}>
          <div style={styles.info}>
            <div style={styles.name}>{doctor.name}</div>
            <div style={styles.specialty}>{doctor.specialty} - {doctor.location}</div>
            <div style={styles.details}>
                Rating: **{doctor.rating}** | Patients: {doctor.patients}
            </div>
          </div>
          
          <div style={styles.buttonGroup}>
              <button 
                  style={styles.acceptButton}
                  onClick={() => handleAppointmentAction(doctor.id, 'accept')}
              >
                  Accept
              </button>
              <button 
                  style={styles.rejectButton}
                  onClick={() => handleAppointmentAction(doctor.id, 'reject')}
              >
                  Reject
              </button>
          </div>
        </div>
      ))}
      
      {displayDoctors.length === 0 && !apiError && (
          <p style={{textAlign: 'center', color: '#999'}}>No pending requests to show.</p>
      )}

      {/* NEW: POP-UP MODAL JSX */}
      {showModal && (
          <div style={styles.modalOverlay} onClick={closeModal}>
              <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                  <button onClick={closeModal} style={styles.closeButton}>
                      &times; 
                  </button>
                  <p style={styles.modalMessage}>
                      {modalMessage}
                  </p>
              </div>
          </div>
      )}
    </div>
  );
};

export default AppointmentPage;