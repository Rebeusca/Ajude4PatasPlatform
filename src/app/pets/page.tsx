"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/Header";
import { PetCard } from "@/components/ui/PetCard";
import { WhatsappCard } from "@/components/ui/WhatsappCard";
import Image from "next/image";

interface Animal {
  id: string;
  name: string;
  imageUrl: string | null;
  status: string;
}

export default function PetsPage() {
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
      <div className="min-h-screen flex items-center justify-center bg-teal-500">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white min-h-screen">
        <Header />

        <section className="pt-20 px-8" style={{ clipPath: "" }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-orange-400 text-3xl font-bold mb-8">
              Veja quem está
              <br />
              esperando por você
            </h1>

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
        </section>

        <footer>
          <WhatsappCard />
        </footer>

        <Image
          src="/svg/pets-bg.svg"
          alt="Pets background"
          width={1200}
          height={600}
          className="w-full h-auto"
        />
      </div>
    </>
  );
}
