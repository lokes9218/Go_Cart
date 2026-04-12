import { getAuth } from "@clerk/nextjs/server"
import { admin } from "@/middlewares/authAdmin";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const {storeid} = await request.json();
        // check if the user is authenticated
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // orders products
        const orders = await prisma.order.findMany({
            where: {
                storeId: storeid,
            },
            include: {
                product: true,
            },
        });
        // total revenue        const totalRevenue = orders.reduce((acc, order) => acc + order.product.price, 0);
        // total orders
        const totalOrders = orders.length;
        // total products
        const totalProducts = await prisma.product.count({
            where: {
                storeId: storeid,
            },
        });
        
        
        return NextResponse.json({ totalRevenue, totalOrders, totalProducts }, { status: 200 });    
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}