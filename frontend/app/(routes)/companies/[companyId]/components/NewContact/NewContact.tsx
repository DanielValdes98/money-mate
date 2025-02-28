"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormContact } from "./FormContact";

export function NewContact() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Agregar contacto</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar contacto</DialogTitle>
          <DialogDescription>Crear un nuevo contacto</DialogDescription>
        </DialogHeader>

        <FormContact setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
