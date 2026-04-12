

import { getAuth } from "@clerk/nextjs/server";
export async function GET(request) {
    try{
        const { userId } = getAuth(request);
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        // Check if the user is an admin
        const adminUserEmail = process.env.ADMIN_USER_EMAIL.split(',').includes(userId);
        if (!adminUserEmail) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        
        // const adminUser = await prisma.user.store.update({
        //     where: {
        //         id: userId,
        //     },
        //     data: {
        //         isAdmin: true,
        //     },
        // }); 
        // if (!adminUser) {
        //     return new Response(JSON.stringify({ error: "Admin user not found" }), { status: 404 });
        // }  
        // check if the admin user exists in the database
        return new Response(JSON.stringify({ message: "Admin authenticated successfully" }), { status: 200 });  
    }
    catch(error){

    }
}