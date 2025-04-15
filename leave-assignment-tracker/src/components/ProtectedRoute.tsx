
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { Role } from "@/app/types/index";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // You could return a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/Login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/Dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
