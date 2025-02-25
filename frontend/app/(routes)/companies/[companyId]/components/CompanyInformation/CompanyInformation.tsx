import Image from "next/image";
import { CompanyInformationProps } from "./CompanyInformation.types";
import { User } from "lucide-react";

export function CompanyInformation(props: CompanyInformationProps) {
  const { company } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
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
          {/* TODO: Company FORM */}
          <p>Company Form</p>
        </div>
      </div>

      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4 h-min">
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <User className="w-5 h-5" />
            Contacts
          </div>

          <div>
            {/* TODO: New contact */}
            <p>New contact...</p>
          </div>
        </div>

        <p>List contacts...</p>
      </div>
    </div>
  );
}
