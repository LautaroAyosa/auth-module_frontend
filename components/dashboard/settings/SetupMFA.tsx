// components/settings/SetupMFA.tsx
import React, { useContext, useState } from "react";
import Image from "next/image";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { enableMFA } from "@/utils/auth";
import { AuthContext } from "@/pages/_app";
import MFARecover from "./RecoverMFA";
import { toast } from "react-toastify";

interface MFASetupProps {
  mfaEnabled: boolean;
}
interface MFAResult {
  message?: string;
  qrCode?: string;
  recoveryCode?: string;
}

export default function MFASetup({ mfaEnabled }: MFASetupProps) {
  const { setAuth } = useContext(AuthContext);
  const [mfaResult, setMFAResult] = useState<MFAResult | undefined>(undefined);
  const [showMFASection, setShowMFASection] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleConfirm = async () => {
    setShowConfirmDialog(false);
    try {
      const enableMFAPromise = enableMFA(setAuth);
      const { message, qrCode, recoveryCode } = await toast.promise(enableMFAPromise, {
        pending: "Enabling MFA...",
        success: "MFA enabled successfully.",
        error: "Failed to enable MFA.",
      });

      setMFAResult({ message, qrCode, recoveryCode });
      setShowMFASection(true);
    } finally {
    }
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog
        showConfirmDialog={showConfirmDialog}
        confirmation={"Are you sure you want to enable MFA?"}
        handleCancel={() => setShowConfirmDialog(false)}
        handleConfirm={handleConfirm}
        confirmButton="Enable MFA"
        cancelButton="No, Cancel"
      />
      {!mfaEnabled && !showMFASection && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Enable Multi-Factor Authentication (MFA)</h3>
          <p className="text-gray-700">
            Strengthen your security by requiring a one-time code in addition to your password.
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowConfirmDialog(true)}
          >
            Enable MFA
          </button>
        </div>
      )}

      {mfaEnabled && !showMFASection && (
        <div className="space-y-2">
          <p className="text-green-600">
            You already have MFA enabled on your account.
          </p>
          <MFARecover />
        </div>
      )}

      {showMFASection && mfaResult?.qrCode && (
        <div className="bg-gray-50 p-4 rounded shadow space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Multi-Factor Authentication Enabled
          </h4>
          <p className="text-gray-600">
            Scan the QR code below using your authenticator app.
          </p>
          <Image
            src={mfaResult.qrCode}
            alt="MFA QR Code"
            width={200}
            height={200}
            className="border rounded shadow-sm"
          />
          <div>
            <h5 className="font-semibold text-gray-800">Recovery Code:</h5>
            <p className="text-red-600 font-mono text-sm bg-gray-100 p-2 rounded border border-red-200">
              {mfaResult.recoveryCode}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              <strong>Important:</strong> Store your recovery code securely.
            </p>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowMFASection(false)}
          >
            I&apos;ve Finished MFA Setup
          </button>
        </div>
      )}
    </div>
  );
}
