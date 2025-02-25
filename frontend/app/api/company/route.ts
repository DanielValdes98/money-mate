import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const data = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!data) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        // Agregar el userId al request body
        data.clerk_user_id = userId;

        // DEBUG: Verificar la estructura antes de enviarla al backend (SOLO PARA PROBAR QUÉ SE ESTÁ ENVIANDO, NO SE USA)
        // return NextResponse.json({ debug: data }); // Para inspeccionar en la respuesta

        // Hacer la petición al backend
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
        console.error("[COMPANY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
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
        console.error("[COMPANY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }}
}

export async function getCompanyById(req: Request){
    try {
        const { userId } = await auth();
        if (!userId){
            return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
        }

        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get("companyId");

        if (!companyId){
            throw new Error("Company ID is required");
            // return new NextResponse("Bad Request", { status: 400 });
        }

        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/companies/${companyId}/user/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok){
            throw new Error("Failed to get company");
        }

        const responseData = await response.json();
        return NextResponse.json(responseData);

    } catch (error) {
        console.error("[COMPANY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}