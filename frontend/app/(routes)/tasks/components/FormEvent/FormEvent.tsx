"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormEventProps } from "./FormEvent.types";

const formSchema = z.object({
  eventName: z
    .string()
    .nonempty()
    .min(3, "El nombre del evento debe tener al menos 3 caracteres"),
  companieSelected: z.object({
    name: z.string().min(2),
    id: z.number(),
  }),
});

export function FormEvent(props: FormEventProps) {
  const { companies, setNewEvent, setOnSaveNewEvent, setOpen } = props;
  const [selectedCompany, setSelectedCompany] = useState({
    name: "",
    id: 0,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      companieSelected: {
        name: "",
        id: 0,
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setNewEvent(values);
    setOpen(false);
    setOnSaveNewEvent(true);
  }

  const handleComapnyChange = (newValue: string) => {
    const selectedCompany = companies.find(
      (company) => company.name === newValue
    );

    if (selectedCompany) {
      setSelectedCompany({
        name: selectedCompany.name,
        id: selectedCompany.id,
      });
      form.setValue("companieSelected.name", selectedCompany.name);
      form.setValue("companieSelected.id", selectedCompany.id);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Nombre del evento" />
              </FormControl>

              <FormDescription>
                Este es el nombre del evento o tarea
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companieSelected.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <Select
                onValueChange={(newValue) => {
                  field.onChange(newValue);
                  handleComapnyChange(newValue);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una empresa" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Crear evento</Button>
      </form>
    </Form>
  );
}
