import { Header } from "@/components/ui/Header";
import { HomeCard } from "@/components/ui/HomeCard";
import Image from "next/image";
import { WhatsappCard } from "@/components/ui/WhatsappCard";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">

        <div className="bg-amarilo h-auto rounded-br-[140px] md:rounded-br-[200px]">

          <header>
            <Header/>
          </header>

          <main>

            <div className="flex flex-col md:flex-row items-center">
              <h1 className="text-secondary text-center mt-3 text-4xl font-bold md:ml-20 lg:text-6xl lg:mt-0 lg:mb-20">Conheça seu novo melhor amigo</h1>
              <Image className="w-3/4 h-auto mx-auto mr-40 mt-7 md:mt-10" src = "/dog-background-login.png" alt = "imagem de um cão" width={848} height={605}/>
            </div>

          </main>
        </div>

        <div className="flex items-center flex-col lg:flex-row lg:-mt-28">
          <HomeCard imagePath="/images/adote.png" alt="card adote" title="Adote"/>
          <HomeCard imagePath="/images/voluntario.png" alt="card se voluntarie" title="Seja um voluntário"/>
          <HomeCard imagePath="/images/doe.png" alt="card doe" title="Doe"/>
        </div>

        <footer className="flex flex-col md:flex-row justify-between items-center mx-10 mb-10">
            <h1 className="text-primary text-3xl font-bold">Veja quem está <br /> esperando por você!</h1>
            <WhatsappCard/>
        </footer>

      </div>
    </>
  );
}