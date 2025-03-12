// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isLoggedIn } from "@/utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // Array of roles for flexibility
}

// Show content to logged in users or specific roles
const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated, user } = await isLoggedIn();

        if (authenticated) {
          if (
            requiredRoles.length === 0 ||
            (user?.role && requiredRoles.includes(user.role))
          ) {
            setHasAccess(true);
          } else {
            router.push("/auth/login");
          }
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.log(err);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRoles, router]);

  if (isLoading) return <p>Loading...</p>;

  if (!hasAccess) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
