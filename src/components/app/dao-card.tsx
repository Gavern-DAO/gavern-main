import { IAllDao } from "./all-daos-table";
import DaoImage from "./dao-image";

const DaoCard: React.FC<{ dao: IAllDao; onClick: () => void }> = ({ dao, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#282828] p-4 cursor-pointer transition-all hover:shadow-md rounded-[10px] flex flex-col gap-4.5"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <DaoImage src={dao.image} alt={dao.daoName} />
                    <div className="space-y-1">
                        <h3 className="text-[#101828] dark:text-[#EDEDED] font-medium text-sm">
                            {dao.daoName}
                        </h3>
                        {!dao.isActive && (
                            <div className="flex items-center gap-2">
                                <span className="inline-block py-1 px-2 border rounded-full border-[#75FA7C] bg-[#00D70B1F] text-[#00BF0A] text-[8px] font-medium">
                                    Active Proposal
                                </span>
                                <span className="text-xs text-[#909090] dark:text-[#A1A1A1]">31 days left!</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-1 text-xs">
                    <p className="text-[#4C4C4C] dark:text-[#A1A1A1] ">Proposal:</p>
                    <p className="font-medium text-[#101828] dark:text-white">
                        {dao.proposals.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center gap-4 text-sm">

                <div className="flex gap-1">
                    <p className="text-[#909090] dark:text-[#A1A1A1]">Treasury Balance</p>
                    <p className="font-medium text-[#101828] dark:text-white">
                        {dao.treasuryBalance}
                    </p>
                </div>

                <div className="flex text-sm gap-1.5">
                    <p className="text-[#909090] dark:text-[#A1A1A1]">Dao Health:</p>
                    <p className="flex items-center gap-1.5">
                        <div
                            className={`w-2 h-2 rounded-full ${dao.daoHealth === "Alive" ? "bg-[#00AA09]" : "bg-[#D70000]"
                                }`}
                        />
                        <span className="text-sm text-[#101828] dark:text-[#EDEDED]">
                            {dao.daoHealth}
                        </span>
                    </p>
                </div>

            </div>

            {/* {dao.timeLeft && (
                <p className="mt-3 text-[#909090] text-xs">{dao.timeLeft}</p>
            )} */}
        </div>
    );
};
export default DaoCard