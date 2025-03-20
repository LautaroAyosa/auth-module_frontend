// pages/auth/reset-password.tsx
import { useRouter } from "next/router";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import AuthLayout from "../../../components/layout/AuthLayout";
import Layout from "../../../components/layout/MainLayout";

function ResetPassword () {
  const router = useRouter();
  const { token } = router.query; // Extract token from URL query
  if (!token) {
    return <p>Invalid or missing token.</p>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Reset Password</h2>
      <PasswordResetForm token={token as string} />
    </>
  );
};

ResetPassword.getLayout = (page:React.ReactNode) => <Layout><AuthLayout>{page}</AuthLayout></Layout>

export default ResetPassword;