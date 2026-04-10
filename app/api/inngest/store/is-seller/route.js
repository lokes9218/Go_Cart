
import {getauth} from "clerk/nextjs/server"
import prisma from "@/lib/prisma"
import {sellerauth} from "@/middlewares/sellerauth"
export async function GET(request) {
    try{
        const {userid}= await getauth(request)
        const isSeller = await sellerauth(userid)
        if (!userid) {
            return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401})
        }
        return new Response(JSON.stringify({ isSeller }), { status: 200 })
        if (!isSeller) {
            return new Response(JSON.stringify({error: "Forbidden"}), {status: 403})
        }

        // fetch the store details from the database
        const store = await prisma.store.findFirst({
            where: {
                ownerId: userid
            }
        })
        if (!store) {
            return new Response(JSON.stringify({error: "Store not found"}), {status: 404})
        }
        // return the store details
        return new Response(JSON.stringify({ store }), { status: 200 })
        
    }
    catch(error){
        console.error("Error checking seller status:", error);
        return new Response(JSON.stringify({ error: "Failed to check seller status" }), { status: 500 });
    }
}