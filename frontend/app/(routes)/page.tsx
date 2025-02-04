import Image from "next/image";
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs";
import CardSummary from "./components/CardSummary/CardSummary";
import { BookOpenCheck, UserRound, Waypoints } from "lucide-react";

export const dataCards = [
  {
    icon: UserRound,
    total: "12000",
    average: 15,
    title: "Total Balance",
    tooltipText: "Total balance of all accounts",
    value: 5000,
    currency: "%",
    color: "blue",
    percentage: 20,
    isPositive: true,
  },
  {
    icon: Waypoints,
    total: "86.5%",
    average: 80,
    title: "Total Revenue",
    tooltipText: "Total revenue of all accounts",
    value: 5000,
    currency: "%",
    color: "blue",
    percentage: 20,
    isPositive: true,
  },
  {
    icon: BookOpenCheck,
    total: "363,95USD",
    average: 30,
    title: "Bounce Rate",
    tooltipText: "See all of the bounce rates",
    value: 5000,
    currency: "%",
    color: "blue",
    percentage: 20,
    isPositive: true,
  },
];

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
        {dataCards.map((card) => (
          <CardSummary
            // key={card.title} 
            // icon={card.icon}
            // total={card.total}
            // average={card.average}
            // title={card.title}
            // tooltipText={card.tooltipText}
            // value={card.value}
            // currency={card.currency}
            // color={card.color}
            // percentage={card.percentage}
            // isPositive={card.isPositive}

            // Lo que se puede hacer es pasarle el objeto completo, es lo mismo que hacer lo de arriba
            key={card.title} 
            {...card}
            />
        ))}
      </div>
    </div>
  );
}

        
