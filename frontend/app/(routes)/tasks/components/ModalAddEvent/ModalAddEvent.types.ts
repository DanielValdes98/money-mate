import { Company } from "@/models/company";
import { Dispatch, SetStateAction } from "react";

export type ModalAddEventProps = {
        open: boolean;
        setOpen: Dispatch<SetStateAction<boolean>>;
        setOnSaveNewEvent: Dispatch<SetStateAction<boolean>>;
        companies: Company[];
        setNewEvent: Dispatch<SetStateAction<{
            eventName: string,
            companieSelected: { name: string, id: number }
        }>
    >;
}