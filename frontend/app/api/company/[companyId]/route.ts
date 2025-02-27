import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: {companyId: string} }) {
    try {
        const { userId } = await auth();
        const { companyId } = await params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Agregar el userId al request body
        values.clerk_user_id = userId;

        // DEBUG: Verificar la estructura antes de enviarla al backend (SOLO PARA PROBAR QUÉ SE ESTÁ ENVIANDO, NO SE USA)
        // return NextResponse.json({ debug: {...values} }); // Para inspeccionar en la respuesta

        // Hacer la petición al backend
        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/companies/${companyId}/user/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            throw new Error("Failed to create company");
        }

        const company = null;

        return NextResponse.json(company);
    }
    catch (error){
        console.log("[COMPANY ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}