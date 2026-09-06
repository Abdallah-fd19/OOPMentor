import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SessionLoader from "./SessionLoader";

interface GuestRouteProps {
  children: ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { isInitializing, accessToken } = useAuth();

  if (isInitializing) {
    return <SessionLoader />;
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
