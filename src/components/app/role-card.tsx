import { Check, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Role } from "./dao-structure-n-roles";
import { FaXTwitter } from "react-icons/fa6";
import { RiDiscordLine } from "react-icons/ri";

interface RoleCardProps {
  role: Role;
}

export default function RoleCard({ role }: RoleCardProps) {
  const { title, description, holder, isVacant, colorClass } = role;

  return (
    <div className="flex flex-col gap-6 p-3 border border-[#F0F0F0] dark:border-[#282828B2] rounded-[5px]">
      {/* Header with icon and title */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#22E9AD]">
            <Check className="h-3 w-3 text-[#22E9AD]" />
          </div>
          <h3 className="bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-[12px] font-medium leading-tight text-transparent ">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm leading-[18px] text-[#101828] dark:text-[#EDEDED]">
          {description}
        </p>
      </div>

      {/* Footer - either holder info or vacant button */}
      {isVacant ? (
        <Button className="mt-auto w-full bg-[#010101] dark:bg-[#EDEDED] dark:text-[#101828] text-white hover:bg-[#010101]/90 font-semibold text-[12px] cursor-pointer">
          Vacant - Apply Now!
        </Button>
      ) : (
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[12px] text-[#909090]">Holder: {holder}</span>
          <div className="flex items-center gap-2">
            <button
              className="text-[#909090] transition-colors hover:text-foreground"
              aria-label="Twitter"
            >
              <FaXTwitter className="h-4 w-4" />
            </button>
            <button
              className="text-[#909090] transition-colors hover:text-foreground"
              aria-label="Discord"
            >
              <RiDiscordLine className="h-4 w-4" />
            </button>
            <button
              className="text-[#909090] transition-colors hover:text-foreground"
              aria-label="Telegram"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
