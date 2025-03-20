// pages/dashboard/index.tsx
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useContext } from 'react';
import { AuthContext } from '../_app';

function DashboardHome() {
  const {user} = useContext(AuthContext)

  return (
    <div className="space-y-6">
      {/* Hero / Welcome Section */}
      <section className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        <p className="text-gray-600 mt-2">
          We&apos;re excited to have you here! Explore your account, manage
          your settings, and stay in control with our all-in-one dashboard.
        </p>
      </section>

      {/* Getting Started Tips */}
      <section className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Getting Started</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>
            <strong>Review Your Profile:</strong> Verify that your name and email are correct.
          </li>
          <li>
            <strong>Enable MFA:</strong> Secure your account with multi-factor authentication. 
          </li>
          <li>
            <strong>Explore Features:</strong> Check out new sections, such as
            Administrator tools or advanced Account Settings.
          </li>
        </ol>
        <p className="text-gray-600">
          For detailed instructions, head to the{" "}
          <Link href="/dashboard/account/info" className="text-blue-600 hover:underline">
            Account Information
          </Link>{" "}
          or{" "}
          <Link href="/dashboard/account/settings" className="text-blue-600 hover:underline">
            Settings
          </Link>{" "}
          pages.
        </p>
      </section>

      {/* Quick Links */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/account/info"
            className="block bg-gray-100 p-4 rounded hover:bg-gray-200 transition"
          >
            <h3 className="font-semibold">Account Info</h3>
            <p className="text-sm text-gray-600">View your profile details</p>
          </Link>
          <Link
            href="/dashboard/account/settings"
            className="block bg-gray-100 p-4 rounded hover:bg-gray-200 transition"
          >
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm text-gray-600">Change your passwords, update MFA</p>
          </Link>
          { user?.role === 'admin' &&
          <Link
            href="/dashboard/admin/users"
            className="block bg-gray-100 p-4 rounded hover:bg-gray-200 transition"
          >
            <h3 className="font-semibold">Manage Users</h3>
            <p className="text-sm text-gray-600">If you&apos;re an admin, manage user roles</p>
          </Link>
          }
        </div>
      </section>
    </div>
  );
}

DashboardHome.getLayout = (page:React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export default DashboardHome;
