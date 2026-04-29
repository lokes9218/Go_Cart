import { getAuth } from "@clerk/nextjs/server"
import { admin } from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });    
        }
        const adminCheck = await admin(request);
        if (adminCheck.status !== 200) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }
        const { coupon, discount } = await request.json();
        const normalizedCode = (coupon?.code || "").toUpperCase().trim();
        if (!normalizedCode) {
            return new Response(JSON.stringify({ error: "Coupon code is required" }), { status: 400 });
        }
        await prisma.coupon.create({
            data: {
                code: normalizedCode,
                description: coupon?.description || "",
                discount: parseFloat(discount),
                forNewUser: Boolean(coupon?.forNewUser),
                forMember: Boolean(coupon?.forMember),
                isPublic: Boolean(coupon?.isPublic),
                expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt) : new Date(),
            },
        });
        return new Response(JSON.stringify({ message: "Coupon created successfully" }), { status: 201 });

    } catch (error) {
        console.error("Error creating coupon:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}


export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);    
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });    
        }
        const adminCheck = await admin(request);
        if (adminCheck.status !== 200) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }
        const { searchparam } = await request.json();
        await prisma.coupon.delete({
            where: {
                code: searchparam.toUpperCase(),
            },
        });
        return new Response(JSON.stringify({ message: "Coupon deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
// get all coupons
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });    
        }
        const adminCheck = await admin(request);
        if (adminCheck.status !== 200) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }
        const coupons = await prisma.coupon.findMany();
        return new Response(JSON.stringify({ coupons }), { status: 200 });
    }
    catch (error) {
        console.error("Error fetching coupons:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
