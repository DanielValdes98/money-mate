import React from "react";

export default function LayoutAuth({ children }: { children: React.ReactNode}) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p>Brand (later)</p>

            <h1 className="text-3xl my-2 font-bold">
                ¡Bienvenido a tu gestor de finanzas!
            </h1>

            <h2 className="text-2xl mb-3">MoneyMate</h2>

            {children}
        </div>
    )
}
