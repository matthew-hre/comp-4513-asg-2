import { Navigate } from "react-router";

import { useAuth } from "./auth";

export function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  return user ? element : <Navigate to="/login" />;
}
