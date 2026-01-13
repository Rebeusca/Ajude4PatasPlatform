import { Header } from "@/components/ui/Header";
import { WhatsappCard } from "@/components/ui/WhatsappCard";
import Image from "next/image";


export default function NossaHistoria() {

    const stats = [
        { 
            number: "57", 
            label: "Cachorros", 
            img: "/images/malu.jpeg" 
        },
        { 
            number: "82", 
            label: "Gatos", 
            img: "/images/cat.jpg" 
        },
        { 
            number: "216", 
            label: "Resgatados",
            subLabel: "120 adotados",
            img: "/images/resgatados.jpg" 
        },
        { 
            number: "16", 
            label: "Voluntários", 
            img: "/images/image13.png" 
        },
    ];

    return (
        <>
            <div className="min-h-screen flex flex-col bg-white">
                <header>
                    <Header/>
                </header>

                <div className="flex flex-col md:flex-row items-center">
                    <h1 className="text-primary text-center mt-3 text-4xl font-bold md:ml-20 lg:text-4xl lg:mt-6 lg:mb-10"
                    >Nossa história</h1>
                </div>

                <div>
                    <Image
                        src="/svg/timeline.svg"
                        alt="Nossa História"
                        width={1200}
                        height={600}
                        className="w-full h-auto hidden md:block"
                    />
                    <Image
                        src="/svg/timelineY.svg"
                        alt="Nossa História"
                        width={1200}
                        height={600}
                        className="w-full h-auto mt-10 md:hidden"
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center mt-20">
                    <h1 className="text-primary text-center mt-3 text-4xl font-bold md:ml-20 lg:text-4xl lg:mt-6 lg:mb-10"
                    >Nossas estatísticas</h1>
                </div>

                <section className="py-16 px-4 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-32">
                        {stats.map((stat, index) => (

                            <div key={index} className="flex flex-col h-full relative z-10">
                                
                                <div className="bg-primary rounded-t-lg rounded-b-[100px] p-10 pb-12 flex flex-col items-center shadow-lg">

                                    <div className="text-white text-center mb-6 h-16 flex flex-col justify-center">
                                        {stat.subLabel ? (
                                            <>
                                                <p className="font-bold text-lg">{stat.number} {stat.label}</p>
                                                <p className="font-bold text-lg">{stat.subLabel}</p>
                                            </>
                                        ) : (
                                            <p className="font-bold text-xl">
                                                {stat.number} {stat.label}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-40 h-40 rounded-full overflow-hidden relative shadow-inner">
                                        <Image
                                            src={stat.img}
                                            alt={stat.label}
                                            fill
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <Image
                    src="/svg/svgfundo.svg"
                    alt="Nossa História"
                    width={1200}
                    height={600}
                    className="w-full h-auto hidden md:block -mt-36 relative z-0"
                />

                <footer className="flex flex-col md:flex-row justify-end items-center mx-10">
                    <WhatsappCard/>
                </footer>
            </div>
        </>
    )
}