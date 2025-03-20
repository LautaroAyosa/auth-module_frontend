// components/settings/EditProfile.tsx
import FormInput from "@/components/ui/FormInput";
import { useContext, useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { updateUser } from "@/utils/auth";
import { toast } from "react-toastify";
import { AuthContext } from "@/pages/_app";

export default function EditProfile() {
  const { authenticated, user, setAuth } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const passwordsMatch =
    password === confirmPassword || (!password && !confirmPassword);

  if (!authenticated) {
    return <div>Loading...</div>;
  }

  const submitModifyAccount = async () => {
    try {
      const updateUserPromise = updateUser(name, email, password, confirmPassword, setAuth);
      setShowConfirmDialog(false);
      await toast.promise(updateUserPromise, {
        pending: "Updating your account...",
        success: "Account updated successfully.",
        error: "An error occurred updating your account.",
      });
    } finally {
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        showConfirmDialog={showConfirmDialog}
        confirmation={
          "This action will modify your account information. Proceed?"
        }
        handleCancel={() => setShowConfirmDialog(false)}
        handleConfirm={submitModifyAccount}
        confirmButton="Yes, Update"
        cancelButton="No, Cancel"
      />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
        <p className="text-gray-600">
          Update your basic information and credentials below.
        </p>

        <form className="space-y-4 mt-4">
          <FormInput
            label={"Full name"}
            type={"text"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />

          <FormInput
            label={"Email Address"}
            type={"text"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@domain.com"
            required
          />

          <div>
            <FormInput
              label={"New Password"}
              type={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="●●●●●●●●"
            />
            <FormInput
              label={"Confirm Password"}
              type={"password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="●●●●●●●●"
            />

            {/* Inline feedback for matching passwords */}
            {password && confirmPassword && passwordsMatch && (
              <p className="text-green-500 text-sm">Passwords match</p>
            )}
            {password && confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}
          </div>

          <button
            type="button"
            className={`${
              !passwordsMatch
                ? "bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                : "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            }`}
            disabled={!passwordsMatch}
            onClick={() => setShowConfirmDialog(true)}
          >
            Save Changes
          </button>
        </form>

      </div>
    </>
  );
}
