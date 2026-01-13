import Link from "next/link";

interface PetCardProps {
  id: string;
  name: string;
  imageUrl: string | null;
}

export function PetCard({ id, name, imageUrl }: PetCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-xl transition-all duration-300 w-full max-w-70 mx-auto pb-6">
      <div className="relative w-full h-36 overflow-hidden rounded-t-3xl">
        <img
          src={imageUrl ?? "/images/pet-placeholder.jpg"}
          alt={name}
          className="w-full h-full object-top"
          style={{ clipPath: "ellipse(95% 100% at 50% 0%)" }}
        />
      </div>

      <div className="px-4 pt-2 pb-6 text-center">
        <h3 className="text-black font-bold text-xl lowercase">{name}</h3>
      </div>

      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-max">
        <Link href={`/pets/${id}`}>
          <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-10 rounded-xl shadow-md transition-colors text-lg">
            Saiba mais
          </button>
        </Link>
      </div>
    </div>
  );
}
