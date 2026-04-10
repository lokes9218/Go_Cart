import {getAuth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {sellerauth} from "@/middlewares/sellerauth";
export async function GET(request) {
    try{
        // get the user id from the url query parameters params
        const {params}= new URL(request.url)
        const userid = params.get('userid')
        // get the store details from the database
        // const store = await prisma.store.findFirst({
        //     where: {
        //         ownerId: userid
        //     }
        // })
        const store = await sellerauth(userid)

        if (!userid) {
            return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401})
        }
        if (!store) {
            return new Response(JSON.stringify({error: "Store not found"}), {status: 404})
        }
        return new Response(JSON.stringify({ store }), { status: 200 })
        
    }catch(error){
        console.error("Error fetching store details:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch store details" }), { status: 500 });
    }
}