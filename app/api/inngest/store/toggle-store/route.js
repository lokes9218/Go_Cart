
import {getauth} from "@clerk/nextjs/server"
// toggle the store 
export async function POST(request) {
    try{
        const {userid}= await getauth(request)
        if (!userid) {
            return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401})
        }
        // toggle the store
        // get the store from the database
        const store = await prisma.store.findFirst({
            where: {
                ownerId: userid
            }
        })
        if (!store) {
            return new Response(JSON.stringify({error: "Store not found"}), {status: 404})
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
    catch(error){
        console.error("Error toggling store:", error);
        return new Response(JSON.stringify({ error: "Failed to toggle store" }), { status: 500 });
    }
}