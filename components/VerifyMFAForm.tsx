import { useState } from "react";
import axios from "axios";
import Button from "./Button";
import FormInput from "./FormInput";
import { verifyMFA } from "@/utils/auth";
import { useRouter } from "next/router";

export default function VerifyMFAForm({ tempSessionId }: { tempSessionId: string }) {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Please enter the MFA code.");
      return;
    }

    try {
      await verifyMFA( tempSessionId, token );
      setMessage("MFA verification successful. Redirecting...");
      setToken("");
      // Redirect
      router.push('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to verify MFA.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <FormInput
        label="MFA Code"
        type="text"
        placeholder="Enter your MFA code"
        description="Check your email or authenticator app for the code."
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      <Button type="submit">Verify</Button>
    </form>
  );
}
