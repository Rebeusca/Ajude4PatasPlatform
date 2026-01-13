"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function navLinkPaths(path: string, current: string) {
  const base = "transition-colors hover:text-secondary hover:text-lg ";

  const ativo = "text-secondary text-lg";
  const inativo = "text-primary";

  return `${base} ${current === path ? ativo : inativo}`;
}

export function Header() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const mobileLinkStyle = "text-white text-xl font-medium flex items-center gap-4 py-2";

  return (
    <header className="bg-transparent text-black my-4 mx-5 relative">
      <div className="flex items-center justify-between">
        <Image
          className="w-12 h-auto rounded-full md:ml-7"
          src="/logo.png"
          alt="logo"
          width={400}
          height={400}
        />

        <nav className="hidden md:flex items-center ml-10 gap-10 md:mr-7">
          <Link className={navLinkPaths("/login", pathname)} href="/auth/login">
            Login
          </Link>
          <Link className={navLinkPaths("/", pathname)} href="/">
            Home
          </Link>
          <Link className={navLinkPaths("/pets", pathname)} href="/pets">
            Pets
          </Link>
          <Link className={navLinkPaths("/sobre", pathname)} href="/sobre">
            Sobre nós
          </Link>
          <Link className={navLinkPaths("/ajudar", pathname)} href="/ajudar">
            Como ajudar
          </Link>
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

          <Link onClick={toggleMenu} className={mobileLinkStyle} href="/">
            Home
          </Link>

          <Link onClick={toggleMenu} className={mobileLinkStyle} href="/pets">
            Pets
          </Link>

          <Link onClick={toggleMenu} className={mobileLinkStyle} href="/sobre">
            Sobre nós
          </Link>

          <Link onClick={toggleMenu} className={mobileLinkStyle} href="/ajudar">
            Como ajudar
          </Link>
        </nav>
      </div>
    </header>
  );
}