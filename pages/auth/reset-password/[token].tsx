// pages/auth/reset-password.tsx
import { useRouter } from "next/router";
import PasswordResetForm from "@/components/PasswordResetForm";
import Layout from "../layout";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query; // Extract token from URL query
  if (!token) {
    return <p>Invalid or missing token.</p>;
  }

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Reset Password</h2>
      <PasswordResetForm token={token as string} />
    </Layout>
  );
};

export default ResetPassword;