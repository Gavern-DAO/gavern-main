import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Role } from "./dao-structure-n-roles";
import { FaXTwitter } from "react-icons/fa6";
import { RiDiscordLine } from "react-icons/ri";

interface RoleCardProps {
  role: Role;
}

export default function RoleCard({ role }: RoleCardProps) {
  const { title, description, holder, isVacant, telegram, discord, x } = role;

  return (
    <div className="flex flex-col gap-4 md:gap-6 p-3 border border-[#F0F0F0] dark:border-[#282828B2] rounded-[5px]">
      {/* Header with icon and title */}
      <div className="flex flex-col gap-2 md:gap-2.5">
        <div className="flex items-center gap-2">
          <div className="mt-0.5 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full border-2 border-[#22E9AD] flex-shrink-0">
            <Check className="h-2.5 w-2.5 md:h-3 md:w-3 text-[#22E9AD]" />
          </div>
          <h3 className="bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-[11px] md:text-[12px] font-medium leading-tight text-transparent">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm leading-[16px] md:leading-[18px] text-[#101828] dark:text-[#EDEDED]">
          {description}
        </p>
      </div>

      {/* Footer - either holder info or vacant button */}
      {isVacant ? (
        <Button className="mt-auto w-full bg-[#010101] dark:bg-[#EDEDED] dark:text-[#101828] text-white hover:bg-[#010101]/90 font-semibold text-[11px] md:text-[12px] cursor-pointer py-2 md:py-2.5">
          Vacant - Apply Now!
        </Button>
      ) : (
        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <span className="text-[11px] md:text-[12px] text-[#909090] truncate w-full sm:w-auto">
            {holder ? `Holder: ${holder}` : ""}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {x && (
              <a
                href={x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#909090] transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <FaXTwitter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
            )}
            {discord && (
              <a
                href={discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#909090] transition-colors hover:text-foreground"
                aria-label="Discord"
              >
                <RiDiscordLine className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
            )}
            {telegram && (
              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#909090] transition-colors hover:text-foreground"
                aria-label="Telegram"
              >
                <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
