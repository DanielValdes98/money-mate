import { LucideIcon } from "lucide-react";

export type CardSummaryProps = {
    icon: LucideIcon;
    total: string;
    average: number;
    title: string;
    tooltipText: string;
    value: number;
    currency: string;
    color: string;
    percentage: number;
    isPositive: boolean;
};