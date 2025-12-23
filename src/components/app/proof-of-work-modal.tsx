"use client";

import React, { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useCreateProofOfWork, useAllDaos } from "@/hooks/use-delegate";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface ProofOfWorkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProofOfWorkModal({ open, onOpenChange }: ProofOfWorkModalProps) {
    const { mutate: createProofOfWork, isPending } = useCreateProofOfWork();
    const { data: daos, isLoading: isLoadingDaos } = useAllDaos();

    const [formData, setFormData] = useState({
        workTitle: "",
        selectedDaoPubkey: "",
        skillsRequired: "",
        workLink: "",
        discord: "",
        telegram: "",
        x: "",
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [isCustomDao, setIsCustomDao] = useState(false);
    const [customDao, setCustomDao] = useState({
        name: "",
        pubkey: "",
    });

    // Filter DAOs based on search query and limit to 10 results
    const filteredDaos = useMemo(() => {
        if (!daos) return [];

        const filtered = daos.filter((dao) =>
            dao.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filtered.slice(0, 10);
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

        let daoName: string;
        let daoPubkey: string;

        if (isCustomDao) {
            // Use custom DAO input
            if (!customDao.name || !customDao.pubkey) {
                alert("Please enter both DAO name and public key");
                return;
            }
            daoName = customDao.name;
            daoPubkey = customDao.pubkey;
        } else {
            // Use selected DAO from list
            const selectedDao = daos?.find(dao => dao.pubkey === formData.selectedDaoPubkey);

            if (!selectedDao) {
                alert("Please select a DAO");
                return;
            }
            daoName = selectedDao.name;
            daoPubkey = selectedDao.pubkey;
        }

        createProofOfWork({
            workTitle: formData.workTitle,
            daoName: daoName,
            daoPubkey: daoPubkey,
            skillsRequired: formData.skillsRequired.split(",").map(s => s.trim()).filter(s => s),
            workLink: formData.workLink,
            discord: formData.discord,
            telegram: formData.telegram,
            x: formData.x,
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
                    workTitle: "",
                    selectedDaoPubkey: "",
                    skillsRequired: "",
                    workLink: "",
                    discord: "",
                    telegram: "",
                    x: "",
                });
                setSearchQuery("");
                setCustomDao({ name: "", pubkey: "" });
                setIsCustomDao(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white dark:bg-[#1A1A1A] dark:text-white w-full max-w-2xl overflow-y-auto max-h-[90vh] p-4 md:p-6 rounded-xl">
                <DialogHeader className="mb-6">
                    <DialogTitle className="font-(family-name:--font-geist-sans) font-medium text-[24px] leading-[32px] text-[#101828] dark:text-white">
                        Upload Proof of Work
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Work Title */}
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                            Work Title
                        </label>
                        <input
                            name="workTitle"
                            value={formData.workTitle}
                            onChange={handleChange}
                            placeholder="e.g. Designed the Realms DAO Ecosystem website"
                            className="border border-[#D0D5DD] dark:border-[#333333] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* DAO Selector */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                                DAO
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
                                    <label className="font-(family-name:--font-geist-sans) font-medium text-[12px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                                        DAO Name
                                    </label>
                                    <input
                                        type="text"
                                        value={customDao.name}
                                        onChange={(e) => setCustomDao(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. My Custom DAO"
                                        className="border border-[#D0D5DD] dark:border-[#333333] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
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
                                        className="border border-[#D0D5DD] dark:border-[#333333] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
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
                                    <SelectTrigger className="w-full border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] text-[16px]">
                                        <SelectValue placeholder={isLoadingDaos ? "Loading DAOs..." : "Select a DAO"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredDaos.length === 0 ? (
                                            <div className="px-2 py-1.5 text-sm text-[#667085]">
                                                {searchQuery ? "No DAOs found" : "No DAOs available"}
                                            </div>
                                        ) : (
                                            filteredDaos.map((dao) => (
                                                <SelectItem key={dao.pubkey} value={dao.pubkey}>
                                                    {dao.name}
                                                </SelectItem>
                                            ))
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
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                            Skills Required (comma separated)
                        </label>
                        <input
                            name="skillsRequired"
                            value={formData.skillsRequired}
                            onChange={handleChange}
                            placeholder="e.g. Design, Development, Marketing"
                            className="border border-[#D0D5DD] dark:border-[#333333] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* Work Link */}
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054] dark:text-[#D0D5DD]">
                            Link to Work
                        </label>
                        <input
                            name="workLink"
                            value={formData.workLink}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="border border-[#D0D5DD] dark:border-[#333333] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* Socials Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-(family-name:--font-geist-sans) font-medium text-[16px] text-[#101828] dark:text-white">Social Accounts (Optional)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] text-[#344054] dark:text-white">Discord</label>
                                <input
                                    name="discord"
                                    value={formData.discord}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="border border-[#D0D5DD] dark:border-[#333333] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] text-[#344054] dark:text-white">Telegram</label>
                                <input
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="border border-[#D0D5DD] dark:border-[#333333] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] text-[#344054] dark:text-white">X (Twitter)</label>
                                <input
                                    name="x"
                                    value={formData.x}
                                    onChange={handleChange}
                                    placeholder="@username"
                                    className="border border-[#D0D5DD] dark:border-[#333333] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] dark:text-white dark:bg-[#2A2A2A] placeholder:text-[#667085] dark:placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 text-gray-700 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-[#000000] hover:bg-[#1A1A1A] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium rounded-[8px] min-w-[100px]"
                        >
                            {isPending ? "Saving..." : "Save Work"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
