import { auth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const data = await req.json();

        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!data) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        // Aquí se debería guardar la empresa en la base de datos apuntando a mi backend
        // const company = await ............;
    }
    catch (error) {
        console.error("[COMPANY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}