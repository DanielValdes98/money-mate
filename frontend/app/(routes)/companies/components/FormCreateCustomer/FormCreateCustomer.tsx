"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormCreateCustomerProps } from "./FormCreateCustomer.types";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  clerk_user_id: z.string(),
  name: z.string(),
  description: z.string(),
  country: z.string().min(2),
  website: z.string().min(2),
  phone: z.string().min(6),
  nit: z.string().min(6),
  profile_image: z.string(),
});

export function FormCreateCustomer(props: FormCreateCustomerProps) {
  const { setOpenModalCreate } = props;
  const router = useRouter();
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clerk_user_id: "",
      name: "",
      description: "",
      country: "",
      website: "",
      phone: "",
      nit: "",
      profile_image: "",
    },
  });

  const { isValid } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      const response = await axios.post("/api/company", values);
      console.log("Response from API:", response.data);

      toast({ title: "Empresa creada correctamente" });
      router.refresh();
      setOpenModalCreate(false);
    } catch (error) {
      console.error("API Error:", error);

      toast({
        title: "Error al crear la empresa",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la empresa"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un país" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="CO">Colombia</SelectItem>
                      <SelectItem value="US">Estados Unidos</SelectItem>
                      <SelectItem value="ES">España</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio web</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="www.example.com"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de contacto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+57 000 0000000"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    {photoUploaded ? (
                      <p className="text-sm">Imagen cargada</p>
                    ) : (
                      <UploadButton
                        className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                        {...field}
                        endpoint="profileImage"
                        onClientUploadComplete={(res) => {
                          form.setValue("profile_image", res?.[0].url, {
                            shouldValidate: true,
                          });
                          setPhotoUploaded(true);
                          toast({
                            title: "Imagen subida correctamente",
                          });
                        }}
                        onUploadError={(error: Error) => {
                          console.log(error);
                          toast({
                            title: "Error al subir la imagen",
                          });
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={!isValid}>
            Guardar
          </Button>
        </form>
      </Form>
    </div>
  );
}
