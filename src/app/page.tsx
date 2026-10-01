import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollHud } from "@/components/layout/ScrollHud";
import { Hero } from "@/components/hero/Hero";
import { Concept } from "@/components/sections/Concept";
import { Services } from "@/components/services/Services";
import { Journey } from "@/components/sections/Journey";
import { Purpose } from "@/components/sections/Purpose";
import { Cases } from "@/components/cases/Cases";
import { Proof } from "@/components/sections/Proof";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Why } from "@/components/sections/Why";
import { Manifesto } from "@/components/sections/Manifesto";
import { Contact } from "@/components/sections/Contact";

/**
 * Narrativa: impacto → o que somos → o que fazemos → como fazemos → por quê →
 * prova → ecossistema → convicções → manifesto → conversa.
 */
export default function Home() {
  return (
    <>
      <Header />
      <ScrollHud />
      <main id="conteudo">
        <Hero />
        <Concept />
        <Services />
        <Journey />
        <Purpose />
        <Cases />
        <Proof />
        <Ecosystem />
        <Why />
        <Manifesto />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
