import { AuthContext } from '@/pages/_app';
import { useContext } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Link from 'next/link';

function AccountInformationPage() {
  const { authenticated, user } = useContext(AuthContext);

  if (!authenticated) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Not logged in</h2>
        <p>Please log in to see your account information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold">Account Information</h1>
        <p className="text-gray-600">Manage details for your user account.</p>
      </header>

      {/* User Details Card */}
      <section className="bg-white p-4 rounded shadow">
        <div className="mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-gray-500">Basic info about you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <strong>Name:</strong> {user?.name}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div className='capitalize'>
            <strong>Role:</strong> {user?.role}
          </div>
          <div>
            <strong>MFA Enabled:</strong> {user?.mfaEnabled ? 'Yes' : 'No'}
          </div>
        </div>
      </section>

      {/* Extra content so it's not empty */}
      <section className="bg-white p-4 rounded shadow">
        <div className="mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">Security Settings</h2>
          <p className="text-sm text-gray-500">
            Enhance your account security &mdash; change password, enable MFA, etc.
          </p>
        </div>
        <div className='space-x-4'>
          <Link href="/dashboard/account/settings?tab=profile" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Change Password
          </Link>
          { !user?.mfaEnabled &&
            <Link href="/dashboard/account/settings?tab=security" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Activate MFA
            </Link>
          }
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <div className="mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">Account Preferences</h2>
          <p className="text-sm text-gray-500">Personalize your user experience.</p>
        </div>
        <p className="text-gray-700">
          Here you can configure notification preferences, interface themes, etc.
        </p>
        <p className='text-xs text-green-700'>Coming soon</p>
      </section>
    </div>
  );
}

AccountInformationPage.getLayout = (page:React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export default AccountInformationPage