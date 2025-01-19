import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { enableMFA, isLoggedIn } from "@/utils/auth";
import Link from "next/link";
import Layout from "./layout";
import Image from "next/image";

const UserComponent = () => {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    mfaEnabled: boolean;
  }
  const [user, setUser] = useState<User | undefined>(undefined);
  const [authenticated, setIsAuthenticated] = useState(false);

  interface MFAResult {
    message?: string;
    qrCode?: string;
    recoveryCode?: string;
  }
  const [MFAResult, setMFAResult] = useState<MFAResult | undefined>(undefined)
  const [showMFASection, setShowMFASection] = useState(false); // To handle post-MFA enable view
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // To control custom confirm dialog

  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { authenticated, user } = await isLoggedIn();
        if (authenticated && user) {
          setIsAuthenticated(true);
          setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            mfaEnabled: user.mfaEnabled,
          });
        } else {
          setIsAuthenticated(false);
          setUser(undefined);
        }
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, [router, showMFASection]);


  const callEnableMFA = async () => {
    setShowConfirmDialog(true); // Show confirmation dialog
  };

  const handleConfirm = async () => {
    setShowConfirmDialog(false); // Hide confirmation dialog
    try {
      const { message, qrCode, recoveryCode } = await enableMFA();
      setMFAResult({ message, qrCode, recoveryCode });
      setShowMFASection(true);
    } catch (err) {
      console.error("Failed to enable MFA", err);
      alert("There was an error enabling MFA. Please try again later.");
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false); // Hide confirmation dialog
  };

  return (
    <Layout>
      {authenticated && user ? (
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-gray-800 text-2xl font-semibold">Dashboard</h1>
          <div className="flex flex-col gap-y-4">
            {!user.mfaEnabled && !showMFASection ? (
              <button className="btn-primary" onClick={callEnableMFA}>
                Enable Multi-Factor Authentication (MFA)!
              </button>
            ) : null}

            {showMFASection && MFAResult ? (
              <div className="bg-gray-100 p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold text-gray-800">
                  Multi-Factor Authentication Enabled
                </h2>
                <p className="text-gray-600">
                  Please scan the QR code below using your authenticator app.
                </p>
                <div className="mt-4">
                  <Image
                    src={MFAResult.qrCode || ""}
                    alt="MFA QR Code"
                    width={200}
                    height={200}
                    className="border rounded shadow-sm"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Recovery Code:</h3>
                  <p className="text-red-600 font-mono text-sm bg-gray-50 p-2 rounded border border-red-200">
                    {MFAResult.recoveryCode}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Important:</strong> Store your recovery code in a secure place. You
                    will need it to access your account if you lose access to your authenticator
                    app.
                  </p>
                </div>
                <div>
                  <button className="btn-primary" onClick={() => setShowMFASection(false)}>Confirm Completion</button>
                  <p className="text-gray-600 mt-2 text-sm">
                    Only click confirm completion after you&apos;ve writen down your recovery code, scanned the QR Code and configured your MFA. 
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          You are not Authenticated. <Link href="/auth/login">Log In</Link> to access this page
        </>
      )}

      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800">Confirm Action</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to enable Multi-Factor Authentication (MFA)?
            </p>
            <div className="flex justify-end mt-4 gap-x-2">
              <button
                className="btn-danger px-4 py-2 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="btn-primary px-4 py-2 rounded"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserComponent;
