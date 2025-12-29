"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { DiscordIcon, NewTwitterIcon, TelegramIcon, ImageAdd01Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";

interface EditProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: {
        twitter?: string;
        telegram?: string;
        discord?: string;
        profilePictureUrl?: string;
    };
    pubkey?: string;
}

export default function EditProfileModal({
    open,
    onOpenChange,
    initialData,
    pubkey
}: EditProfileModalProps) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileData, setProfileData] = useState({
        twitter: initialData?.twitter || "",
        telegram: initialData?.telegram || "",
        discord: initialData?.discord || "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.profilePictureUrl || null);
    const [fileError, setFileError] = useState<string | null>(null);

    // Reset state when modal opens or initial values change
    useEffect(() => {
        if (open) {
            setProfileData({
                twitter: initialData?.twitter || "",
                telegram: initialData?.telegram || "",
                discord: initialData?.discord || "",
            });
            setPreviewUrl(initialData?.profilePictureUrl || null);
            setSelectedFile(null);
            setFileError(null);
        }
    }, [open, initialData]);

    const updateProfileMutation = useMutation({
        mutationFn: (data: typeof profileData) => userApi.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["delegateStats", pubkey] });
            onOpenChange(false);
        },
        onError: (error) => {
            console.error("Failed to update profile:", error);
        },
    });

    const uploadImageMutation = useMutation({
        mutationFn: (file: File) => userApi.uploadProfilePicture(file),
        onSuccess: () => {
            // After image upload, update the other profile data
            updateProfileMutation.mutate(profileData);
        },
        onError: (error) => {
            console.error("Failed to upload image:", error);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check for lightweight standard (Recommended: < 500KB, Hard Limit: 1MB)
            const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
            if (file.size > MAX_FILE_SIZE) {
                setFileError("Selected image is more than 1MB. Please select a lighter image.");
                return;
            }

            setFileError(null);
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSave = async () => {
        if (selectedFile) {
            uploadImageMutation.mutate(selectedFile);
        } else {
            updateProfileMutation.mutate(profileData);
        }
    };

    const isPending = updateProfileMutation.isPending || uploadImageMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white dark:bg-[#010101] w-full max-w-md p-6 rounded-xl dark:border dark:border-[#282828B2]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="font-(family-name:--font-geist-sans) font-medium text-[20px] leading-[28px] text-[#101828] dark:text-white text-center">
                        Edit Profile Details
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-800 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-900 group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Profile Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <HugeiconsIcon icon={ImageAdd01Icon} className="text-gray-400" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Change</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload profile picture</p>
                        {fileError && <p className="text-xs text-red-500 font-medium">{fileError}</p>}
                    </div>

                    {/* X (Twitter) Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <HugeiconsIcon icon={NewTwitterIcon} size={16} />
                            X (Twitter) Username
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                            <input
                                type="text"
                                value={profileData.twitter}
                                onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                                placeholder="username"
                                className="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#282828B2] rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Telegram Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <HugeiconsIcon icon={TelegramIcon} size={16} />
                            Telegram Username
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                            <input
                                type="text"
                                value={profileData.telegram}
                                onChange={(e) => setProfileData({ ...profileData, telegram: e.target.value })}
                                placeholder="username"
                                className="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#282828B2] rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Discord Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <HugeiconsIcon icon={DiscordIcon} size={16} />
                            Discord Username
                        </label>
                        <input
                            type="text"
                            value={profileData.discord}
                            onChange={(e) => setProfileData({ ...profileData, discord: e.target.value })}
                            placeholder="username#0000"
                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#282828B2] rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-8">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="bg-transparent hover:bg-gray-100 dark:hover:bg-[#171717] text-gray-700 dark:text-gray-300 border-none shadow-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-8 disabled:opacity-50"
                    >
                        {isPending ? "Saving..." : "Save Details"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
