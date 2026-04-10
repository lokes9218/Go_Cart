import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {userid} from "../../../middlewares/sellerauth.js"
export async function POST(req) {
    try{
        const { userId } = getAuth(req);
        const store= await userid(userId);
        if(!store){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const image = formData.get('image');
        if (!name || !description || !price || !image) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }


    
    }
    catch(error){
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}