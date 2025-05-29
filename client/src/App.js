import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import api from "./utils/api";
import AuthForm from "./components/AuthForm";
import CompanyForm from "./components/CompanyForm"; // Default import
import CompanyAccordion from "./components/CompanyAccordion";
import Dashboard from "./components/Dashboard";

function App() {
  const [companies, setCompanies] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // After (Handle 404 specifically)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/check");
        setIsAuthenticated(true);
        fetchCompanies();
      } catch (error) {
        if (error.response?.status === 404) {
          // Handle missing endpoint (if using older backend)
          await handleLegacyAuthCheck();
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    const handleLegacyAuthCheck = async () => {
      try {
        // Fallback check using existing endpoint
        await api.get("/auth/validate");
        setIsAuthenticated(true);
        fetchCompanies();
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      const { data } = await api.get("/companies");
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Handle authentication (login/register)
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

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCompanies([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <AuthForm onAuth={handleAuth} error={authError} />
      ) : (
        <>
          {/* Navigation Header */}
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">TrackIN</h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            {/* Company Input Section */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
              <CompanyForm onCompanyAdded={fetchCompanies} />
            </div>

            {/* Dashboard Analytics */}
            <div className="mb-8">
              <Dashboard companies={companies} />
            </div>

            {/* Company Accordion List */}
            <div className="grid grid-cols-1 gap-4">
              {companies.map((company) => (
                <CompanyAccordion
                  key={company._id}
                  company={company}
                  onDelete={() =>
                    setCompanies(companies.filter((c) => c._id !== company._id))
                  }
                  onUpdate={fetchCompanies}
                />
              ))}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
