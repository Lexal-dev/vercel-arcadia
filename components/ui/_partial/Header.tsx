"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegUserCircle, FaHome } from "react-icons/fa";
import { LuSend, LuStore, LuHome } from "react-icons/lu";

export default function Header() {
  const navMenu = [
    { name: "Services", icon: LuStore, path: "/services" },
    { name: "Habitats", icon: LuHome, path: "/habitats" },
    { name: "Contact", icon: LuSend, path: "/contact" },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fonction pour détecter la taille de l'écran
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Écoute du changement de taille de l'écran
    window.addEventListener("resize", handleResize);

    // Appel initial pour définir l'état initial
    handleResize();

    // Nettoyage du listener d'événement lors du démontage du composant
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const headerStyle = {
    backgroundImage: `url('/images/Header.png')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: isMobile ? "right center" : "center",
  };

  return (
    <header
      className="absolute flex flex-col items-center h-[450px] w-full border-b-4 border-green-100"
      style={headerStyle}
    >
      <nav className="flex justify-between items-center w-full md:w-3/4 py-4 px-1 text-lg md:text-xl text-white mb-12">
        <Link href="/">
          <FaHome size="32px" className="hover:text-yellow-300" />
        </Link>

        <ul className="w-2/3 flex w-full justify-center gap-6 sm:gap-12 items-center text-sm sm:text-xl md:text-2xl">
          {navMenu.map((item) => (
            <li key={item.name}>
              <Link href={item.path} className="flex items-center gap-2 hover:text-green-700">
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/">
          <FaRegUserCircle size="32px" className="hover:text-yellow-300" />
        </Link>
      </nav>
      <h1 className="font-bold text-white text-4xl text-center">Arcadia</h1>
    </header>
  );
}
