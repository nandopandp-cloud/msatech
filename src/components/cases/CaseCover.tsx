import Image from "next/image";
import type { CaseStudy } from "@/content/cases";
import { CaseArt } from "./CaseArt";
import { CaseShowcase } from "./CaseShowcase";

/** Capa do case: showcase composto → foto → arte generativa, nessa ordem. */
export function CaseCover({ item, sizes }: { item: CaseStudy; sizes: string }) {
  if (item.showcase) return <CaseShowcase showcase={item.showcase} sizes={sizes} />;
  if (item.image) return <Image src={item.image} alt="" fill sizes={sizes} className="object-cover" style={{ objectPosition: item.imagePosition }} />;
  return <CaseArt variant={item.art} />;
}
