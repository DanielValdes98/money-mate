import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCompanies, getEvents } from "../tasks/page";
import { CompaniesChart } from "./components/CompaniesChart";

export default async function PageAnalytics() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Importante retornar con createdAt en orden descendente
  const companiesData = await getCompanies(userId);
  const eventsData = await getEvents(userId);

  const companies = JSON.parse(JSON.stringify(companiesData));
  const events = JSON.parse(JSON.stringify(eventsData));

  return (
    <div className="bg-background shadow-md rounded-lg p-4">
      <h2 className="mb-4 text-2xl">Analytics</h2>

      <div>
        <CompaniesChart companies={companies} events={events} />
      </div>
    </div>
  );
}
