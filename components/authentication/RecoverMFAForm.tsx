import { useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { recoverMFA } from "@/utils/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function RecoverMFAForm() {
  const [email, setEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    if (!recoveryCode) {
        setError("Please enter your recovery Code")
        setTimeout(() => {
          setError("");
        }, 3000);
        return
    }

    try {
      const recoverMFAPromise = recoverMFA( email, recoveryCode );
      await toast.promise(
        recoverMFAPromise, {
          pending: "Recovering account...",
          success: "Account recovered successfully.",
          error: "Failed to recover"
        }
      )
      setEmail("");
      setRecoveryCode("");
      // Redirect
      router.push('/auth/login')
    } finally {
      setEmail("");
      setRecoveryCode("");
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

      <Button type="submit">Recover</Button>
    </form>
  );
}
