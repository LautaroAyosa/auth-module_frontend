import { useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { resetPassword } from "@/utils/auth";

export default function PasswordResetForm({ token }: { token: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      const resetPasswordPromise = resetPassword(token, newPassword);
      await toast.promise(
        resetPasswordPromise, 
        {
          pending: "Resetting password...",
          success: "Password reset successfuly",
          error: "Failed to reset password."
        }
      );
      setNewPassword("");
      setConfirmPassword("");
      router.push('/auth/login')
    } finally {

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

      <Button type="submit">Reset Password</Button>
      
    </form>
  );
}