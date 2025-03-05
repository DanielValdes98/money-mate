import { Company } from "@/models/company";
import { Dispatch, SetStateAction } from "react";

export type FormEventProps = {
    setNewEvent: Dispatch<SetStateAction<{
        eventName: string;
        companieSelected: {
            name: string;
            id: number;
        };
    }>>, 
    setOpen: Dispatch<SetStateAction<boolean>>;
    companies: Company[];
    setOnSaveNewEvent: Dispatch<SetStateAction<boolean>>;
};