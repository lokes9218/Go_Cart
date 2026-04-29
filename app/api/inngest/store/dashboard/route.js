


import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { sellerauth } from "@/middlewares/sellerauth";
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });    
        }

        const store = await sellerauth(userId)

        if (!store) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        // fetch the store details from the database
        const orders = await prisma.order.findMany({
            where: {
                storeId: store.id
            }
        })
        const products = await prisma.product.findMany({
            where: {
                storeId: store.id
            }
        })
        const dashboardData = {
            totalOrders: orders.length,
            totalProducts: products.length,
            totalRevenue: orders.reduce((total, order) => total + order.total, 0)
        }
        // return the dashboard data

        return new Response(JSON.stringify({ store, dashboardData }), { status: 200 });

    } 
    catch (error) {
        console.error("Error fetching dashboard data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch dashboard data" }), { status: 500 });
    }   
} 
