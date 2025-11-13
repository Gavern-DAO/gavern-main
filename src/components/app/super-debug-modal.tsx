"use client";
import React from "react";
import { useWalletAuth } from "@/hooks/use-wallet-auth";

export default function SuperDebugModal() {
    console.log("🟢 [SuperDebugModal] Component is rendering!");

    const hookResult = useWalletAuth();
    console.log("🟡 [SuperDebugModal] Hook result:", hookResult);

    const { successfulWalletModalOpen, countdown } = hookResult;

    console.log("🔵 [SuperDebugModal] successfulWalletModalOpen:", successfulWalletModalOpen);
    console.log("🟣 [SuperDebugModal] countdown:", countdown);

    React.useEffect(() => {
        console.log("🟠 [SuperDebugModal] useEffect triggered - open:", successfulWalletModalOpen);
    }, [successfulWalletModalOpen]);

    if (!successfulWalletModalOpen) {
        console.log("🔴 [SuperDebugModal] Early return - modal closed");
        return null;
    }

    console.log("🟢 [SuperDebugModal] Rendering modal content!");

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/80"
            style={{
                zIndex: 99999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div
                className="bg-red-500 text-white p-8 rounded-lg max-w-4xl w-full mx-4"
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    maxWidth: '56rem',
                    width: '100%',
                    margin: '0 1rem'
                }}
            >
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    🎉 MODAL IS SHOWING! 🎉
                </h1>
                <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Countdown: {countdown}
                </p>
                <p style={{ fontSize: '1rem' }}>
                    If you can see this red box, React is rendering the modal correctly!
                </p>
                <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
                    successfulWalletModalOpen: {String(successfulWalletModalOpen)}
                </p>
            </div>
        </div>
    );
}