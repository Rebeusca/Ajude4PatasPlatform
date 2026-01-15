"use client";

import { useEffect, useState } from "react";
import { PetCard } from "@/components/ui/PetCard";
import { WhatsappCard } from "../ui/WhatsappCard";
import Image from "next/image";

interface Animal {
  id: string;
  name: string;
  imageUrl: string | null;
  status: string;
}

export function PetSection() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("/api/animais");
        const data = await response.json();

        const animaisDisponiveis = data.filter(
          (animal: Animal) => animal.status === "disponível"
        );

        setAnimals(animaisDisponiveis);
      } catch (error) {
        console.log("Erro ao buscar animais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <section id="pets" className="pt-15 bg-white">
      <div className="px-8">
        <h1 className="text-primary text-3xl font-bold p-6 mb-20">
          Veja quem está <br /> esperando por você!
        </h1>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20">
            {animals.slice(0, visibleCount).map((animal) => (
              <PetCard
                key={animal.id}
                name={animal.name}
                imageUrl={animal.imageUrl}
                id={animal.id}
              />
            ))}
          </div>

          {visibleCount < animals.length && (
            <div className="text-center mt-24">
              <button
                onClick={handleShowMore}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition-colors"
              >
                Veja mais
              </button>
            </div>
          )}

          {animals.length === 0 && (
            <p className="text-center text-gray-500">
              Nenhum animal disponível no momento.
            </p>
          )}
        </div>

        
      </div>

        <footer className="md:hidden flex flex-col md:flex-row justify-between items-center mt-20">
            <WhatsappCard/>
        </footer>

      <Image
        src="/svg/pets-bg.svg"
        alt="Pets background"
        width={1200}
        height={600}
        className="w-full h-auto mt-16"
      />
    </section>
  );
}
