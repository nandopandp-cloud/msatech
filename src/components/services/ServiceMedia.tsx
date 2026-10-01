import Image from "next/image";
import type { Service } from "@/content/services";
import { ServiceVisual } from "./ServiceVisual";

/** Foto do pilar (quando existir) ou a arte generativa como fallback. */
export function ServiceMedia({ service, sizes, priority }: { service: Service; sizes: string; priority?: boolean }) {
  if (!service.image) return <ServiceVisual id={service.id} />;
  return (
    <>
      <Image src={service.image} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      {service.warm && <span aria-hidden="true" className="absolute inset-0 bg-orange/45 mix-blend-color" />}
    </>
  );
}
