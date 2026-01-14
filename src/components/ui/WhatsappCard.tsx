'use client';

import Image from "next/image";

function goToWhatsapp() {
    window.open("https://wa.me/5588998304647", "_blank");
}

export function WhatsappCard() {
    return(
        <div 
            onClick={goToWhatsapp} 
            className="relative bg-white shadow-cardWhatsapp rounded-lg h-auto flex flex-col p-6 hover:cursor-pointer m-10 w-auto md:w-100 lg:fixed lg:bottom-10 lg:right-10 lg:m-0 lg:z-50"
        >
            <h3 className="text-green-500 font-bold">Deseja conversar conosco?</h3>
            
            <Image 
                className="hidden lg:block lg:absolute lg:bottom-38 lg:left-94 w-12 h-12 rounded-lg" 
                src="/images/whatsapp.png" 
                alt="Whatsapp" 
                width={40} 
                height={40} 
            />
            
            <p className="text-black pt-6 text-sm">
                Caso deseje conversar conosco para entender mais sobre o nosso trabalho, doar, adotar, ou ser um voluntário. <br />
                Contate-nos no Whatsapp.
            </p>
        </div>
    )
}