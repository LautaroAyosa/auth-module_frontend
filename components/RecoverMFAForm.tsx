import { useState } from "react";
import axios from "axios";
import Button from "./Button";
import FormInput from "./FormInput";
import { recoverMFA } from "@/utils/auth";
import { useRouter } from "next/router";

export default function RecoverMFAForm() {
  const [email, setEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!recoveryCode) {
        setError("Please enter your recovery Code")
        return
    }

    try {
        await recoverMFA( email, recoveryCode );
        setMessage("Your account has been successfully recovered. Redirecting...");
        setEmail("");
        setRecoveryCode("");
        // Redirect
        router.push('/auth/login')
    } catch (err) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Failed to recover account.");
        } else {
            setError("An unexpected error occurred.");
        }
    }
  };

  return (
    <form onSubmit={handleRecover} className="space-y-4">
      <FormInput
        label="Email address"
        type="text"
        placeholder="name@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormInput
        label="Recovery Code"
        type="text"
        placeholder="Enter your recovery code"
        value={recoveryCode}
        onChange={(e) => setRecoveryCode(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      <Button type="submit">Recover</Button>
    </form>
  );
}
