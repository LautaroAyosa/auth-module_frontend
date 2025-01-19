import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-800 p-4 text-white">
          <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
          <nav>
            <a className="block py-2 hover:bg-gray-700" href="#">
              Home
            </a>
            <a className="block py-2 hover:bg-gray-700" href="#">
              Analytics
            </a>
          </nav>
        </aside>

        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
