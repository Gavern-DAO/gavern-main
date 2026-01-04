"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useTheme } from "next-themes";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConnectWalletModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ConnectWalletModal({
    isOpen,
    onOpenChange,
}: ConnectWalletModalProps) {
    const { setVisible } = useWalletModal();
    const { theme } = useTheme();
    const isLightTheme = theme === "light";

    const handleConnect = () => {
        onOpenChange(false);
        setVisible(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#010101] border-[#E5E7EB] dark:border-[#282828] p-0 overflow-hidden gap-0">
                <div className="flex flex-col items-center p-6 space-y-4">
                    <DialogTitle className="text-xl font-semibold text-[#101828] dark:text-[#EDEDED] text-center">
                        Connect your wallet
                    </DialogTitle>

                    <DialogDescription className="text-center text-[#667085] dark:text-[#A1A1A1] text-sm max-w-[300px]">
                        Please connect your wallet to track DAOs and get notifications about their activity.
                    </DialogDescription>

                    <div className="w-full pt-2">
                        <Button
                            onClick={handleConnect}
                            className="w-full bg-[#101828] hover:bg-[#101828]/90 dark:bg-[#EDEDED] dark:hover:bg-[#EDEDED]/90 text-white dark:text-[#101828] font-medium h-10 rounded-lg"
                        >
                            Connect Wallet
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
