import BlogCard, { IBlogCardProps } from "@/components/app/blog-card";
import Footer from "@/components/app/footer";
import Navbar from "@/components/app/navbar";

const blogData: IBlogCardProps[] = [
  {
    header: "Is your DAO on sale?",
    image: "/dao-site.png",
    description:
      "Every DAO treasury carries an implicit “for-sale” sign: the cost of acquiring enough votes to pass a proposal. <br /> In May 2025 a single attacker started bidding. The attacker kept it simple: identifying DAOs with a significant treasury value but with low token prices to acquire governance.",
    date: "Jun 12, 2025",
  },
  {
    header:
      "SolBlaze DAO: Fueling Decentralised Staking & Builder-First Tooling on Solana",
    image: "/dao-site2.png",
    description:
      "How a self-funded community is turning liquid staking into a launch-pad for validators, DeFi and open-source infrastructure.",
    date: "Jun 12, 2025",
  },
];

export default function BlogPage() {
  return (
    <div>
      <Navbar />
      <div className="lg:max-w-[1200px] mx-auto space-y-6 md:space-y-8 mt-12 md:mt-24 px-4 md:px-6 lg:px-0">
        <div className="flex flex-col items-start gap-3">
          <p className="bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-medium text-sm md:text-base leading-[100%]">
            DAO blogs
          </p>
          <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-2xl md:text-3xl lg:text-[2.5rem] leading-[100%]">
            Resources and insights on Solana DAOs.
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {blogData.map(({ header, image, description, date }, index) => (
            <BlogCard
              key={index}
              date={date}
              header={header}
              image={image}
              description={description}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 pb-4 md:pb-0 [&>div]:rounded-full [&>div]:w-6 [&>div]:h-6 [&>div]:bg-[#909090] [&>div]:dark:bg-[#909090] [&>div:first-child]:bg-[#010101] [&>div:first-child]:dark:bg-[#EDEDED] [&>div:first-child]:w-11">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
