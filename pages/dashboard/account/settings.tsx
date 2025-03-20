import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/pages/_app";
import EditProfile from "@/components/dashboard/settings/EditProfile";
import MFASetup from "@/components/dashboard/settings/SetupMFA";
import DashboardLayout from "../../../components/layout/DashboardLayout";

function SettingsPage() {
  const router = useRouter();
  const { authenticated, user } = useContext(AuthContext);
  
  // 1) Define TABS in an array of objects
  // Each item has an "id", "label", and its "content"
  const TABS = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <section className="bg-white p-4 rounded shadow">
          <EditProfile />
        </section>
      )
    },
    {
      id: "security",
      label: "Security",
      content: (
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Security Settings</h2>
          <p className="text-gray-600 mb-4">
            Strengthen your account with multi-factor authentication (MFA).
          </p>
          <MFASetup mfaEnabled={!!user?.mfaEnabled} />
        </section>
      )
    }
  ];

  // 2) State for which tab is currently active
  const [activeTab, setActiveTab] = useState<string>("profile");

  // If someone visits /settings?tab=security => open “Security” tab automatically
  useEffect(() => {
    const paramTab = router.query.tab as string;
    if (paramTab && TABS.some((t) => t.id === paramTab)) {
      setActiveTab(paramTab);
    }
  }, [router.query.tab]);

  // If not authenticated
  if (!authenticated) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Not logged in</h2>
        <p>Please log in to see your settings.</p>
      </div>
    );
  }

  // Handler for switching tabs (updates state + URL param)
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Update the URL param (shallow: true means no full page reload)
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: tabId },
      },
      undefined,
      { shallow: true }
    );
  };

  // Find the active tab object
  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-gray-600">
          Manage and secure your account quickly with tabs.
        </p>
      </header>

      {/* Tab Switcher */}
      <div>
        <nav className="px-2 flex">
          {TABS.map((tabObj) => (
            <button
            key={tabObj.id}
            onClick={() => handleTabClick(tabObj.id)}
            className={`
              px-8 py-2 rounded-t border border-b-0 border-solid border-gray-300
              ${
                activeTab === tabObj.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
              }
              `}
              >
              {tabObj.label}
            </button>
          ))}
        </nav>

        {/* Active Tab Content */}
        {currentTab.content}
      </div>
    </div>
  );
}

SettingsPage.getLayout = (page:React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export default SettingsPage