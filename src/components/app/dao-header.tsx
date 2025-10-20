import Image from "next/image";
interface DaoHeaderProps {}

export default function DaoHeader(props: DaoHeaderProps) {
  return (
    <>
      <section className="w-full min-h-[336px] bg-white dark:bg-[#010101] mt-4 rounded-[5px] relative overflow-hidden dark:border dark:border-[#282828B2]">
        <div className="w-full  relative h-[206px] overflow-hidden">
          <div className="flex items-center gap-2 absolute top-0 left-0 z-5 p-5">
            <span className="text-[#101828B2] dark:text-[#A1A1A1] text-[14px] font-medium leading-[17px]">
              DAO Health:
            </span>
            <span className="flex items-center justify-center gap-1.5 text-[#101828] dark:text-[#EDEDED] font-normal text-[14px]">
              <div className="aspect-square w-2 h-auto rounded-full bg-[#00AA09]" />{" "}
              Alive
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
              src={"/dao-1.png"}
              alt=""
              className="w-full h-auto blur-lg"
            />
          </div>
          <div className="absolute bottom-0 left-1/2 w-[90px] aspect-square rounded-[5px] p-[5px] bg-white dark:bg-[#010101] shadow-lg flex items-center justify-center -translate-x-1/2">
            <Image
              src={"/dao-1.png"}
              alt="DaO 1"
              width={80}
              height={80}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-[1.25rem] leading-[24px]">
              Realms Ecosystem DAO
            </h2>
            <p className="text-[#101828B2] dark:text-[#A1A1A1] font-normal text-[0.875rem] leading-[19px]">
              The official gavern hub for the Realms Ecosystem DAO, providing an
              overview of its governance activity.
            </p>
          </div>
          <div className="flex items-center justify-start gap-2 divide-x [&>div]:pr-2 [&>div]:text-[#101828B2] [&>div]:dark:text-[#A1A1A1] [&>div]:font-normal [&>div]:text-sm [&>div]:leading-[17px] [&>div>span]:font-medium [&>div>span]:text-[#101828] [&>div>span]:dark:text-[#EDEDED]">
            <div>
              <span>43</span> proposals
            </div>
            <div>
              <span>5.6m</span> votes
            </div>
            <div>
              <span>36</span> Members
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
