export interface DefaultRole {
    id: number;
    title: string;
    description: string;
    isCustom?: boolean;
}

export const rolesData: DefaultRole[] = [
    {
        id: 1,
        title: "Treasury Manager",
        description:
            "Manages the DAO's on-chain assets, oversees fund allocations, multisig participation.",
    },
    {
        id: 2,
        title: "Community Moderator",
        description: "Manages events, onboarding, and announcements.",
    },
    {
        id: 3,
        title: "Growth/Marketing Lead",
        description:
            "Tracks metrics, creates outreach strategies, manages partnerships.",
    },
    {
        id: 4,
        title: "Chief Technology Officer",
        description: "builds smart contracts, handles bug fixes or updates.",
    },
    {
        id: 5,
        title: "Grants Coordinator",
        description:
            "Oversees the grants program, manages application processes, disbursements, and reporting.",
    },
    {
        id: 6,
        title: "Design Lead",
        description: "Owns brand identity, visuals, and product design work.",
    },
    {
        id: 7,
        title: "Legal/Compliance Lead",
        description:
            "Reviews contracts or ensures DAO meets off-chain obligations.",
    },
    {
        id: 8,
        title: "DAO Secretary / Notetaker",
        description: "Documents decisions, maintains DAO knowledge base.",
    },
    {
        id: 9,
        title: "Content Creator",
        description: "Writes blogs, tweets, newsletter content",
    },
];
