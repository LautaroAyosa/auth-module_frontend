import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";

const Home = () => {
  const router = useRouter();
  const [floatingObjects, setFloatingObjects] = useState<{ x: number; y: number; size: number; speed: number }[]>([]);

    // Generate floating objects with constraints
    useEffect(() => {
      const objects = Array.from({ length: 6 }).map(() => ({
        x: Math.random() * 80 + 10, // ✅ Keeps within 10%-90% of the screen width
        y: Math.random() * 60 + 20, // ✅ Keeps within 20%-80% of the screen height
        size: Math.random() * 30 + 20, // ✅ Sizes between 20px - 50px
        speed: Math.random() * 3 + 3, // ✅ Speeds up the floating (3s - 6s)
      }));
      setFloatingObjects(objects);
    }, []);
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center px-6relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      {floatingObjects.map((obj, index) => (
        <div
          key={index}
          className="absolute bg-white bg-opacity-20 rounded-full blur-lg animate-float"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: `${obj.size}px`,
            height: `${obj.size}px`,
            animationDuration: `${obj.speed}s`,
          }}
        ></div>
      ))}

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-6 relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Authentication Module
        </h1>
        <p className="mt-4 text-white text-lg max-w-lg opacity-90">
          A secure and scalable authentication system with JWT, role-based access, and MFA support.
        </p>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => router.push("/auth/register")}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition transform hover:scale-105"
          >
            Get Started
          </button>
          <a
            href="https://auth-module.lautaroayosa.com.ar/documentation/docs/intro"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
          >
            Read Docs
          </a>
        </div>
      </div>
    </div>
  );
};

  Home.getLayout = (page:React.ReactNode) => <MainLayout>{page}</MainLayout>
  
  export default Home;  