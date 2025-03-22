import { useState, useEffect } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { toast } from "react-toastify";
import { requestPasswordReset } from "@/utils/auth";

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState("");
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

    try {
      setIsLoading(true)
      
      const requestPasswordResetPromise = requestPasswordReset(email);
      await toast.promise(
        requestPasswordResetPromise, 
        {
          pending: "Sending reset link...",
          success: "Password reset link sent. Check your inbox.",
          error: "Failed to send reset link"
        }
      );
      toast.success("Password reset link sent. Check your inbox.")
      setCooldown(60); // 60-second cooldown
    } finally {
      setIsLoading(false)
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
    </div>
  );
};

export default PasswordResetRequestForm;