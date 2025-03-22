// pages/auth/forgot-password.tsx
import PasswordResetRequestForm from "@/components/authentication/PasswordResetRequestForm";
import Link from "next/link";
import AuthLayout from "../../components/layout/AuthLayout";
import Layout from "../../components/layout/MainLayout";

function ForgotPassword () {
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Forgot Password</h2>
      <PasswordResetRequestForm />
      <div className="mt-4 flex justify-between text-sm text-blue-600">
        <Link className="hover:text-blue-500 hover:underline text-start" href="/authentication/login">Remembered your <br></br> Password? Login</Link>
        <Link className="hover:text-blue-500 hover:underline text-end" href="/authentication/register">Don&apos;t have an account? <br></br> Register</Link>
      </div>
    </>
  );
};

ForgotPassword.getLayout = (page:React.ReactNode) => <Layout><AuthLayout>{page}</AuthLayout></Layout>

export default ForgotPassword;