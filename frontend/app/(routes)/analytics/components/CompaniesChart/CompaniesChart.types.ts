import { Company } from "@/models/company";
import { Event } from "@/models/event";

export type CompaniesChartProps = {
    companies: Company[];
    events: Event[];
}