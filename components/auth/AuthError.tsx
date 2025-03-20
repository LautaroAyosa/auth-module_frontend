// components/AuthError.tsx
import React from "react";

interface AuthErrorProps {
  message: string;
}

const AuthError: React.FC<AuthErrorProps> = ({ message }) => {
  if (!message) return null;

  return <p className="text-red-500 text-sm">{message}</p>;
};

export default AuthError;