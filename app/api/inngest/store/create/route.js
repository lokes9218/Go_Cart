import { currentUser, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import client from "@/app/api/config/imageKit";
export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const name = formData.get('name');
        const username = formData.get('username');
        const email = formData.get('email');
        const contact = formData.get('contact');
        const address = formData.get('address');
        const description = formData.get('description');
        const image = formData.get('image');

        if (!name || !username || !email || !contact || !address || !description || !image) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Ensure user row exists locally before Store create to satisfy FK constraints.
        const clerkUser = await currentUser();
        const clerkEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || email;
        const clerkName = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || clerkUser?.username || name;
        const clerkImage = clerkUser?.imageUrl || "";

        await prisma.user.upsert({
            where: { id: userId },
            update: {
                email: clerkEmail,
                name: clerkName,
                image: clerkImage,
            },
            create: {
                id: userId,
                email: clerkEmail,
                name: clerkName,
                image: clerkImage,
            },
        });

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

        // #image to uplaod in imageKit
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await client.upload({
            file: buffer,
            fileName: image.name || `store-${userId}`,
        });
        const logoUrl = response.url;

        const optimizedLogoUrl = client.url({
            src: logoUrl,
            transformation: [{ height: 300, width: 300, crop: "maintain_ratio" }],
        }) || logoUrl;

        const newStore = await prisma.store.create({
            data: {
                name,
                username,
                email,
                address,
                description,
                contact,
                logo: optimizedLogoUrl,
                userId: userId
            }
        });
        return NextResponse.json({ message: "Store created successfully", store: newStore }, { status: 201 });

    }
    catch (error) {
        console.error("Error creating store:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}


//check if the user is already registered as a store  so then send the status 
export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const store = await prisma.store.findFirst({
            where: { userId: userId }
        });
        if (store) {
            return NextResponse.json({ isRegistered: true, store }, { status: 200 });
        }
        return NextResponse.json({ isRegistered: false }, { status: 200 });
    }
    catch (error) {
        console.error("Error checking store registration:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}   
