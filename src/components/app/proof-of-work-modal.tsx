"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useCreateProofOfWork } from "@/hooks/use-delegate";
// Assuming you have Input, Label, Button components in ui folder or similar, 
// if not I will use standard HTML elements styled with tailwind.
// Based on file list, I shouldn't assume too many UI components exist beyond what I saw.
// I'll stick to raw tailwind for inputs to be safe, or check if they exist.
// Checking file list... I don't see input.tsx in the list but I see button in daos-found-modal.tsx import from "../ui/button".
// I'll assume standard Shadcn-like structure for Button.

import { Button } from "../ui/button";

interface ProofOfWorkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProofOfWorkModal({ open, onOpenChange }: ProofOfWorkModalProps) {
    const { mutate: createProofOfWork, isPending } = useCreateProofOfWork();

    const [formData, setFormData] = useState({
        workTitle: "",
        daoName: "",
        skillsRequired: "",
        workLink: "",
        discord: "",
        telegram: "",
        x: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mock DAO Pubkey for now as we don't have a dao selector yet or context
        // Ideally this would come from a selected DAO
        const daoPubkey = "MockDaoPubkey";

        createProofOfWork({
            workTitle: formData.workTitle,
            daoName: formData.daoName,
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
                    daoName: "",
                    skillsRequired: "",
                    workLink: "",
                    discord: "",
                    telegram: "",
                    x: "",
                });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white w-full max-w-2xl overflow-y-auto max-h-[90vh] p-4 md:p-6 rounded-xl">
                <DialogHeader className="mb-6">
                    <DialogTitle className="font-(family-name:--font-geist-sans) font-medium text-[24px] leading-[32px] text-[#101828]">
                        Upload Proof of Work
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Work Title */}
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054]">
                            Work Title
                        </label>
                        <input
                            name="workTitle"
                            value={formData.workTitle}
                            onChange={handleChange}
                            placeholder="e.g. Designed the Realms DAO Ecosystem website"
                            className="border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* DAO Name */}
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054]">
                            DAO Name
                        </label>
                        <input
                            name="daoName"
                            value={formData.daoName}
                            onChange={handleChange}
                            placeholder="e.g. Realms DAO"
                            className="border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* Skills */}
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054]">
                            Skills Required (comma separated)
                        </label>
                        <input
                            name="skillsRequired"
                            value={formData.skillsRequired}
                            onChange={handleChange}
                            placeholder="e.g. Design, Development, Marketing"
                            className="border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* Work Link */}
                    <div className="flex flex-col gap-2">
                        <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] leading-[20px] text-[#344054]">
                            Link to Work
                        </label>
                        <input
                            name="workLink"
                            value={formData.workLink}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                            required
                        />
                    </div>

                    {/* Socials Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-(family-name:--font-geist-sans) font-medium text-[16px] text-[#101828]">Social Accounts (Optional)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] text-[#344054]">Discord</label>
                                <input
                                    name="discord"
                                    value={formData.discord}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] text-[#344054]">Telegram</label>
                                <input
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-(family-name:--font-geist-sans) font-medium text-[14px] text-[#344054]">X (Twitter)</label>
                                <input
                                    name="x"
                                    value={formData.x}
                                    onChange={handleChange}
                                    placeholder="@username"
                                    className="border border-[#D0D5DD] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#22E9AD]"
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
                            className="px-4 py-2 bg-[#101828] hover:bg-[#1D2939] text-white font-medium rounded-[8px] min-w-[100px]"
                        >
                            {isPending ? "Saving..." : "Save Work"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
