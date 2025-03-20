// components/ProtectedRoute.tsx
import { useContext } from "react";
import { AuthContext } from "@/pages/_app";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // Array of roles for flexibility
}

// Show content to logged in users or specific roles
const ProtectedElement = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const {user} = useContext(AuthContext);

  let hasAccess = false;
  if (requiredRoles.length === 0 || (user?.role && requiredRoles.includes(user.role))) {
    hasAccess = true
  }

  // if (isLoading) return <p>Loading...</p>;

  if (!hasAccess) return null;

  return <>{children}</>;
};

export default ProtectedElement;
