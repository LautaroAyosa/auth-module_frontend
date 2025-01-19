import ProtectedAuth from "@/components/ProtectedAuth";
import React from "react";

type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout({children}: LayoutProps) {
    return (
        <ProtectedAuth>
            <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center">
                <div className="w-full max-w-sm bg-white rounded-md shadow-lg p-6">
                    {children}    
                </div>
            </div>
        </ProtectedAuth>
    );
}