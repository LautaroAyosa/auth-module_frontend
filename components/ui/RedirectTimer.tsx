import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export function useRedirectTimer(success: boolean, seconds: number, redirectPath: string) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const router = useRouter();

  useEffect(() => {
    if (!success) return;

    if (timeLeft <= 0) {
      router.push(redirectPath);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup to prevent memory leaks
  }, [success, timeLeft, router, redirectPath]);

  return timeLeft; // Allows UI display of countdown
}
