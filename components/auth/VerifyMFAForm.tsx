import { useContext, useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { verifyMFA } from "@/utils/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { AuthContext } from "@/pages/_app";

export default function VerifyMFAForm({ tempSessionId }: { tempSessionId: string }) {
  const [token, setToken] = useState("");
  const {setAuth} = useContext(AuthContext)
  const router = useRouter()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.warning("Please enter the MFA code.")
      return;
    }

    try {
      const verifyMFAPromise = verifyMFA( tempSessionId, token, setAuth );
      await toast.promise(
        verifyMFAPromise,
        {
          pending: "Verifying MFA...",
          success: "MFA verification successful.",
          error: "Failed to verify MFA."
        }
      )
      setToken("");
      // Redirect
      router.push('/')
    } finally {
      setToken("");
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

      <Button type="submit">Verify</Button>
    </form>
  );
}
