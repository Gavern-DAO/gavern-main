"use client";

import Image from "next/image";
import React from "react";
import { Input } from "../ui/input";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { Button } from "../ui/button";
import { CiSearch } from "react-icons/ci";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light" || theme === undefined;

  return (
    <div className="w-full sticky top-0 z-50 dark:border-b dark:border-b-[#282828B2]">
      <div className="flex bg-white dark:bg-[#010101]">
        <nav className="flex my-6 lg:max-w-300 mx-auto items-center justify-between w-full">
          <Image
            src={isLightTheme ? "/nav/logo-light.png" : "/nav/logo-dark.png"}
            alt="Logo"
            width={134.25}
            height={32}
          />
          <div className="ml-auto flex items-center gap-4">
            <Label className="flex items-center">
              <CiSearch color="#909090" />
              <Input
                className="px-3 bg-transparent border-none outline-none shadow-none focus:outline-none focus:ring-0 px-0 dark:px-3 focus-visible:outline-0 focus-visible:ring-0 min-w-[353px] placeholder:text-[#909090] text-base leading-[24px] font-normal"
                placeholder="Search for a DAO"
              />
            </Label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className="focus:outline-none p-1"
                aria-label="Switch to light mode"
              >
                <MdOutlineLightMode
                  className={`w-4 h-4 cursor-pointer ${
                    isLightTheme ? "text-foreground" : "text-muted-foreground"
                  }`}
                />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className="focus:outline-none p-1"
                aria-label="Switch to dark mode"
              >
                <MdOutlineDarkMode
                  className={`w-4 h-4 cursor-pointer ${
                    isLightTheme ? "text-muted-foreground" : "text-foreground"
                  }`}
                />
              </button>
            </div>
            <Button>Connect Wallet</Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
