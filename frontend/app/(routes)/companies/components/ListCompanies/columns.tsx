"use client";

import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@/models/company";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "profile_image",
    header: "Logo",
    cell: ({ row }) => {
      const image = row.getValue("profile_image");

      return (
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
            <Image
              src={
                typeof image === "string" && image.trim() !== ""
                  ? image
                  : "/images/company-icon.png"
              }
              alt="Logo de la empresa"
              width={80}
              height={80}
              className="object-contain w-full h-full"
              unoptimized={true}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Empresa
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "nit",
    header: "NIT",
  },
  {
    accessorKey: "phone",
    header: "Contacto",
  },
  {
    accessorKey: "country",
    header: "País",
  },
  {
    accessorKey: "website",
    header: "Sitio web",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-4 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Opciones</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href={`/companies/${id}`}
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Editar</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
