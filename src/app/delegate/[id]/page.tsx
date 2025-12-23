// import ProfileTabs from "@/components/ProfileTabs";
// import { Navbar } from "../components/Navbar";
// import { ProfileHeader } from "../components/ProfileHeader";
// import { Footer } from "../components/Footer";
import Navbar from "@/components/app/navbar";
import ProfileTabs from "@/components/app/profile-tabs";
import { ProfileHeader } from "@/components/app/profile-header";
import Footer from "@/components/app/footer";

export default async function Home({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#080808] flex flex-col">
            <Navbar />
            <main className="flex-1 w-full">
                <ProfileHeader pubkey={id} />
                <ProfileTabs pubkey={id} />
            </main>
            <Footer />
        </div>
    );
}
