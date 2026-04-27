"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LogIn, Menu, X, Sun } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Viajes", href: "/viajes" },
    { name: "Contacto", href: "/contacto" },
    { name: "Sobre Nosotros", href: "/nosotros" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "bg-background/80 backdrop-blur-xl shadow-lg border-b border-border"
        : "bg-transparent"
        }`}
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
        {/* logo */}
        <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
          <Image
            src="/img/index/header/llama.png"
            alt="Llama Tours"
            width={70}
            height={70}
            className="filter drop-shadow-[0_4px_8px_rgba(226,226,4,0.3)]"
          />
        </Link>

        {/* navbar */}
        <div className="hidden md:flex items-center space-x-8 font-poppins text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/80 hover:text-brand transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* botones */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-brand rounded-full">
            <Sun size={20} />
          </Button>

          <Button variant="default" className="hidden sm:flex font-bold shadow-lg shadow-brand/10">
            <LogIn size={16} className="mr-2" />
            Ingresar
          </Button>

          {/* responsive */}
          <Sheet>
            <SheetTrigger
              render={
                <button className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden text-foreground" })}>
                  <Menu size={24} />
                </button>
              }
            />
            <SheetContent side="top" className="bg-background border-border">
              <SheetHeader>
                <SheetTitle className="text-brand font-poppins font-bold">LlamaTours</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-poppins font-medium text-foreground hover:text-brand"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button className="w-full font-bold">
                  <LogIn size={16} className="mr-2" />
                  Ingresar
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
