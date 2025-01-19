// pages/auth/forgot-password.tsx
import PasswordResetRequestForm from "@/components/PasswordResetRequestForm";
import Layout from "./layout";

const ForgotPassword = () => {
  return (
    <Layout>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Forgot Password</h2>
      <PasswordResetRequestForm />
    </Layout>
  );
};

export default ForgotPassword;