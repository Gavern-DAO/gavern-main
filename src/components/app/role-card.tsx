import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Role } from "./dao-structure-n-roles";
import { FaXTwitter } from "react-icons/fa6";
import { RiDiscordLine } from "react-icons/ri";
import { FormattedContent } from "./formatted-content";

interface RoleCardProps {
  role: Role;
}

export default function RoleCard({ role }: RoleCardProps) {
  const { title, description, holder, isVacant, telegram, discord, x } = role;

  return (
    <div className="flex flex-col gap-4 md:gap-6 p-3 border border-[#F0F0F0] dark:border-[#282828B2] rounded-[5px]">
      {/* Header with icon and title */}
      <div className="flex flex-col gap-2 md:gap-2.5">
        <div className="flex items-center gap-[5px] relative">
          <div className="relative flex-shrink-0">
            <svg
              className=""
              width="13"
              height="15"
              viewBox="0 0 13 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.7686 5.26837C9.8531 5.18387 9.90057 5.06927 9.90057 4.94977C9.90057 4.83027 9.8531 4.71567 9.7686 4.63117C9.6841 4.54667 9.5695 4.4992 9.45 4.4992C9.3305 4.4992 9.2159 4.54667 9.1314 4.63117L5.85 7.91347L4.3686 6.43117C4.32676 6.38933 4.27709 6.35614 4.22243 6.3335C4.16776 6.31085 4.10917 6.2992 4.05 6.2992C3.99083 6.2992 3.93224 6.31085 3.87757 6.3335C3.82291 6.35614 3.77324 6.38933 3.7314 6.43117C3.68956 6.47301 3.65637 6.52268 3.63373 6.57734C3.61109 6.63201 3.59943 6.6906 3.59943 6.74977C3.59943 6.80894 3.61109 6.86753 3.63373 6.92219C3.65637 6.97686 3.68956 7.02653 3.7314 7.06837L5.5314 8.86837C5.5732 8.91028 5.62286 8.94352 5.67753 8.96621C5.7322 8.9889 5.79081 9.00057 5.85 9.00057C5.90919 9.00057 5.9678 8.9889 6.02247 8.96621C6.07714 8.94352 6.1268 8.91028 6.1686 8.86837L9.7686 5.26837ZM6.5493 0.0753675C6.47545 0.0262209 6.38871 0 6.3 0C6.21129 0 6.12455 0.0262209 6.0507 0.0753675C4.35162 1.22079 2.41481 1.96579 0.3861 2.25427C0.27891 2.26964 0.18086 2.32316 0.10994 2.40499C0.0390195 2.48682 -1.44351e-05 2.59148 4.00445e-09 2.69977V6.74977C4.00445e-09 10.2517 2.0763 12.8068 6.138 14.3701C6.24225 14.4103 6.35775 14.4103 6.462 14.3701C10.5237 12.8068 12.6 10.2508 12.6 6.74977V2.69977C12.6 2.59135 12.5608 2.48658 12.4897 2.40473C12.4186 2.32287 12.3204 2.26945 12.213 2.25427C10.1846 1.96566 8.24811 1.22067 6.5493 0.0753675ZM0.9 3.08497C2.68275 2.78235 4.39255 2.14667 5.94 1.21117L6.3 0.987067L6.66 1.21117C8.20745 2.14667 9.91725 2.78235 11.7 3.08497V6.74977C11.7 9.80257 9.9288 12.0265 6.3 13.4665C2.6712 12.0265 0.9 9.80347 0.9 6.74977V3.08497Z"
                fill="url(#paint0_linear_2988_11735)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2988_11735"
                  x1="12.6"
                  y1="7.20012"
                  x2="0"
                  y2="7.20012"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#22E9AD" />
                  <stop offset="1" stopColor="#9846FE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h3 className="text-[12px] font-semibold bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent">
            {title}
          </h3>
        </div>

        {/* Description */}
        <FormattedContent
          content={description}
          className="font-['Geist'] font-medium text-[14px] leading-[140%] tracking-[0] text-[#101828] dark:text-white [&_p]:!font-medium"
        />
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
