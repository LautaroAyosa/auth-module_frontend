import { useState } from "react";
import axios from "axios";
import Button from "./Button";
import FormInput from "./FormInput";
import apiClient from "@/utils/axiosInstance";
import Link from "next/link";

export default function PasswordResetForm({ token }: { token: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");


    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await apiClient.post("/reset-password", { token, newPassword });
      setMessage("Password reset successful. You can now log in.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to reset password.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <FormInput
        label="New Password"
        type="password"
        placeholder="●●●●●●●●"
        description="Must be at least 8 characters long."
        value={newPassword}
        onChange={(e) =>  {
          setNewPassword(e.target.value)
        }}
        required
      />

      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="●●●●●●●●"
        description="Must match the password above."
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
      />

      {/* Inline feedback for matching passwords */}
      {newPassword && confirmPassword && newPassword === confirmPassword ? (
        <p className="text-green-500 text-sm">Passwords match</p>
      ) : null}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      {message ? <Link className="btn-primary mt-4 flex justify-center" href="/auth/login">Go to log in page</Link> : <Button type="submit">Reset Password</Button> }
      
    </form>
  );
}