import React from "react";

type LayoutProps = {
    children: React.ReactNode;
};

export default function AuthLayout({children}: LayoutProps) {
    return (
        <div className="bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center w-full">
            <div className="w-full max-w-sm bg-white rounded-md shadow-lg p-6">
                {children}    
            </div>
        </div>
    );
}