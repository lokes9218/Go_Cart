import prisma from '../lib/prisma.js';

export async function sellerauth(userid){
    try{
        const store = await prisma.store.findUnique({
            where:{
                userId:userid   

            }
        });
        if(!store){
            return null;
        }
        return store;

    }
    catch(error){
        console.error("Error checking seller authentication:", error);
        return null;
    }
    
}