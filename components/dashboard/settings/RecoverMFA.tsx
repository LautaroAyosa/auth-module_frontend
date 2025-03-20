// components/settings/RecoverMFA.tsx
import { AuthContext } from "@/pages/_app";
import { useContext, useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormInput from "@/components/ui/FormInput";
import { toast } from "react-toastify";
import { recoverMFA } from "@/utils/auth";

export default function MFARecover() {
  const { user, setAuth } = useContext(AuthContext);
  const [showRecoverSection, setShowRecoverSection] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");

  const handleConfirm = async () => {
    setShowConfirmDialog(false);
    try {
      if (!user) return;
      const recoverMFAPromise = recoverMFA(user.email, recoveryCode, setAuth);
      toast.promise(recoverMFAPromise, {
        pending: "Recovering MFA...",
        success: "MFA disabled successfully.",
        error: "Failed to disable MFA.",
      });
      setShowRecoverSection(false);
    } finally {
      setShowRecoverSection(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        confirmation="Are you sure you want to recover (disable) MFA?"
        showConfirmDialog={showConfirmDialog}
        handleCancel={() => setShowConfirmDialog(false)}
        handleConfirm={() => {
          setShowRecoverSection(true);
          setShowConfirmDialog(false);
        }}
        confirmButton="Yes, Disable"
        cancelButton="No, Cancel"
      />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recover MFA</h3>
        {!showRecoverSection ? (
          <div className="space-y-2">
            <p className="text-gray-700">
              Lost access to your authenticator app? You can recover your account
              and disable MFA with a valid recovery code.
            </p>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => setShowConfirmDialog(true)}
              >
              Recover Account
            </button>
          </div>
        ) : (
          <form className="space-y-2">
            <FormInput
              label="MFA Recovery Code"
              type="text"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              placeholder="Recovery Code"
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleConfirm}
              >
              Confirm Recovery
            </button>
          </form>
        )}
      </div>
    </>
  );
}
