"use client";

import React, { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useCreateProofOfWork, useUpdateProofOfWork, useAllDaos } from "@/hooks/use-delegate";
import { ProofOfWork } from "@/types/delegate";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { FaDiscord, FaTelegramPlane, FaChevronDown, FaCheck, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";

const AVAILABLE_SKILLS = [
    "Blockchain Developer",
    "Product Manager",
    "Frontend Developer",
    "Backend Developer",
    "Community Manager",
    "Content Creator",
    "Designer",
    "Growth/Marketing",
    "Partnerships / Business Development Manager",
    "Legal/Compliance Lead",
    "Undefined"
];

const SKILL_COLORS: Record<string, string> = {
    "Blockchain Developer": "bg-[#1F235B] text-white border border-[#343EC1]",
    "Product Manager": "bg-[#102A56] text-white border border-[#1D5CC6]",
    "Frontend Developer": "bg-[#06504F] text-white border border-[#31FFFC48]",
    "Backend Developer": "bg-[#3E3325] text-white border border-[#CE852948]",
    "Community Manager": "bg-[#510350] text-white border border-[#FA45F848]",
    "Content Creator": "bg-[#BF4E02] text-white border border-[#FFDCC548]",
    "Designer": "bg-[#10563F] text-white border border-[#08B67C]",
    "Growth/Marketing": "bg-[#511003] text-white border border-[#ED5A3C48]",
    "Partnerships / Business Development Manager": "bg-[#435103] text-white border border-[#D4FF0F48]",
    "Legal/Compliance Lead": "bg-[#06504F] text-white border border-[#31FFFC48]",
    "Undefined": "bg-[#BF0238] text-white border border-[#FFECF148]",
};

interface ProofOfWorkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: ProofOfWork;
}

export default function ProofOfWorkModal({ open, onOpenChange, initialData }: ProofOfWorkModalProps) {
    const { mutate: createProofOfWork, isPending: isCreating } = useCreateProofOfWork();
    const { mutate: updateProofOfWork, isPending: isUpdating } = useUpdateProofOfWork();
    const isPending = isCreating || isUpdating;

    const { data: daos, isLoading: isLoadingDaos } = useAllDaos();

    const [formData, setFormData] = useState({
        workTitle: "",
        selectedDaoPubkey: "",
        skillsRequired: [] as string[],
        workLink: "",
        discord: "",
        telegram: "",
        x: "",
    });

    // Initialize form with initialData when open changes
    React.useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    workTitle: initialData.workTitle,
                    selectedDaoPubkey: initialData.daoPubkey,
                    skillsRequired: initialData.skillsRequired,
                    workLink: initialData.workLink,
                    discord: initialData.discord || "",
                    telegram: initialData.telegram || "",
                    x: initialData.x || "",
                });
                // If the DAO is not in the list, we might want to set custom DAO
                // But for now let's assume if we have a pubkey it might be in the list or we treat it as custom if not found?
                // Actually, let's check if the DAO exists in the loaded list.
                // Since daos might be loading, this is tricky. 
                // For simplicity, we populate the fields. Users can switch to custom if needed.
                // A better approach: if we have initialData, we might strictly stick to what we have.
                // Let's set customDao state just in case, but selectedDaoPubkey is primary.
            } else {
                // Reset form
                setFormData({
                    workTitle: "",
                    selectedDaoPubkey: "",
                    skillsRequired: [],
                    workLink: "",
                    discord: "",
                    telegram: "",
                    x: "",
                });
                setIsCustomDao(false);
                setCustomDao({ name: "", pubkey: "" });
            }
            setSubmitError(null);
        }
    }, [open, initialData]);

    const [isSkillsOpen, setIsSkillsOpen] = useState(false);
    const [skillInputValue, setSkillInputValue] = useState("");
    const skillInputRef = React.useRef<HTMLInputElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [isCustomDao, setIsCustomDao] = useState(false);
    const [customDao, setCustomDao] = useState({
        name: "",
        pubkey: "",
    });
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Filter DAOs based on search query and limit to 10 results
    const filteredDaos = useMemo(() => {
        if (!daos) return [];

        const filtered = daos.filter((dao) =>
            dao.name?.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

        return filtered;
    }, [daos, searchQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDaoSelect = (pubkey: string) => {
        setFormData((prev) => ({ ...prev, selectedDaoPubkey: pubkey }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        // Validation
        const workTitleWords = formData.workTitle.trim().split(/\s+/);
        if (workTitleWords.length > 15) {
            setSubmitError("Work title must not exceed 15 words");
            return;
        }

        if (formData.skillsRequired.length === 0) {
            setSubmitError("Please select at least one skill");
            return;
        }

        if (!formData.x && !formData.discord && !formData.telegram) {
            setSubmitError("Please provide at least one social media link");
            return;
        }

        let daoName: string;
        let daoPubkey: string;

        if (isCustomDao) {
            // Use custom DAO input
            if (!customDao.name || !customDao.pubkey) {
                setSubmitError("Please enter both DAO name and public key");
                return;
            }

            // Validate Public Key format
            try {
                new PublicKey(customDao.pubkey);
            } catch {
                setSubmitError("Please enter a valid Solana public key");
                return;
            }

            daoName = customDao.name;
            daoPubkey = customDao.pubkey;
        } else {
            // Use selected DAO from list
            const selectedDao = daos?.find(dao => dao.pubkey === formData.selectedDaoPubkey);

            if (!selectedDao) {
                setSubmitError("Please select a DAO");
                return;
            }
            daoName = selectedDao.name;
            daoPubkey = selectedDao.pubkey;
        }

        const payload = {
            workTitle: formData.workTitle,
            daoName: daoName,
            daoPubkey: daoPubkey,
            skillsRequired: formData.skillsRequired,
            workLink: formData.workLink,
            discord: formData.discord,
            telegram: formData.telegram,
            x: formData.x,
        };

        const onSuccess = () => {
            onOpenChange(false);
            setFormData({
                workTitle: "",
                selectedDaoPubkey: "",
                skillsRequired: [],
                workLink: "",
                discord: "",
                telegram: "",
                x: "",
            });
            setSearchQuery("");
            setSkillInputValue("");
            setCustomDao({ name: "", pubkey: "" });
            setIsCustomDao(false);
            setSubmitError(null);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onError = (error: any) => {
            console.error(initialData ? "Failed to update proof of work:" : "Failed to create proof of work:", error);

            // Handle backend error message format
            // Expected format: { message: ["error1", "error2"], ... } or { message: "error" }
            const message = error?.response?.data?.message || error?.message || (initialData ? "Failed to update proof of work" : "Failed to create proof of work");

            if (Array.isArray(message)) {
                setSubmitError(message.join(", "));
            } else {
                setSubmitError(String(message));
            }
        };

        if (initialData) {
            updateProofOfWork({ id: initialData.id, data: payload }, { onSuccess, onError });
        } else {
            createProofOfWork(payload, { onSuccess, onError });
        }
    };


    const toggleSkill = (skill: string) => {
        setFormData(prev => {
            const current = prev.skillsRequired;
            if (current.includes(skill)) {
                return { ...prev, skillsRequired: current.filter(s => s !== skill) };
            }
            if (current.length >= 3) return prev;
            setSkillInputValue(""); // Clear input when selecting
            return { ...prev, skillsRequired: [...current, skill] };
        });
    };

    const removeSkill = (e: React.MouseEvent, skill: string) => {
        e.stopPropagation();
        setFormData(prev => ({
            ...prev,
            skillsRequired: prev.skillsRequired.filter(s => s !== skill)
        }));
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = skillInputValue.trim();
            if (val && !formData.skillsRequired.includes(val)) {
                if (formData.skillsRequired.length >= 3) {
                    setSubmitError("You can select a maximum of 3 skills");
                    return;
                }
                setSubmitError(null);
                setFormData(prev => ({
                    ...prev,
                    skillsRequired: [...prev.skillsRequired, val]
                }));
                setSkillInputValue("");
            }
        } else if (e.key === 'Backspace' && !skillInputValue && formData.skillsRequired.length > 0) {
            // Remove last tag on backspace if input is empty
            setFormData(prev => ({
                ...prev,
                skillsRequired: prev.skillsRequired.slice(0, -1)
            }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white dark:bg-[#010101] dark:text-white w-full sm:max-w-[690px] overflow-y-auto max-h-[90vh] p-4 md:p-6 rounded-[4px] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-[#D0D5DD] dark:[&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                <DialogHeader className="mb-6">
                    <DialogTitle className="font-(family-name:--font-geist-sans) font-medium text-[24px] leading-[32px] text-[#101828] dark:text-white">
                        {initialData ? "Edit Proof of Work" : "Proof of work"}
                    </DialogTitle>
                    <p className="font-(family-name:--font-geist-sans) text-[14px] leading-[20px] text-[#667085] dark:text-[#98A2B3] mt-2">
                        {initialData
                            ? "Update the details of your proof of work."
                            : "Please provide details of your proof of work for the DAO you have worked or currently work for."}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Work Title */}
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                            Work title * <span className="text-[#667085] font-normal text-[12px]">(max: 15 words)</span>
                        </label>
                        <input
                            name="workTitle"
                            value={formData.workTitle}
                            onChange={handleChange}
                            placeholder=""
                            className="border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* DAO Selector */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                                DAO name *
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsCustomDao(!isCustomDao)}
                                className="text-[12px] font-medium text-[#000000] dark:text-white hover:opacity-70 transition-opacity underline"
                            >
                                {isCustomDao ? "Select from list" : "Enter custom DAO"}
                            </button>
                        </div>

                        {isCustomDao ? (
                            // Custom DAO Input
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">

                                    <input
                                        type="text"
                                        value={customDao.name}
                                        onChange={(e) => setCustomDao(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. My Custom DAO"
                                        className="border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                                        required={isCustomDao}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-(family-name:--font-geist-sans) font-medium text-[12px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                                        DAO Public Key
                                    </label>
                                    <input
                                        type="text"
                                        value={customDao.pubkey}
                                        onChange={(e) => setCustomDao(prev => ({ ...prev, pubkey: e.target.value }))}
                                        placeholder="e.g. Awes4Tr6TX8JDzXdC9QuHnJF7x7nk5vqS2W2T2R2S2W"
                                        className="border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                                        required={isCustomDao}
                                    />
                                </div>
                            </div>
                        ) : (
                            // DAO Selector from List
                            <>
                                {/* Search Input */}
                                <Input
                                    type="text"
                                    placeholder="Search DAOs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="mb-2"
                                />

                                {/* DAO Select */}
                                <Select
                                    value={formData.selectedDaoPubkey}
                                    onValueChange={handleDaoSelect}
                                    disabled={isLoadingDaos}
                                >
                                    <SelectTrigger className="w-full border border-[#D0D5DD] rounded-[4px] px-[14px] py-[10px] text-[16px]">
                                        <SelectValue placeholder={isLoadingDaos ? "Loading DAOs..." : "Select a DAO"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredDaos.length === 0 ? (
                                            <div className="px-2 py-1.5 text-sm text-[#667085]">
                                                {searchQuery ? "No DAOs found" : "No DAOs available"}
                                            </div>
                                        ) : (
                                            <>
                                                {filteredDaos.slice(0, 50).map((dao) => (
                                                    <SelectItem key={dao.pubkey} value={dao.pubkey}>
                                                        <div className="flex items-center justify-between w-full gap-2 min-w-0">
                                                            <span className="truncate">{dao.name}</span>
                                                            <span className="text-xs text-[#667085] italic shrink-0">
                                                                {dao.pubkey.slice(0, 4)}...{dao.pubkey.slice(-4)}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                {filteredDaos.length > 50 && (
                                                    <div className="px-2 py-2 text-[12px] text-center text-[#667085] border-t dark:border-[#333333] mt-1 bg-gray-50 dark:bg-[#1A1A1A]">
                                                        Showing top 50 of {filteredDaos.length} results.
                                                        <br />Type to search more...
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>

                                {/* Helper text for custom DAO */}
                                {(searchQuery && filteredDaos.length === 0) && (
                                    <p className="text-[12px] text-[#667085] dark:text-[#888888] mt-1">
                                        DAO not found in the list? Click &quot;Enter custom DAO&quot; above to add it manually.
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                            Skill(s) required * <span className="text-[#667085] font-normal text-[12px]">(max: 3)</span>
                        </label>

                        <div
                            className="border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] px-[14px] py-[10px] min-h-[44px] flex flex-wrap gap-2 items-center cursor-text bg-white dark:bg-[#2A2A2A] focus-within:ring-1 focus-within:ring-[#22E9AD]"
                            onClick={() => skillInputRef.current?.focus()}
                        >
                            {formData.skillsRequired.map(skill => (
                                <span
                                    key={skill}
                                    className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium",
                                        SKILL_COLORS[skill] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                                    )}
                                >
                                    {skill}
                                    <FaTimes
                                        className="text-current opacity-70 hover:opacity-100 cursor-pointer"
                                        onClick={(e) => removeSkill(e, skill)}
                                    />
                                </span>
                            ))}

                            <input
                                ref={skillInputRef}
                                value={skillInputValue}
                                onChange={(e) => setSkillInputValue(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                onFocus={() => setIsSkillsOpen(true)}
                                placeholder={formData.skillsRequired.length === 0 ? "Select or type skills..." : ""}
                                className="flex-1 min-w-[120px] outline-none bg-transparent text-[16px] text-[#101828] dark:text-white placeholder:text-[#667085] dark:placeholder:text-[#888888] border-none p-0 focus:ring-0"
                            />

                            <div className="ml-auto pointer-events-none">
                                <FaChevronDown className="text-[#667085] text-[12px]" />
                            </div>
                        </div>

                        {isSkillsOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1A1A1A] border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                {AVAILABLE_SKILLS
                                    .filter(skill => skill.toLowerCase().includes(skillInputValue.toLowerCase()))
                                    .map(skill => {
                                        const isSelected = formData.skillsRequired.includes(skill);
                                        const isDisabled = !isSelected && formData.skillsRequired.length >= 3;

                                        return (
                                            <div
                                                key={skill}
                                                className={cn(
                                                    "px-3 py-2 text-[14px] flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2A2A2A]",
                                                    isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                                )}
                                                onMouseDown={(e) => {
                                                    // Prevent input blur
                                                    e.preventDefault();
                                                }}
                                                onClick={() => !isDisabled && toggleSkill(skill)}
                                            >
                                                <span className={cn(
                                                    "font-medium",
                                                    isSelected ? "text-[#101828] dark:text-white" : "text-[#667085] dark:text-[#98A2B3]"
                                                )}>
                                                    {skill}
                                                </span>
                                                {isSelected && <FaCheck className="text-[#22E9AD] text-[12px]" />}
                                            </div>
                                        );
                                    })}
                                {AVAILABLE_SKILLS.filter(skill => skill.toLowerCase().includes(skillInputValue.toLowerCase())).length === 0 && (
                                    <div className="px-3 py-2 text-[14px] text-[#667085] dark:text-[#888888]">
                                        Type and press Enter to add &quot;{skillInputValue}&quot;
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Overlay to close dropdown when clicking outside */}
                        {isSkillsOpen && (
                            <div className="fixed inset-0 z-40" onClick={() => setIsSkillsOpen(false)} />
                        )}
                    </div>

                    {/* Work Link */}
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                            Work link *
                        </label>
                        <input
                            name="workLink"
                            value={formData.workLink}
                            onChange={handleChange}
                            placeholder="https://gavern.org"
                            className="border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* Socials Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-(family-name:--font-geist-sans) font-medium text-[14px] text-[#101828] dark:text-white">
                            Social media links * <span className="text-[#667085] font-normal text-[12px]">(you need to fill at least one of the any below.)</span>
                        </h3>

                        <div className="flex flex-col gap-3">
                            {/* X (Twitter) */}
                            <div className="flex items-center border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] focus-within:ring-1 focus-within:ring-[#22E9AD] overflow-hidden">
                                <div className="flex items-center justify-center w-[44px] h-[44px] border-r border-[#D0D5DD] dark:border-[#333333] bg-gray-50 dark:bg-[#2A2A2A]">
                                    <FaXTwitter className="text-[#667085] text-[16px]" />
                                </div>
                                <input
                                    name="x"
                                    value={formData.x}
                                    onChange={handleChange}
                                    placeholder="x.com/gavernapp"
                                    className="w-full border-none bg-transparent px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-0"
                                />
                            </div>

                            {/* Discord */}
                            <div className="flex items-center border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] focus-within:ring-1 focus-within:ring-[#22E9AD] overflow-hidden">
                                <div className="flex items-center justify-center w-[44px] h-[44px] border-r border-[#D0D5DD] dark:border-[#333333] bg-gray-50 dark:bg-[#2A2A2A]">
                                    <FaDiscord className="text-[#667085] text-[18px]" />
                                </div>
                                <input
                                    name="discord"
                                    value={formData.discord}
                                    onChange={handleChange}
                                    placeholder="discord.com/gavernapp"
                                    className="w-full border-none bg-transparent px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-0"
                                />
                            </div>

                            {/* Telegram */}
                            <div className="flex items-center border border-[#D0D5DD] dark:border-[#333333] rounded-[4px] focus-within:ring-1 focus-within:ring-[#22E9AD] overflow-hidden">
                                <div className="flex items-center justify-center w-[44px] h-[44px] border-r border-[#D0D5DD] dark:border-[#333333] bg-gray-50 dark:bg-[#2A2A2A]">
                                    <FaTelegramPlane className="text-[#667085] text-[18px]" />
                                </div>
                                <input
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleChange}
                                    placeholder="telegram.com/gavernapp"
                                    className="w-full border-none bg-transparent px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>



                    {submitError && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-[4px]">
                            {submitError}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 text-[#344054] dark:text-white border-[#D0D5DD] dark:border-[#333333] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] font-medium rounded-[4px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-[#000000] hover:bg-[#1A1A1A] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium rounded-[4px] min-w-[100px]"
                        >
                            {isPending ? "Saving..." : "Save Work"}
                        </Button>
                    </div>
                </form>
            </DialogContent >
        </Dialog >
    );
}
