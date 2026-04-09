import { useAuth } from "./auth";
import { Navigate } from "react-router";

export function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  return user ? element : <Navigate to="/login" />;
}
