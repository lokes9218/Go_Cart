

import {getAuth} from "@clerk/nextjs/server";
import {admin} from "@/middlewares/authAdmin";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
export async function POST(request){
    try {
        const { userId } = getAuth(request);
        const isadmin = await admin(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if(isadmin.status === 403){
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const adminUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isAdmin: true,
            },
        });
        if (!adminUser) {
            return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Admin authenticated successfully" }, { status: 200 });
       
        
        const {storeid,status} = await request.json();
        if(status === "approve"){
            await prisma.store.update({
                where:{
                    id:storeid
                },  
                data:{
                    isApproved:true
                }
            })
        }
        else if(status === "reject"){    
            await prisma.store.delete({
                where:{
                    id:storeid          
                }              
            })
        }           

            
    } catch (error) {
        
    }
}

// get all the pending stores for admin to approve or reject
export async function GET(request){ 
    try {
        const { userId } = getAuth(request);
        const isadmin = await admin(request);   
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if(isadmin.status === 403){
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }   
        const pendingStores = await prisma.store.findMany({
            where:{
                isApproved:false
            },
            include:{
                user:true
            }
        });
        return NextResponse.json({ pendingStores }, { status: 200 });
    }catch(error){
        console.error("Error fetching pending stores:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}