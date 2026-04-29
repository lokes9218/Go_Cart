import { getAuth } from "@clerk/nextjs/server"
import { admin } from "@/middlewares/authAdmin";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const adminCheck = await admin(request);
        if (adminCheck.status !== 200) {
            const payload = await adminCheck.json().catch(() => ({}));
            return NextResponse.json(payload, { status: adminCheck.status });
        }

        const storeIdParam = request.nextUrl.searchParams.get("storeid")?.trim();
        const storeId = storeIdParam || undefined;
        const orderWhere = storeId ? { storeId } : undefined;
        const productWhere = storeId ? { storeId } : undefined;

        // Keep chart payload bounded so the endpoint stays fast on serverless DBs.
        // (Orders chart is per-day; recent history is usually enough.)
        const since = new Date();
        since.setDate(since.getDate() - 90);
        const chartWhere = storeId
            ? { storeId, createdAt: { gte: since } }
            : { createdAt: { gte: since } };

        // Run sequentially to avoid connection pool contention on Neon/serverless.
        const products = await prisma.product.count({ where: productWhere });
        const stores = await prisma.store.count();
        const ordersAgg = await prisma.order.aggregate({
            where: orderWhere,
            _sum: { total: true },
            _count: { _all: true },
        });
        const allOrders = await prisma.order.findMany({
            where: chartWhere,
            select: { id: true, createdAt: true },
            orderBy: { createdAt: "asc" },
        });

        const revenue = ordersAgg._sum.total ?? 0;
        const orders = ordersAgg._count._all ?? 0;

        return NextResponse.json(
            {
                products,
                revenue,
                orders,
                stores,
                allOrders,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        const message =
            process.env.NODE_ENV === "development"
                ? (error?.message || String(error))
                : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

