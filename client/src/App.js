import { useEffect, useState } from "react";
import api from "./utils/api";
import CompanyForm from "./components/CompanyForm";
import CompanyAccordion from "./components/CompanyAccordion";
import AuthForm from "./components/AuthForm";

function App() {
  const [companies, setCompanies] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/check");
        setIsAuthenticated(true);
        fetchCompanies();
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch company data
  const fetchCompanies = async () => {
    try {
      const { data } = await api.get("/companies");
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Handle login or registration
  const handleAuth = async (credentials, isLogin) => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, credentials);
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      setAuthError("");
      fetchCompanies();
    } catch (error) {
      setAuthError(error.response?.data?.error || "Authentication failed");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCompanies([]);
  };

  // Handle company deletion
  const handleCompanyDelete = (companyId) => {
    setCompanies((prev) => prev.filter((c) => c._id !== companyId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 max-w-3xl">
        {!isAuthenticated ? (
          <AuthForm onAuth={handleAuth} error={authError} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Interview Tracker
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>

            <CompanyForm onCompanyAdded={fetchCompanies} />

            <div className="space-y-4">
              {companies.map((company) => (
                <CompanyAccordion
                  key={company._id}
                  company={company}
                  onDelete={() => handleCompanyDelete(company._id)}
                  onUpdate={fetchCompanies}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
