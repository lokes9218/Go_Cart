'use client'

import AdminLayout from "@/components/admin/AdminLayout";
import Loading from "@/components/Loading";
import { useClerk, useUser } from "@clerk/nextjs";

export default function AdminGate({ children }) {
    const { isLoaded, isSignedIn } = useUser();
    const { openSignIn } = useClerk();

    if (!isLoaded) return <Loading />;

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not signed in</h1>
                <button
                    type="button"
                    onClick={() => openSignIn()}
                    className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full"
                >
                    Sign in to continue
                </button>
            </div>
        );
    }

    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}
