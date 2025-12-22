"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, NewTwitterIcon, TelegramIcon } from "@hugeicons/core-free-icons";

interface ShareProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pubkey?: string;
}

export default function ShareProfileModal({ open, onOpenChange, pubkey }: ShareProfileModalProps) {
    const [copied, setCopied] = useState(false);

    // Get current host safely
    const getShareUrl = () => {
        if (typeof window !== "undefined") {
            const host = window.location.origin;
            return `${host}/delegate/${pubkey || ""}`;
        }
        return `https://gavern.io/delegate/${pubkey || ""}`; // Fallback
    };

    const shareUrl = getShareUrl();

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareTwitter = () => {
        const text = `Check out this delegate profile on Gavern!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const handleShareTelegram = () => {
        const text = `Check out this delegate profile on Gavern!`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white dark:bg-[#010101] w-full max-w-md p-6 rounded-xl dark:border dark:border-[#282828]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="font-(family-name:--font-geist-sans) font-medium text-[20px] leading-[28px] text-[#101828] dark:text-white text-center">
                        Share Delegate Profile
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6">
                    {/* URL Display */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Link</label>
                        <div className="grid grid-cols-[1fr_auto] gap-2 w-full">
                            <div className="min-w-0 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#282828] rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400 truncate">
                                {shareUrl}
                            </div>
                            <Button
                                onClick={handleCopy}
                                className="shrink-0 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#282828] hover:bg-gray-50 dark:hover:bg-[#171717] text-gray-700 dark:text-gray-300 shadow-sm"
                            >
                                {copied ? "Copied!" : <HugeiconsIcon icon={Copy01Icon} size={18} />}
                            </Button>
                        </div>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleShareTwitter}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-black dark:bg-[#171717] text-white hover:bg-gray-800 dark:hover:bg-[#282828] transition-colors font-medium text-sm"
                        >
                            <HugeiconsIcon icon={NewTwitterIcon} size={18} />
                            Share on X
                        </button>
                        <button
                            onClick={handleShareTelegram}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#26A5E4] text-white hover:opacity-90 transition-opacity font-medium text-sm"
                        >
                            <HugeiconsIcon icon={TelegramIcon} size={18} />
                            Share on Telegram
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
