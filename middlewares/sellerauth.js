import prisma from '../lib/prisma.js';

export async function sellerauth(userid){
    try{
        const user= await prisma.store.findUnique({
            where:{
                userId:userid   

            }
        });
        if(!user){
            return false;
        }
        return true;

    }
    catch(error){
        console.error("Error checking seller authentication:", error);
        return false;
    }
    
}