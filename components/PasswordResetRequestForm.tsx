import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import FormInput from "./FormInput";
import apiClient from "@/utils/axiosInstance";

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setMessage("");
    setError("");

    try {
      setIsLoading(true)
      await apiClient.post("/request-reset-password", { email });
      setMessage("Password reset link sent. Check your inbox.");
      setIsLoading(false)
      setCooldown(60); // 60-second cooldown
    } catch (err) {
      setIsLoading(false)
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to send a reset link.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleRequest}>
        <FormInput
          label="Email address"
          type="email"
          placeholder="name@domain.com"
          description="Please enter the email address you used when creating your account"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={cooldown > 0 || isLoading}>
          {isLoading ? `Loading...` : cooldown > 0 ? `Wait ${cooldown}s` : "Send Reset Link"}
        </Button>
      </form>
      {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default PasswordResetRequestForm;