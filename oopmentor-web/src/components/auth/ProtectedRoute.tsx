import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SessionLoader from "./SessionLoader";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isInitializing, accessToken } = useAuth();

  if (isInitializing) {
    return <SessionLoader />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}