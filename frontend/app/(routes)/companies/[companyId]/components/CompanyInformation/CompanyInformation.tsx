import Image from "next/image";
import { CompanyInformationProps } from "./CompanyInformation.types";
import { User } from "lucide-react";
import { CompanyForm } from "../CompanyForm";
import { NewContact } from "../NewContact";
import { ListContacts } from "../ListContacts";

export function CompanyInformation(props: CompanyInformationProps) {
  const { company } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <Image
            src={
              typeof company.profile_image === "string" &&
              company.profile_image.trim() !== ""
                ? company.profile_image
                : "/images/company-icon.png"
            }
            alt="Imagen de la empresa"
            width={50}
            height={50}
            className="mb-3 rounded-lg"
          />

          <CompanyForm company={company} />
        </div>
      </div>

      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4 h-min">
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <User className="w-5 h-5" />
            Contactos
          </div>

          <div>
            <NewContact />
          </div>
        </div>

        <ListContacts company={company} />
      </div>
    </div>
  );
}
