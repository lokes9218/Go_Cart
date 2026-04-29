

import {getAuth} from "@clerk/nextjs/server";
import {admin} from "@/middlewares/authAdmin";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request){ 
    try {
        const { userId } = getAuth(request);
        const isadmin = await admin(request);   
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (isadmin.status !== 200) {
            return NextResponse.json({ error: "Forbidden" }, { status: isadmin.status });
        }   
        return NextResponse.json({ isAdmin: true }, { status: 200 });
    }catch(error){
        console.error("Error checking admin access:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}