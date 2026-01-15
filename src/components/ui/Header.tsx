"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");
  
  const isSpecialPage = pathname.startsWith("/auth") || pathname.startsWith("/pets/");

  useEffect(() => {
    if (isSpecialPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isSpecialPage]);

  function navLinkPaths(sectionId: string) {
    const base = "transition-colors hover:text-secondary hover:text-lg cursor-pointer ";
    const ativo = "text-secondary text-lg";
    const inativo = "text-primary";
    
    return `${base} ${activeSection === sectionId ? ativo : inativo}`;
  }

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    if (isSpecialPage) {
      router.push(`/#${sectionId}`);
    } else {
      
      setActiveSection(sectionId);
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const mobileLinkStyle = "text-white text-xl font-medium flex items-center gap-4 py-2";

  return (
    <header className="bg-transparent text-black my-4 mx-5 relative">
      <div className="fixed w-full flex items-center justify-between px-10 z-10">
        <Image
          className="w-12 h-auto rounded-full md:ml-7"
          src="/logo.png"
          alt="logo"
          width={400}
          height={400}
        />

        <nav className="hidden md:flex items-center ml-10 gap-10 md:mr-7">
          <Link className={navLinkPaths("/login",)} href="/auth/login">
            Login
          </Link>
          <a className={navLinkPaths("home")} href="#home" onClick={(e) => handleNavigate(e, "home")}>
            Home
          </a>
          <a className={navLinkPaths("sobre", )} href="#sobre" onClick={(e) => handleNavigate(e, "sobre")}>
            Sobre nós
          </a>
          <a className={navLinkPaths("pets")} href="#pets" onClick={(e) => handleNavigate(e, "pets")}>
            Pets
          </a>
        </nav>

        <button
          className="md:hidden p-2 text-black relative z-40"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
           <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-secondary z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative flex flex-col items-center justify-center pt-10 pb-8 px-6">
          
          <button 
            onClick={toggleMenu} 
            className="absolute top-6 right-6 text-white p-2"
            aria-label="Fechar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="bg-white rounded-full p-3 w-24 h-24 flex items-center justify-center shadow-lg mb-2">
             <Image
              className="w-20 h-auto rounded-full"
              src="/logo.png"
              alt="logo menu"
              width={200}
              height={200}
            />
          </div>
        </div>

        <nav className="flex flex-col px-8 gap-4 mt-2">
          

          <Link onClick={toggleMenu} className={mobileLinkStyle} href="/auth/login">
            Login
          </Link>

          <a onClick={toggleMenu} className={mobileLinkStyle} href="#home">
            Home
          </a>

          <a onClick={toggleMenu} className={mobileLinkStyle} href="#sobre">
            Sobre nós
          </a>

          <a onClick={toggleMenu} className={mobileLinkStyle} href="#pets">
            Pets
          </a> 
        </nav>
      </div>
    </header>
  );
}