import Image from "next/image";
import { HomeCard } from "../ui/HomeCard";

export function HeroSection() {
    return (
    <>
      <div className="min-h-screen flex flex-col bg-white">

        <div className="bg-amarilo h-auto rounded-br-[140px] md:rounded-br-[200px]">
          <main>

            <div className="flex flex-col md:flex-row items-center">
              <h1 className="text-secondary text-center mt-3 text-4xl font-bold md:ml-20 lg:text-6xl lg:mt-0 lg:mb-20">Conheça seu novo melhor amigo</h1>
              <Image className="w-3/4 h-auto mx-auto mr-40 mt-7 md:mt-10" src = "/dog-background-login.png" alt = "imagem de um cão" width={848} height={605}/>
            </div>

          </main>
        </div>

        <div className="flex items-center flex-col lg:flex-row lg:-mt-28">
          <HomeCard imagePath="/images/adote.png" alt="card adote" title="Adote" section="#pets"/>
          <HomeCard imagePath="/images/voluntario.png" alt="card se voluntarie" title="Seja um voluntário" section="https://wa.me/5588998304647"/>
          <HomeCard imagePath="/images/doe.png" alt="card doe" title="Doe" section="https://wa.me/5588998304647"/>
        </div>
      </div>
    </>
  );
}