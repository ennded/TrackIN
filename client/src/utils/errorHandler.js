import { toast } from "react-toastify";

export const handleError = (error) => {
  const message =
    error.response?.data?.error || error.message || "Something went wrong";
  toast.error(message);
};

// Use in components:
// try { ... } catch (error) { handleError(error); }
