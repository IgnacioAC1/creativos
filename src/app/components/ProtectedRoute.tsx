import { Navigate } from "react-router";
import { useAuth, type Role } from "../context/AuthContext";
import type { ReactNode } from "react";

const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  profesor: "/profesor",
  alumno: "/alumno",
};

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles: Role[];
}) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!roles.includes(user!.role)) {
    return <Navigate to={ROLE_HOME[user!.role]} replace />;
  }

  return <>{children}</>;
}
