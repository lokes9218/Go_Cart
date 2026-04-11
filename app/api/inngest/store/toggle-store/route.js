import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { sellerauth } from "@/middlewares/sellerauth"
// toggle the store 
export async function POST(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
        }

        const store = await sellerauth(userId)

        // toggle the store
        if (!store) {
            return new Response(JSON.stringify({ error: "Store not found" }), { status: 404 })
        }

        // toggle the store status
        const updatedStore = await prisma.store.update({
            where: {
                id: store.id
            },
            data: {
                isActive: !store.isActive
            }
        })
        return new Response(JSON.stringify({ success: true, store: updatedStore }), { status: 200 })
    }
    catch (error) {
        console.error("Error toggling store:", error);
        return new Response(JSON.stringify({ error: "Failed to toggle store" }), { status: 500 });
    }
}