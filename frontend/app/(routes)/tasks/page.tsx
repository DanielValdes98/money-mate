import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Toast } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "./components/Calendar";
import { Event } from "@/models/event";

async function getCompanies(clerk_user_id: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL_DEVELOP}/api/companies/user/${clerk_user_id}`,
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
    console.error("[FETCH COMPANIES ERROR]", error);
    toast({
      title: "Error al cargar las empresas",
      variant: "destructive",
    });
    return [];
  }
}

async function getEvents(clerk_user_id: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL_DEVELOP}/api/events/user/${clerk_user_id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return await response.json();
  } catch (error) {
    console.error("[FETCH EVENTS ERROR]", error);
    toast({
      title: "Error al cargar los eventos",
      variant: "destructive",
    });
    return [];
  }
}

export default async function TasksPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Obtener empresas y eventos
  const companiesData = await getCompanies(userId);
  const eventsData = await getEvents(userId);

  // Serializar y deserializar para asegurar consistencia en SSR
  const companies = JSON.parse(JSON.stringify(companiesData));
  const events = JSON.parse(JSON.stringify(eventsData));

  return (
    <div>
      <Calendar companies={companies} events={events} />
    </div>
  );
}
