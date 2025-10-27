import React, { useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  age: number;
  education: string;
  gender: string;
}

const SearchPage: React.FC = () => {
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. John Doe",
      specialization: "Cardiologist",
      age: 45,
      education: "MBBS, MD (Cardiology)",
      gender: "Male",
    },
    {
      id: 2,
      name: "Dr. John Doe",
      specialization: "Dermatologist",
      age: 38,
      education: "MBBS, MD (Dermatology)",
      gender: "Male",
    },
    {
      id: 3,
      name: "Dr. John Doe",
      specialization: "Neurologist",
      age: 50,
      education: "MBBS, DM (Neurology)",
      gender: "Male",
    },
    {
      id: 4,
      name: "Dr. Jane Smith",
      specialization: "Pediatrician",
      age: 42,
      education: "MBBS, MD (Pediatrics)",
      gender: "Female",
    },
  ];

  const [query, setQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [visibleCount, setVisibleCount] = useState(2); // 👈 show 2 doctors first

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value.trim() === "") {
      setFilteredDoctors([]);
      setVisibleCount(2);
      return;
    }

    const matches = doctors.filter((doc) =>
      doc.name.toLowerCase().includes(value)
    );

    setFilteredDoctors(matches);
    setVisibleCount(2); // reset to 2 when new search
  };

  const handleNext = () => {
    // show all remaining doctors
    setVisibleCount(filteredDoctors.length);
  };

  const doctorsToShow = filteredDoctors.slice(0, visibleCount);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "1rem" }}>Search Doctors</h1>

      <input
        type="text"
        placeholder="Search by doctor name..."
        value={query}
        onChange={handleSearch}
        style={{
          padding: "10px 15px",
          width: "60%",
          maxWidth: "400px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginTop: "1rem",
          marginBottom: "2rem",
          fontSize: "1rem",
        }}
      />

     {doctorsToShow.length > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}
        >
          {doctorsToShow.map((doc) => (
            <div
              key={doc.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "1.5rem",
                width: "240px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
                textAlign: "left",
              }}
            >
              <h3 style={{ color: "#2980b9", marginBottom: "10px" }}>
                {doc.name}
              </h3>
              <p><strong>ID:</strong> {doc.id}</p>
              <p><strong>Specialization:</strong> {doc.specialization}</p>
              <p><strong>Age:</strong> {doc.age}</p>
              <p><strong>Education:</strong> {doc.education}</p>
              <p><strong>Gender:</strong> {doc.gender}</p>
            </div>
          ))}
        </div>
      ) : query.trim() !== "" ? (
        <p style={{ color: "#888", marginTop: "2rem" }}>No doctors found</p>
      ) : null}

      {filteredDoctors.length > visibleCount && (
        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={handleNext}
            style={{
              padding: "10px 18px",
              backgroundColor: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              margin: "0 auto",
            }}
          >
            Next <span style={{ fontSize: "1.2rem" }}>➜</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
