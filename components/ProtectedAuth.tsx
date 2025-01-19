// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isLoggedIn } from "@/utils/auth";

// Show content only to NOT logged in users
export default function ProtectedAuth ({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated } = await isLoggedIn();
        if ( !authenticated ) {
          setHasAccess(true);
        } else {
          router.push("/");
        }
      } catch (err) {
        router.push("/");
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (isLoading) return <p>Loading...</p>;

  if (!hasAccess) return null;

  return <>{children}</>;
};