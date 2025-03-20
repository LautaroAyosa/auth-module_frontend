import { useRouter } from "next/router";
import { useContext,  useState } from "react";
import { updateEmail } from "@/utils/auth";
import { toast } from "react-toastify";
import Layout from "../../components/layout/MainLayout";
import { AuthContext } from "@/pages/_app";
import AuthLayout from "@/components/layout/AuthLayout";
import { useRedirectTimer } from "@/components/ui/RedirectTimer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const VerifyEmail = () => {
    const { setAuth } = useContext(AuthContext);
    const router = useRouter();
    const { token } = router.query; // Extract token from URL
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const timeLeft = useRedirectTimer(success, 5, "/dashboard/account/info");

    if (!router.isReady || !token) return; // Ensure token is available

    const verifyEmail = async () => {
        setShowConfirmDialog(false)
        try {
            setLoading(true)
            await toast.promise(
                updateEmail(token as string, setAuth), // Ensure token is a string
                {
                    pending: "Your email is being updated...",
                    success: "Email changed successfully!",
                    error: "There was an error updating your email.",
                }
            );
            setSuccess(true);
        } finally {
            setLoading(false);
        }
    };

        
    return (
        <AuthLayout>
            <ConfirmDialog
                confirmation="This action is irreversible. Please ensure you have access to your new email account before proceeding."
                showConfirmDialog={showConfirmDialog}
                handleConfirm={verifyEmail}
                handleCancel={() => setShowConfirmDialog(false)}
                confirmButton="Yes, I Confirm"
                cancelButton="No, Go Back"
            />
            <div className="flex flex-col items-center justify-center h-72">
                { !success ? <h2 className="text-3xl font-bold text-gray-700 text-center">Confirm Email Update</h2> : <h2 className="text-3xl font-bold text-gray-700 text-center">Email Updated Successfully</h2> }
                
                {loading && <p className="text-gray-500 mt-4">Receiving information...</p>}

                <div className="mt-6 text-center space-y-5">
                    { !success ? (
                        <>
                            <p className="font-normal">Are you sure you want to update your email address? Make sure you have access to the new email before proceeding.</p>
                            <button 
                                onClick={() => setShowConfirmDialog(true)} 
                                className="mt-4 px-8 py-3 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                Yes, Update Email
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-green-600 font-semibold">Your email address has been updated!</p>
                            <p className="text-gray-500">Redirecting to settings in {timeLeft} seconds...</p>
                            <button
                                onClick={() => router.push("/dashboard/account/info")}
                                className="mt-4 px-8 py-3 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Go to Settings
                            </button>
                        </>
                    )

                    }
                </div>
            </div>
        </AuthLayout>
    );
};

VerifyEmail.getFunction = (page:React.ReactNode) => <Layout>{page}</Layout>;

export default VerifyEmail;
