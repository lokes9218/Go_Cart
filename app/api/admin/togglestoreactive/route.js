import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { admin } from "@/middlewares/authAdmin";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const adminCheck = await admin(request);
        if (adminCheck.status !== 200) {
            const payload = await adminCheck.json().catch(() => ({ error: "Forbidden" }));
            return NextResponse.json(payload, { status: adminCheck.status });
        }

        const body = await request.json().catch(() => ({}));
        const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";
        const isActive = Boolean(body.isActive);

        if (!storeId) return NextResponse.json({ error: "storeId is required" }, { status: 400 });

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { isActive },
        });

        return NextResponse.json({ store: updatedStore }, { status: 200 });
    } catch (error) {
        console.error("Error toggling store active status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
