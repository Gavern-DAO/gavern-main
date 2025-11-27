"use client";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaXTwitter } from "react-icons/fa6";
import { VscGithubAlt } from "react-icons/vsc";
import { AiOutlineDiscord } from "react-icons/ai";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();
  const isLightTheme = theme === "light" || theme === undefined;

  return (
    <div className="w-full bg-white dark:bg-[#010101] pt-12 md:pt-24 pb-10.5 mt-12 md:mt-24 dark:border-[#282828B2] dark:border-[0.5px]">
      <div className="lg:max-w-[1200px] mx-auto rounded-[10px] divide-y px-4 md:px-6 lg:px-0">
        <div className="flex md:flex-row flex-col items-start md:items-center justify-between gap-4 md:gap-2 mb-8 md:mb-10.5 pb-12 md:pb-24">
          <div className="flex flex-col gap-2 md:gap-3 w-full md:w-auto">
            <h2 className="text-[#101828] dark:text-[#EDEDED] text-xl md:text-[1.5rem] leading-[1.5rem] font-medium">
              Email Notifications
            </h2>
            <p className="font-normal text-sm md:text-base leading-[1.5rem] text-[#101828B2] text-[#A1A1A1]">
              Set up DAO notifications to receive alerts of new and upcoming{" "}
              <br className="hidden md:block" /> proposals of your personalized DAO(s).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 w-full md:w-auto">
            <Input
              className="w-full sm:w-auto sm:min-w-[200px] md:w-[27.4rem] min-h-[3.25rem] bg-transparent dark:border-[#282828B2]"
              placeholder="Enter your email address for Gavern updates"
            />{" "}
            <Button className="min-h-[3.25rem] w-full sm:w-[9.4rem] cursor-pointer">
              Confirm
            </Button>
          </div>
        </div>
        <div className="pt-4 md:pt-0">
          <div>
            <Image
              // src={"/logo.png"}
              src={
                isLightTheme
                  ? "/logo-footer-light.png"
                  : "/logo-footer-dark.png"
              }
              alt="Logo"
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between mt-5.5 mb-8 md:mb-11.5 gap-4 md:gap-0">
            <div className="grid grid-cols-2 w-full md:w-auto md:flex gap-3 md:gap-4 [&>a]:text-sm md:[&>a]:text-base [&>a]:font-regular [&>a]:leading-[24px] [&>a]:text-[#A1A1A1] [&>a]:dark:text-[#A1A1A1] [&>a]:cursor-pointer">
              <a>Blog on DAOs</a>
              <a>About</a>
              <a>Privacy Policy</a>
              <a>BrandKit</a>
            </div>
            <div className="flex gap-4.5 mt-4 md:mt-0">
              <Link href="https://x.com/gavernapp" target="_blank">
                <FaXTwitter className="text-[#909090] dark:text-[#A1A1A1]" />
              </Link>
              {/* <Link href={"https://github.com/gavern-dao"} target="_blank"><VscGithubAlt className="text-[#909090] dark:text-[#A1A1A1]" /></Link> */}
              <Link href={""} target="_blank">
                <VscGithubAlt className="text-[#909090] dark:text-[#A1A1A1]" />
              </Link>
              <Link href={"https://discord.gg/3Zv2YwbZ"} target="_blank">
                <AiOutlineDiscord className="text-[#909090] dark:text-[#A1A1A1]" />
              </Link>
            </div>
          </div>
          <div className="text-center pb-4 md:pb-0">
            {" "}
            <span className="text-center text-sm md:text-base text-[#A1A1A1] leading-[24px]">
              Copyright {new Date().getFullYear()}
            </span>{" "}
            <span className="text-sm md:text-base text-[#A1A1A1] ">&copy;</span>{" "}
            <span className="text-center  text-sm md:text-base font-[500] text-[#A1A1A1] leading-[24px]">
              Gavern
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
