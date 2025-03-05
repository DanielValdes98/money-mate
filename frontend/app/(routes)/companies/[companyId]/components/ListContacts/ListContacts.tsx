import { redirect } from "next/navigation";
import { ListContactsProps } from "./ListContacts.types";
import { Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { Toast } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";

async function getContacts(companyId: number) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL_DEVELOP}/api/contacts/${companyId}/contacts`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }

    return await response.json();
  } catch (error) {
    console.error("[FETCH CONTACTS ERROR]", error);
    toast({
      title: "Error al cargar los contactos",
      variant: "destructive",
    });
    return []; // Retornar un array vacío en caso de error
  }
}

export async function ListContacts(props: ListContactsProps) {
  const { company } = props;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const contacts = await getContacts(company.id);
  // console.log("Contacts:", contacts);

  if (contacts.length === 0) {
    return <div>No hay contactos</div>;
  }

  return (
    <div>
      <div className="grid items-center justify-between grid-cols-3 p-2 px-4 mt-4 mb-2 rounded-lg gap-x-3 bg-slate-400/20">
        <p>Nombre</p>
        <p>Cargo</p>
        <p className="text-right">Contacto</p>
      </div>

      {contacts.map(
        (contact: {
          id: number;
          name: string;
          role: string;
          phone: string;
          email: string;
        }) => (
          <div key={contact.id}>
            <div className="grid items-center justify-between grid-cols-3 px-4 gap-x-3">
              <p>{contact.name}</p>
              <p>{contact.role}</p>
              <div className="flex items-center justify-end gap-x-6">
                <a href={`telco: ${contact.phone}`} target="_blank">
                  <Phone className="w-4 h-4" />
                </a>

                <a href={`mailto: ${contact.email}`} target="_blank">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
            <Separator className="my-3" />
          </div>
        )
      )}
    </div>
  );
}
