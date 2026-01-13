import Image from "next/image";

type HomeCardProps = {
    imagePath: string;
    alt: string;
    title: string;
}

export function HomeCard({ imagePath, alt, title }: HomeCardProps) {
    return(
        <div className="bg-white shadow-cardHome rounded-lg w-46 h-38 m-10 flex flex-col justify-around items-center ">
            <div className="bg-primary w-16 h-16 rounded-full flex justify-center items-center mt-2">
                <Image className=" w-12 h-12 object-cover rounded-lg" src={imagePath} alt={alt} width={84} height={84} />
            </div>
            <h2 className="text-primary font-bold text-xl text-center">{title}</h2>
        </div>
    )
}
