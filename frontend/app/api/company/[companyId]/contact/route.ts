import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: {companyId: string} }) {
    try {
        const { companyId } = await params;
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const data = await req.json();
        data.clerk_user_id = userId; // Agregar el userId al request body
        data.company_id = companyId; // Agregar el companyId al request body

        // DEBUG: Verificar la estructura antes de enviarla al backend
        console.log("[CREATE CONTACT], values", data);

        // Petición al backend
        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/contacts/${companyId}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return new NextResponse("Failed to create contact", { status: 400 });
        }

        const responseData = await response.json();
        return NextResponse.json(responseData);

    } catch (error) {
        console.error("[CREATE CONTACT ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}