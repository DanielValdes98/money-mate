import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: {params: { companyId: number}}) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const data = await req.json();
        if (!data) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        // DEBUG: 
        console.log("[CREATE EVENT], values", data);

        // Petición al backend
        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create event");
        }

        const responseData = await response.json();
        return NextResponse.json(responseData);

    } catch (error) {
        console.error("[CREATE EVENT ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}