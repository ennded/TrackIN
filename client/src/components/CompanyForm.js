import { useState } from "react";
import api from "../utils/api"; // Use custom axios instance

const CompanyForm = ({ onCompanyAdded }) => {
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/companies", { companyName });
      onCompanyAdded(data);
      setCompanyName("");
    } catch (error) {
      console.error("Error adding company:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-4 bg-white shadow rounded-lg"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Add Company
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
