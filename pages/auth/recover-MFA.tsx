import RecoverMFAForm from "@/components/RecoverMFAForm";
import Layout from "./layout";

export default function RecoverMFA () {
    return (
      <Layout>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Recover account</h2>
        <RecoverMFAForm/>
      </Layout>
    );
};