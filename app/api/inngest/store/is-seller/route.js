import { getAuth } from "@clerk/nextjs/server"
import { sellerauth } from "@/middlewares/sellerauth"
export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
        }

        const store = await sellerauth(userId)
        const isSeller = Boolean(store)

        return new Response(JSON.stringify({ isSeller, store }), { status: 200 })
    }
    catch (error) {
        console.error("Error checking seller status:", error);
        return new Response(JSON.stringify({ error: "Failed to check seller status" }), { status: 500 });
    }
}