

import { getAuth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

export async function admin(request) {
    try{
        const { userId } = getAuth(request);
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        const clerkUser = await currentUser();
        const adminEmails = (process.env.ADMIN_USER_EMAIL || "")
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean);
        const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;
        if (!userEmail || !adminEmails.includes(userEmail)) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        return new Response(JSON.stringify({ message: "Admin authenticated successfully" }), { status: 200 });  
    }
    catch(error){
        console.error("Error checking admin access:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}