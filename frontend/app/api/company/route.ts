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
