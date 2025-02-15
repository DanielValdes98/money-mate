"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "./data-table";
import { Company } from "@/models/company";
import { columns } from "./columns";

export function ListCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/company");
        // console.log("Response from API:", response.data);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Error al cargar las empresas");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []); // Solo se ejecuta cuando el componente se monta

  // DEBUG: Verificar que las empresas se cargaron correctamente
  // useEffect(() => {
  //   console.log("Empresas cargadas:", companies);
  // }, [companies]); // Se ejecuta cada vez que `companies` cambia

  return <DataTable columns={columns} data={companies} />;
}
