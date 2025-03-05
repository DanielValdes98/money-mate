import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{companyId: string}> }) {
    try {
        const { userId } = await auth();
        const { companyId } = await params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        values.clerk_user_id = userId; // Agregar el userId al request body

        // DEBUG: Verificar la estructura antes de enviarla al backend
        // console.log("[UPDATE COMPANY], values", values);

        // Petición al backend
        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/companies/${companyId}/user/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            throw new Error("Failed to create company");
        }

        return new NextResponse("Empresa actualizada", { status: 200 });
    }
    catch (error){
        console.log("[UPDATE COMPANY ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{companyId: number}> }) {
    try {
        const { userId } = await auth();
        const { companyId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // DEBUG: Verificar la estructura antes de enviarla al backend
        console.log("[DELETE COMPANY], companyId", companyId);

        // Petición al backend
        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/companies/${companyId}/user/${userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to delete company");
        }

        return new NextResponse("Empresa eliminada", { status: 200 });
    }
    catch (error){
        console.log("[DELETE COMPANY ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}