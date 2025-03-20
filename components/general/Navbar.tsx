// components/Navbar.tsx
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router"
import { logout } from "@/utils/auth";
import { AuthContext } from "@/pages/_app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Navbar = () => {
  const { authenticated, user, setAuth } = useContext(AuthContext)
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const logoutPromise = logout(setAuth);
    await toast.promise(
      logoutPromise, 
      {
        pending: "Logging out...",
        success: "Logged out successfully",
        error: "Failed to log out"
      }
    );
    setDropdownOpen(false)
    router.push('/')
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all ${scrolled ? "bg-gray-900 shadow-lg" : "bg-transparent"}`}>
      <div className="container mx-auto flex justify-between items-center h-20 py-4 px-6">
        {/* Logo */}
        <h1 className="text-white text-2xl font-bold cursor-pointer w-56" onClick={() => router.push("/")}>
          AuthModule
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a href="https://auth-module.lautaroayosa.com.ar/documentation/" target="_blank" className="text-gray-300 hover:text-white transition">Docs</a>
          </li>
          <li>
            <a href="https://github.com/lautaroayosa/" target="_blank" className="text-gray-300 hover:text-white transition">GitHub</a>
          </li>
          <li>
            <a href="https://github.com/lautaroayosa/auth-module" target="_blank" className="text-gray-300 hover:text-white transition">Project</a>
          </li>
        </ul>

        {/* Auth Section */}
        <div className="relative w-56 justify-end hidden md:flex">
          {authenticated ? (
            // User Dropdown Button
            <button
              className="flex items-center text-white font-medium px-4 py-2 border-b border-white border-opacity-50 bg-transparent hover:bg-white hover:bg-opacity-20 transition rounded-t-sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {/* Welcome User */}
              <div className="flex flex-col text-end mr-2">
                <span className="text-xs text-gray-300">Welcome</span>
                <span className="text-sm font-semibold">{user?.name}</span>
              </div>

              {/* Toggle Icon */}
              <FontAwesomeIcon icon={dropdownOpen ? faAngleUp : faAngleDown} className="text-sm" />
            </button>

          ) : (
            // Login Button (if not authenticated)
            <div className="space-x-3">
              <button
                onClick={() => router.push("/auth/login")}
                className="px-5 py-2 text-white font-medium  bg-blue-600 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="px-5 py-2 text-blue-600 hover:text-white font-medium bg-white rounded hover:bg-blue-700 transition"
              >
                Register
              </button>
            </div>
          )}

          {/* Dropdown Menu (Visible when Open) */}
          {dropdownOpen && (
            <div className="absolute right-0 top-14 w-40 bg-gray-800 text-white rounded-sm shadow-lg overflow-hidden">
              <button
                onClick={() => router.push("/dashboard/")}
                className="block w-full px-4 py-2 text-right hover:bg-gray-700 transition"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-right hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
        <div className={`bg-black/30 backdrop-blur-lg transition-opacity duration-200 fixed inset-0 ${
          menuOpen ? "opacity-100 z-50" : "opacity-0 -z-10 hidden"
        }`}
        onClick={() => setMenuOpen(false)} 
        >
          <div className="md:hidden fixed w-full top-0 bg-gray-900 py-4 px-6 space-y-4 text-center z-50 shadow-lg">
            <div className="flex flex-row justify-between items-center h-12 ">
              <h1 className="text-white text-2xl font-bold cursor-pointer" onClick={() => {router.push("/"); setMenuOpen(false)}}>
                AuthModule
              </h1>
              <button className="text-white text-2xl" onClick={() => setMenuOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <hr />
            <a href="https://auth-module.lautaroayosa.com.ar/documentation/" target="_blank" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white transition">Docs</a>
            <a href="https://github.com/lautaroayosa/" target="_blank" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white transition">GitHub</a>
            <a href="https://github.com/lautaroayosa/auth-module/" target="_blank" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white transition">Project</a>

            {authenticated ? (
              <>
                <button
                  onClick={() => {router.push("/dashboard"); setMenuOpen(false)}}
                  className="block w-full px-5 py-2 text-white font-medium bg-gray-700 rounded-lg hover:bg-gray-800 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {handleLogout(); setMenuOpen(false)}}
                  className="block w-full px-5 py-2 text-white font-medium bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {router.push("/auth/login"); setMenuOpen(false)}}
                  className="block w-full px-5 py-2 text-white font-medium bg-blue-600 rounded-sm hover:bg-blue-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {router.push("/auth/register"); setMenuOpen(false)}}
                  className="block w-full px-5 py-2 text-white font-medium bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
    </nav>
  );
};

export default Navbar;