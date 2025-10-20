"use client";
import Image from "next/image";
import { ArrowRight, PencilLine } from "lucide-react";
import Link from "next/link";

export interface IBlogCardProps {
  header: string;
  image: string;
  description: string;
  date: string;
  imageAlt?: string;
}

export default function BlogCard({
  header,
  image,
  description,
  date,
  imageAlt,
}: IBlogCardProps) {
  return (
    <div className="py-6 px-4 rounded-[30px] flex flex-col items-start gap-4 bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2]">
      {/* SVG gradient definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <linearGradient
            id="arrow-gradient-blogcard"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "#22E9AD" }} />
            <stop offset="100%" style={{ stopColor: "#9846FE" }} />
          </linearGradient>
        </defs>
      </svg>
      <h3 className="font-semibold text-[1.5rem] leading-[1.5rem] text-[#101828] dark:text-[#EDEDED] px-4">
        {header}
      </h3>
      {image && (
        <Image
          src={image}
          alt={imageAlt || header}
          width={1152}
          height={460}
          className="rounded-[25px] w-full h-auto px-2"
        />
      )}
      <p
        className="font-normal text-base leading-[1.5rem] text-[#101828B2] dark:text-[#A1A1A1] px-4"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="w-full flex items-center justify-between text-[#909090] text-base font-normal px-4">
        <div className="flex items-center gap-2">
          <PencilLine size={16} />
          <span>{date}</span>
        </div>
        <Link
          href="/blog"
          className="bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-medium text-base flex items-center gap-2"
        >
          Read More!
          <ArrowRight
            size={18}
            style={{ fill: "url(#arrow-gradient-blogcard)", stroke: "#9846FE" }}
            className="text-[#9846FE]" // Fallback color
          />
        </Link>
      </div>
    </div>
  );
}

