import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { FooterCompany } from "./components/FooterCompany";
import { CompanyInformation } from "./components/CompanyInformation";
// import { useEffect, useState } from "react";
// import axios from "axios";

export default async function CompanyIdPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { userId } = await auth();
  const { companyId } = await params;

  if (!userId) {
    return redirect("/");
  }

  // Obtener la empresa desde la API del backend
  const response = await fetch(
    `${process.env.BACKEND_URL_DEVELOP}/api/companies/${companyId}/user/${userId}`,
    {
      cache: "no-store", // Para asegurarnos de obtener los datos más recientes
    }
  );

  if (!response.ok) {
    console.error("Error fetching company data");
    return redirect("/companies"); // Redirigir si la empresa no existe
  }

  const company = await response.json();

  // DEBUG: Verificar que la empresa se cargó correctamente
  // console.log("CompanyIdPage data company:", company);

  return (
    <div>
      <Header />
      <CompanyInformation company={company} />
      <FooterCompany companyId={company.id} />
    </div>
  );
}
