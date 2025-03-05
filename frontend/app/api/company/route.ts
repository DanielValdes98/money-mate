import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const data = await req.json();
        if (!data) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        data.clerk_user_id = userId; // Agregar el userId al request body

        // DEBUG: Verificar la estructura antes de enviarla al backend
        // console.log("[CREATE COMPANY], values", data);

        // Petición al backend
        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/companies/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create company");
        }

        const responseData = await response.json();
        return NextResponse.json(responseData);

    } catch (error) {
        console.error("[CREATE COMPANY ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/companies/user/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to get companies");
        }

        const responseData = await response.json();
        return NextResponse.json(responseData);

    } catch (error) {{
        console.error("[GET COMPANIES ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }}
}

