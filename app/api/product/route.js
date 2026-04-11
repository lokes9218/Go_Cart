import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sellerauth } from "@/middlewares/sellerauth";
import prisma from "@/lib/prisma";
import client from "@/app/api/config/imageKit";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const store = await sellerauth(userId);
        if (!store) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = Number(formData.get('price'));
        const mrp = Number(formData.get('mrp'));

        const possibleImages = [
            ...formData.getAll('images'),
            formData.get('image'),
            formData.get('image1'),
            formData.get('image2'),
            formData.get('image3'),
            formData.get('image4'),
        ].filter(Boolean);

        const imageFiles = possibleImages.filter((item) => typeof item?.arrayBuffer === "function");

        if (!name || !description || !category || !Number.isFinite(price) || !Number.isFinite(mrp) || imageFiles.length === 0) {
            return NextResponse.json({ error: "Name, description, category, mrp, price and at least one image are required" }, { status: 400 });
        }

        const uploadedImages = await Promise.all(
            imageFiles.map(async (file, index) => {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadResult = await client.upload({
                    file: buffer,
                    fileName: file.name || `product-${store.id}-${index + 1}`,
                });
                return uploadResult.url;
            })
        );

        const product = await prisma.product.create({
            data: {
                name,
                description,
                category,
                mrp,
                price,
                images: uploadedImages,
                storeId: store.id,
            },
        });

        return NextResponse.json({ message: "Product created successfully", product }, { status: 201 });

    }
    catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}