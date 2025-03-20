// pages/auth/[tempSessionId].tsx
import { useRouter } from "next/router";
import VerifyMFAForm from "@/components/auth/VerifyMFAForm";
import Link from "next/link";
import AuthLayout from "../../components/layout/AuthLayout";
import Layout from "../../components/layout/MainLayout";

const VerifyMFAPage = () => {
  const router = useRouter();
  const { tempSessionId } = router.query; // Extract token from URL query
  if (!tempSessionId) {
    return <p>Invalid or missing token.</p>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Verify MFA</h2>
      <VerifyMFAForm tempSessionId={tempSessionId as string} />
      <div className="mt-4 flex justify-between text-sm text-blue-600">
          <Link className="hover:text-blue-500 hover:underline" href="/auth/recover-MFA">Lost access to your MFA? Recover your account</Link>
      </div>
    </>
  );
};

VerifyMFAPage.getLayout = (page:React.ReactNode) => <Layout><AuthLayout>{page}</AuthLayout></Layout>

export default VerifyMFAPage;