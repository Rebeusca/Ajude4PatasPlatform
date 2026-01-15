import Link from "next/link";
import Image from "next/image";

type HomeCardProps = {
    imagePath: string;
    alt: string;
    title: string;
    section: string
}

export function HomeCard({ imagePath, alt, title, section }: HomeCardProps) {
    return(
        <a href={section}>
            <div className="bg-white shadow-cardHome rounded-lg w-46 h-38 m-10 flex flex-col justify-around items-center cursor-pointer transition-transform duration-300 hover:scale-105">
                <div className="bg-primary w-16 h-16 rounded-full flex justify-center items-center mt-2">
                    <Image className=" w-12 h-12 object-cover rounded-lg" src={imagePath} alt={alt} width={84} height={84} />
                </div>
            <h2 className="text-primary font-bold text-xl text-center">{title}</h2>
            </div>
        </a>
        
    )
}   
