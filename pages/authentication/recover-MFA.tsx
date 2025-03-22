import RecoverMFAForm from "@/components/authentication/RecoverMFAForm";
import AuthLayout from "../../components/layout/AuthLayout";
import Layout from "../../components/layout/MainLayout";

function RecoverMFA () {
    return (
      <>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Recover account</h2>
        <RecoverMFAForm/>
      </>
    );
};

RecoverMFA.getLayout = (page:React.ReactNode) => <Layout><AuthLayout>{page}</AuthLayout></Layout>


export default RecoverMFA;