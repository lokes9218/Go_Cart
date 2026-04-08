import { getAuth } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server"; 
export async function POST(req) {
    try{
        const { userId } = getAuth(req);

        const formData = await req.formData();
        const name = formData.get('name');
        const username = formData.get('username');
        const email = formData.get('email');
        const address = formData.get('address');
        const description = formData.get('description');
        const image = formData.get('image');

        if (!name || !username || !email || !address || !description || !image) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        // check if user is already registered as a store
        const store = await prisma.store.findFirst({
            where: { userId: userId }
        });
        if (store) {
            return NextResponse.json({ error: "User is already registered as a store" }, { status: 400 });
        }
        const existingStore = await prisma.store.findFirst({
            where: { username: username }
        });
        if (existingStore) {
            return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
        }

        const isusernameTaken = await prisma.store.findFirst({
            where: { username: username }
        }); 
        if (isusernameTaken) {
            return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
        }
    }
    catch(error){

    }
}
