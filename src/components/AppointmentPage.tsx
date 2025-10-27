import React, { useState, useEffect } from "react";

interface Appointment {
  _id: string;
  doctorId: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string; 
}

const APPOINTMENT_VIEW_API_URL =
  "https://node-backend-tau-three.vercel.app/api/doc/viewappointments?doctorId=68f77624c808435a187d5ce2";
const APPOINTMENT_CONFIRM_API_BASE =
  "https://node-backend-tau-three.vercel.app/api/doc/confirmappointment?appointment_id=68f777fe90d43baf337efe26";

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  info: {
    flexGrow: 1,
    marginRight: "20px",
  },
  name: {
    fontSize: "1.4rem",
    color: "#007bff",
    marginBottom: "5px",
  },
  specialty: {
    color: "#555",
    marginBottom: "5px",
  },
  details: {
    fontSize: "0.9rem",
    color: "#777",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexShrink: 0,
  },
  acceptButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  rejectButton: {
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #f00",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px 40px",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    position: "relative",
    maxWidth: "400px",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#333",
  },
  modalMessage: {
    fontSize: "1.2rem",
    marginTop: "10px",
    color: "#333",
  },
};

const AppointmentPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setApiError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please log in as a doctor.");

         const response = await fetch(APPOINTMENT_VIEW_API_URL.trim(), {
           headers: { Authorization: `Bearer ${token}` },
              });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: "Server error" }));
          throw new Error(error.message || `API returned status ${response.status}`);
        }

        const result = await response.json();

        let dataArray: Appointment[] = [];
        if (Array.isArray(result)) {
          dataArray = result;
        } else if (Array.isArray(result.appointments)) {
          dataArray = result.appointments;
        } else if (Array.isArray(result.data)) {
          dataArray = result.data;
        } else {
          console.warn("Unexpected API structure:", result);
        }

        setAppointments(dataArray);
      } catch (err: any) {
        console.error("Fetch Error:", err.message);
        setApiError(`Failed to load appointments: ${err.message}`);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAppointmentAction = async (appointmentId: string, action: "approved" | "cancelled") => {
    const newStatus = action === "approved" ? "approved" : "cancelled";
    let message = "";

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please log in.");

      const apiUrl = `${APPOINTMENT_CONFIRM_API_BASE}?appointment_id=${appointmentId}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${action} appointment.`);
      }

      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
      message = `Appointment ${newStatus} successfully!`;
    } catch (err: any) {
      console.error(`Action Failed (${action}):`, err.message);
      message = `Failed to ${action} appointment: ${err.message}`;
    } finally {
      setModalMessage(message);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "100px" }}>Loading appointment details...</div>;
  }

  if (apiError) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Appointment Requests</h2>
        <div style={styles.error}>{apiError}</div>
        <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
          Please ensure you are logged in as a doctor and the API is accessible.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Incoming Appointment Requests ({appointments.length})
      </h2>

      {appointments.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", padding: "50px" }}>
          No pending appointment requests at this time.
        </p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment._id} style={styles.card}>
            <div style={styles.info}>
              <div style={styles.name}>
                Patient: {appointment.patientName || "N/A"}
              </div>
              <div style={styles.specialty}>
                Status: <strong>{appointment.status || "N/A"}</strong>
              </div>
              <div style={styles.details}>
                Date: <strong>{appointment.appointmentDate || "N/A"}</strong> | Time:{" "}
                <strong>{appointment.appointmentTime || "N/A"}</strong>
              </div>
            </div>

            {appointment.status?.toLowerCase() === "pending" && (
              <div style={styles.buttonGroup}>
                <button
                  style={styles.acceptButton}
                  onClick={() => handleAppointmentAction(appointment._id, "approved")}
                >
                  
                  approved
                </button>
                <button
                  style={styles.rejectButton}
                  onClick={() => handleAppointmentAction(appointment._id, "cancelled")}
                >
                  cancelled
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} style={styles.closeButton}>
              &times;
            </button>
            <p style={styles.modalMessage}>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
