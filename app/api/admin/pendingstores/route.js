import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { admin } from "@/middlewares/authAdmin";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const adminCheck = await admin(request);
        if (adminCheck.status !== 200) {
            const payload = await adminCheck.json().catch(() => ({ error: "Forbidden" }));
            return NextResponse.json(payload, { status: adminCheck.status });
        }

        const stores = await prisma.store.findMany({
            where: { status: "pending" },
            include: { user: true },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({ stores }, { status: 200 });
    } catch (error) {
        console.error("Error fetching pending stores:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
