import * as React from "react";
import { useState } from "react";
import axios from "axios";
import "../styles/DoctorForm.module.css"; // keep your CSS import

// --- New: Define the User type that will be passed on successful signup ---
interface User {
    id: string;
    role: 'user' | 'doctor';
    email: string;
    token: string;
}

// --- New: Define the component props (The fix for the previous error) ---
interface DoctorFormProps {
    onClose: () => void;
    onSignUpSuccess: (user: User) => void;
}

interface Availability {
  days: string[];
  from: string;
  to: string;
}

interface FormData {
  name: string;
  email: string;
  age: string;
  service: string;
  education: string;
  specialized: string;
  password: string;
  available: boolean;
  availability: Availability[];
  image: string;
}

// Update the component signature to accept the new props
const DoctorForm: React.FC<DoctorFormProps> = ({ onClose, onSignUpSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    age: "",
    service: "",
    education: "",
    specialized: "",
    password: "",
    available: false,
    availability: [
      {
        days: [],
        from: "",
        to: "",
      },
    ],
    image: "",
  });

  const [message, setMessage] = useState<string>("");

  // --- Handle input fields ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // --- Handle days selection ---
  const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData({
      ...formData,
      availability: [{ ...formData.availability[0], days: selected }],
    });
  };

  // --- Handle time change ---
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      availability: [{ ...formData.availability[0], [name]: value }],
    });
  };

  // --- Handle form submit ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const res = await axios.post(
        "https://node-backend-tau-three.vercel.app/api/doc/signup",
        formData
      );
      
      console.log("✅ Signup Success:", res.data);
      
      // --- Key Update: Call onSignUpSuccess with the received user data ---
      const signedUpUser: User = {
          id: res.data.user.id, // Assuming the API returns a user object
          role: 'doctor', // Hardcoded as this is the doctor form
          email: res.data.user.email,
          token: res.data.token, // Assuming the API returns a token
      };
      onSignUpSuccess(signedUpUser);
      // The parent component (App.tsx) handles closing the form after success.
      
      setMessage("Signup successful!");
      
    } catch (err: any) {
      console.error("❌ Signup Error:", err.response?.data || err.message);
      setMessage("Signup failed — check console for details.");
    }
  };

  return (
    <div className="doctor-overlay">
      <div className="doctor-popup">
        {/* New: Add a close button that calls the onClose prop */}
        <button onClick={onClose} className="close-button" style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            &times;
        </button>
        <h2 className="doctor-heading">Doctor Signup</h2>

        <form onSubmit={handleSubmit} className="doctor-form">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="doctor-input"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="doctor-input"
          />
          <input
            name="age"
            placeholder="Age"
            onChange={handleChange}
            value={formData.age}
            className="doctor-input"
          />
          <input
            name="service"
            placeholder="Service"
            onChange={handleChange}
            value={formData.service}
            className="doctor-input"
          />
          <input
            name="education"
            placeholder="Education"
            onChange={handleChange}
            value={formData.education}
            className="doctor-input"
          />
          <input
            name="specialized"
            placeholder="Specialized In"
            onChange={handleChange}
            value={formData.specialized}
            className="doctor-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="doctor-input"
          />

          <label className="doctor-label">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>

          <div className="availability-box">
            <h4>Availability</h4>
            <label>Select Days:</label>
            <select
              multiple
              name="days"
              onChange={handleDaysChange}
              value={formData.availability[0].days}
              className="doctor-select"
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <div className="time-inputs">
              <input
                type="time"
                name="from"
                value={formData.availability[0].from}
                onChange={handleAvailabilityChange}
                className="doctor-input"
              />
              <input
                type="time"
                name="to"
                value={formData.availability[0].to}
                onChange={handleAvailabilityChange}
                className="doctor-input"
              />
            </div>
          </div>

          <input
            name="image"
            placeholder="Image URL"
            onChange={handleChange}
            value={formData.image}
            className="doctor-input"
          />

          <button type="submit" className="doctor-button">
            Submit
          </button>
        </form>

        <p>{message}</p>
      </div>
    </div>
  );
};

// Rename the export to DoctorForm to match the import name in App.tsx
export default DoctorForm;