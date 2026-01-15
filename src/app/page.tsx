import { Header } from "@/components/ui/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { HistorySection } from "@/components/sections/HistorySection";
import { PetSection } from "@/components/sections/PetSection";
import { WhatsappCard } from "@/components/ui/WhatsappCard";

export default function LandingPage() {
  return (
    <>
      <Header/>

      <section id="home">
        <HeroSection/>
      </section>

      <section id="sobre">
        <HistorySection/>
      </section>

      <section id="pets">
        <PetSection/>
      </section>

      <footer className="hidden md:block flex flex-col md:flex-row justify-between items-center mx-">
        <WhatsappCard/>
      </footer>
    </>
  )
}