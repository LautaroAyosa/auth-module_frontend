// components/Navbar.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { logout, isLoggedIn } from "@/utils/auth";
import Link from "next/link";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {authenticated, user} = await isLoggedIn(); 
        if (authenticated && user) {
          setIsAuthenticated(true);
          setUserRole(user.role)
        } else {
          setIsAuthenticated(false);
        }
        
      }  catch (err) {
        console.log(err)
        setIsAuthenticated(false);
      }
    }
    checkSession()
  }, [router]);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    router.push('/')
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href={'/'} className="text-xl font-bold">
            AuthApp
          </Link>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/user/" className="hover:underline">
                Dashboard
              </Link>
              {userRole === "admin" && (
                <Link href="/admin/dashboard" className="hover:underline">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:underline">
                Login
              </Link>
              <Link href="/auth/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;