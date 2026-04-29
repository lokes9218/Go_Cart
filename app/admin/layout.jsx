import AdminGate from "@/components/auth/AdminGate";
export const metadata = {
    title: "GoCart. - Admin",
    description: "GoCart. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <AdminGate>
            {children}
        </AdminGate>
    );
}
