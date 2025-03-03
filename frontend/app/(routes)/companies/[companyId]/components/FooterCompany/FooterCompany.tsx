"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FooterCompanyProps } from "./FooterCompany.types";
import { toast } from "@/hooks/use-toast";

export function FooterCompany(props: FooterCompanyProps) {
  const { companyId } = props;
  const router = useRouter();

  const onDeleteCompany = async () => {
    try {
      axios.delete(`/api/company/${companyId}`);
      toast({
        title: "Empresa eliminada correctamente",
      });
      router.push("/companies");
    } catch (error) {
      console.error("[DELETE COMPANY ERROR]", error);
      toast({
        title: "Error al eliminar la empresa",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end mt-5">
      <Button variant="destructive" onClick={onDeleteCompany}>
        <Trash className="w-4 h-4 mr-2" />
        Eliminar empresa
      </Button>
    </div>
  );
}
