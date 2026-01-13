

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/ui/Header"; 
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface AnimalDetailsProps {
  params: Promise<{ id: string }>;
}

async function getAnimal(id: string) {
  try {
    return await prisma.animal.findUnique({
      where: { id: id },
    });
  } catch (error) {
    console.error("Erro ao buscar animal:", error);
    return null;
  }
}

export default async function PetDetailsPage({ params }: AnimalDetailsProps) {
  const resolvedParams = await params;
  const animal = await getAnimal(resolvedParams.id);

  if (!animal) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-teal-500">
        <div className="bg-white p-0.5">
            <Header />
        </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
            <div className="w-full h-full">
                <img
                    src={animal.imageUrl || "/images/pet-placeholder.jpg"}
                    alt={animal.name}
                    className="w-full h-64 md:h-full rounded-3xl shadow-2xl"
                />
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-orange-400 mb-4">Pensando em adotar?</h1>
                <p className="text-gray-600">Adotar um animal é assumir um compromisso para a vida toda. Lembre-se de que ele fará parte da sua família por muitos anos e precisará não apenas de carinho, mas também de alimento de qualidade, cuidados veterinários, paciência e tempo. Não adote por impulso; adote com a certeza de que você está pronto para transformar uma vida e ser transformado por ela.</p>
            </div>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            {animal.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {animal.gender && (
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">Sexo</p>
                <p className="text-xl font-semibold text-gray-800 capitalize">
                  {animal.gender}
                </p>
              </div>
            )}

            {animal.age !== null && (
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">Idade</p>
                <p className="text-xl font-semibold text-gray-800">
                  {animal.age} {animal.age === 1 ? 'ano' : 'anos'}
                </p>
              </div>
            )}

            {animal.species && (
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">Espécie</p>
                <p className="text-xl font-semibold text-gray-800 capitalize">
                  {animal.species}
                </p>
              </div>
            )}
          </div>


            <Button>
                <a href="https://wa.me/5588998304647" target="_blank" rel="noopener noreferrer">Adotar / Apadrinhar</a>
            </Button>
          
        </div>
      </div>
    </main>
  );
}