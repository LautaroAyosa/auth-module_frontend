// components/GoogleLoginButton.tsx
import React from "react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const googleLoginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
    window.location.href = googleLoginUrl; // Redirects to backend's Google login endpoint
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path
          d="M44.5 20H24v8.5h11.8C33.5 33 29 35.5 24 35.5c-6.2 0-11.5-4-13.5-9.5L6.5 32c3.5 6.5 10.5 11 18.5 11 10 0 18.5-7 20-16.5H44.5v-7z"
          fill="#4285F4"
        />
        <path
          d="M24 6.5c4.2 0 8 1.5 11 4.5l8-8C38 0 31.5-2 24-2c-8.5 0-16.5 4.5-20.5 11L13 18c2-6 8-11 11-11z"
          fill="#34A853"
        />
        <path
          d="M24 47c6.2 0 12-2.5 16.5-6.5L34 31c-2.5 2.5-6 4.5-10 4.5-6 0-11.5-4-13.5-9.5L6 32c3.5 7 10.5 12 18.5 12z"
          fill="#FBBC04"
        />
        <path
          d="M6.5 18C4.5 22.5 4.5 26 6.5 32l7-6c-1.5-2.5-1.5-6.5 0-9l-7-6z"
          fill="#EA4335"
        />
      </svg>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;