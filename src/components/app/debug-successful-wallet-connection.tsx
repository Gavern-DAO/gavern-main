"use client";
import React from "react";
import { useWalletAuth } from "@/hooks/use-wallet-auth";

// Simple debug modal that bypasses your Dialog component
export default function DebugSuccessfulWalletModal() {
    const { successfulWalletModalOpen, countdown } = useWalletAuth();

    if (!successfulWalletModalOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
            style={{ zIndex: 9999 }}
        >
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 shadow-2xl">
                <h2 className="bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-semibold text-3xl mb-4">
                    Wallet Successfully connected.
                </h2>
                <p className="font-normal text-[#101828B2] text-lg mb-8">
                    Checking for your DAOs involvement, and detecting your governance
                    power in those DAOs too.
                </p>
                <div className="flex flex-col items-center py-12 text-[#101828B2] font-medium text-base">
                    <span>Please wait, It happens in seconds!</span>
                    <span className="block bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent py-3.5 text-[128px]">
                        {countdown}
                    </span>
                    <span>To go!</span>
                </div>
            </div>
        </div>
    );
}

// TEST INSTRUCTIONS:
// 1. In page.tsx, replace:
//    <SuccessfulWalletModal /> 
//    with:
//    <DebugSuccessfulWalletModal />
//
// 2. Connect wallet
// 3. If you see this modal, the issue is z-index
// 4. If you don't see it, check React DevTools to see if successfulWalletModalOpen is true