import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface DaoHeaderProps {
  daoName: string;
  daoHealth: string;
  imageUrl?: string;
  bannerImage?: string;
  proposalCount?: number;
  voteCount?: number;
  memberCount?: number;
}

export default function DaoHeader({
  daoName,
  daoHealth,
  imageUrl = "/dao-1.png",
  bannerImage: initialBannerImage = "/dao-1.png",
  proposalCount = 0,
  voteCount = 0,
  memberCount = 0,
}: DaoHeaderProps) {
  const [currentBannerImage, setCurrentBannerImage] = useState(initialBannerImage);

  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);

  return (
    <>
      <section className="w-full min-h-[336px] bg-white dark:bg-[#010101] mt-4 rounded-[5px] relative overflow-hidden dark:border dark:border-[#282828B2]">
        <div className="w-full  relative h-[206px] overflow-hidden">
          <div className="flex items-center gap-2 absolute top-0 left-0 z-5 p-5">
            <span className="text-[#101828B2] dark:text-[#A1A1A1] text-[14px] font-medium leading-[17px]">
              DAO Health:
            </span>
            <span className="flex items-center justify-center gap-1.5 text-[#101828] dark:text-[#EDEDED] font-normal text-[14px]">
              <div
                className={cn(
                  "aspect-square w-2 h-auto rounded-full",
                  daoHealth === "Alive" ? "bg-[#00AA09]" : "bg-[#D70000]"
                )}
              />{" "}
              {daoHealth}
            </span>
          </div>
          <div
            className="h-[164px] w-full overflow-hidden bg-[#FFFFFF80] dark:bg-[#01010180]"
            style={{
              backdropFilter: "blur(50px)",
            }}
          >
            <Image
              width={1081}
              height={1081}
              src={currentBannerImage}
              alt=""
              className="w-full h-auto blur-lg"
              onError={() => setCurrentBannerImage("/dao-1.png")}
            />
          </div>
          <div className="absolute bottom-0 left-1/2 w-[90px] aspect-square rounded-[5px] p-[5px] bg-white dark:bg-[#010101] shadow-lg flex items-center justify-center -translate-x-1/2">
            <Image
              src={currentImageUrl}
              alt="DaO 1"
              width={80}
              height={80}
              className="w-full h-full"
              onError={() => setCurrentImageUrl("/dao-1.png")}
            />
          </div>
        </div>

        <div className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-[1.25rem] leading-[24px]">
              {daoName}
            </h2>
            <p className="text-[#101828B2] dark:text-[#A1A1A1] font-normal text-[0.875rem] leading-[19px]">
              The official gavern hub for the {daoName}, providing an
              overview of its governance activity.
            </p>
          </div>
          <div className="flex items-center justify-start gap-2 divide-x [&>div]:px-2 [&>div]:first:pl-0 [&>div]:text-[#101828B2] [&>div]:dark:text-[#A1A1A1] [&>div]:font-normal [&>div]:text-sm [&>div]:leading-[17px] [&>div>span]:font-medium [&>div>span]:text-[#101828] [&>div>span]:dark:text-[#EDEDED]">
            <div>
              <span>{proposalCount}</span> proposals
            </div>
            <div>
              <span>{voteCount}</span> votes
            </div>
            <div>
              <span>{memberCount}</span> Members
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
