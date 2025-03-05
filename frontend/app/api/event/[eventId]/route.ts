import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: {eventId: number} }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { eventId } = await params;
        console.log("[DELETE EVENT], eventId", eventId); // DEBUG: Verificar la estructura antes de enviarla al backend

        // Petición al backend
        const response = await fetch(`${process.env.BACKEND_URL_DEVELOP}/api/events/${eventId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to delete event");
        }

        return new NextResponse("Evento eliminado", { status: 200 });
    }
    catch (error){
        console.log("[DELETE EVENT ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}