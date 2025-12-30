"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { Button } from "../ui/button";
import { Copy, LogOut, EllipsisVertical, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "next-themes";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getAuthToken } from "@/lib/cookie";
import DaoSearch from "./dao-search";


// Auth state machine including signing-out as an internal buffer
type AuthStatus = "signed-out" | "signing-in" | "signed-in" | "signing-out";

interface AuthState {
    status: AuthStatus;
    error: Error | null;
}

type AuthAction =
    | { type: "SIGN_IN_STARTED" }
    | { type: "SIGN_IN_SUCCESS" }
    | { type: "SIGN_OUT_STARTED" }
    | { type: "SIGN_OUT_SUCCESS" }
    | { type: "SET_ERROR"; payload: Error }
    | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
    status: "signed-out",
    error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "SIGN_IN_STARTED":
            return { status: "signing-in", error: null };
        case "SIGN_IN_SUCCESS":
            return { status: "signed-in", error: null };
        case "SIGN_OUT_STARTED":
            return { ...state, status: "signing-out", error: null };
        case "SIGN_OUT_SUCCESS":
            return initialState;
        case "SET_ERROR":
            return { status: "signed-out", error: action.payload };
        case "CLEAR_ERROR":
            return { ...state, error: null };
        default:
            return state;
    }
}

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const isLightTheme = theme === "light" || theme === undefined;
    const {
        isAuthenticated,
        handleDisconnect,
        startAuthentication,
        publicKey
    } = useWalletAuth();
    const { visible, setVisible } = useWalletModal();
    const { connected, disconnect, wallet } = useWallet();
    const [copied, setCopied] = React.useState(false);

    const [state, dispatch] = useReducer(authReducer, initialState);
    const { status, error } = state;

    // Prevent double sign-in attempts and tracking disconnection race
    const isSigningInRef = useRef(false);
    const wasSigningOutRef = useRef(false);

    // doSignIn - handles the auth flow
    const doSignIn = useCallback(async () => {
        if (isSigningInRef.current) return;
        isSigningInRef.current = true;

        dispatch({ type: "SIGN_IN_STARTED" });

        try {
            await startAuthentication();
            dispatch({ type: "SIGN_IN_SUCCESS" });
        } catch (err) {
            console.error("Authentication failed:", err);
            dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err : new Error("Auth failed") });
            // Do NOT disconnect here automatically - let the user stay connected
            // and choose to either retry auth or disconnect manually.
        } finally {
            isSigningInRef.current = false;
        }
    }, [startAuthentication, disconnect]);

    // Login opens the modal
    const login = useCallback(() => {
        if (status === "signed-out") {
            dispatch({ type: "CLEAR_ERROR" });
            setVisible(true);
        }
    }, [status, setVisible]);

    const handleCopyAddress = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey.toBase58());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // State sync effect
    useEffect(() => {
        // Crucially block ANY auto-action if we are signing in OR signing out
        if (status === "signing-in" || status === "signing-out") {
            return;
        }

        const token = getAuthToken();
        const hasValidSession = !!token && connected;

        // Reset the disconnection flag once the wallet is actually disconnected
        if (!connected) {
            wasSigningOutRef.current = false;
        }

        switch (status) {
            case "signed-out":
                // Session restore or already authenticated in global state
                if (isAuthenticated || hasValidSession) {
                    dispatch({ type: "SIGN_IN_SUCCESS" });
                }
                // New sign in: connected, no error, modal closed, and NOT recently signing out
                else if (connected && !error && !wasSigningOutRef.current && !visible) {
                    doSignIn();
                }
                break;

            case "signed-in":
                // If we lose both connection and global auth, go back to signed-out
                if (!connected && !isAuthenticated) {
                    dispatch({ type: "SIGN_OUT_SUCCESS" });
                }
                break;
        }
    }, [status, connected, isAuthenticated, error, doSignIn, visible]);

    // Logout - using an async flow to prevent the race condition
    const logout = useCallback(async () => {
        // 1. Enter internal 'signing-out' state and set the race-prevention ref
        wasSigningOutRef.current = true;
        dispatch({ type: "SIGN_OUT_STARTED" });

        try {
            // 2. Perform actual logic
            await handleDisconnect();
        } finally {
            // 3. Finally return to 'signed-out' state
            dispatch({ type: "SIGN_OUT_SUCCESS" });
        }
    }, [handleDisconnect]);

    const isLoading = status === "signing-in";

    return (
        <div className="w-full sticky top-0 z-50 dark:border-b dark:border-b-[#282828B2] bg-white dark:bg-[#010101]">
            <div className="flex">
                <nav className="flex md:my-6 lg:max-w-300 mx-auto items-center justify-between w-full px-4 py-4">
                    <Link href="/">
                        <Image
                            src={isLightTheme ? "/nav/logo-light.png" : "/nav/logo-dark.png"}
                            alt="Logo"
                            width={134.25}
                            height={32}
                        />
                    </Link>
                    <div className="ml-auto flex items-center gap-4">
                        <DaoSearch />

                        <div className="flex gap-2">
                            <button
                                onClick={() => setTheme("light")}
                                className="focus:outline-none p-1"
                                aria-label="Switch to light mode"
                            >
                                <MdOutlineLightMode
                                    className={`w-4 h-4 cursor-pointer ${isLightTheme ? "text-foreground" : "text-muted-foreground"}`}
                                />
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className="focus:outline-none p-1"
                                aria-label="Switch to dark mode"
                            >
                                <MdOutlineDarkMode
                                    className={`w-4 h-4 cursor-pointer ${isLightTheme ? "text-muted-foreground" : "text-foreground"}`}
                                />
                            </button>
                        </div>
                        {/* Show profile if signed-in OR signing-out (to hide the flash) */}
                        {(isAuthenticated || status === "signed-in" || status === "signing-out") && publicKey ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-[5px] border-0 font-medium bg-[#F1F1F1] dark:bg-[#0a0a0a] text-gray-900 dark:text-white text-xs md:text-sm"
                                    >
                                        {wallet?.adapter?.icon && (
                                            <Image
                                                src={wallet.adapter.icon}
                                                alt={wallet.adapter.name}
                                                width={24}
                                                height={24}
                                                className="w-4 h-4 md:w-6 md:h-6 rounded-full flex-shrink-0"
                                            />
                                        )}
                                        <span className="hidden sm:inline truncate max-w-[80px] md:max-w-none">
                                            {`${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
                                        </span>
                                        <span className="sm:hidden truncate max-w-[60px]">
                                            {`${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
                                        </span>
                                        <EllipsisVertical className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem
                                        asChild
                                        className="gap-2 cursor-pointer text-[#101828B2] dark:text-gray-300"
                                    >
                                        <Link href={`/delegate/${publicKey.toBase58()}`}>
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={handleCopyAddress}
                                        className="gap-2 cursor-pointer text-[#101828B2] dark:text-gray-300"
                                    >
                                        <Copy className="w-4 h-4" />
                                        {copied ? "Copied!" : "Copy Address"}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={logout}
                                        disabled={status === "signing-out"}
                                        className="gap-2 text-[#101828B2] dark:text-gray-300 cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Disconnect wallet
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                onClick={login}
                                disabled={isLoading}
                                className={isLoading ? "opacity-70 cursor-not-allowed" : ""}
                            >
                                <span className="hidden sm:inline">
                                    {isLoading ? "Signing In..." : "Connect Wallet"}
                                </span>
                                <span className="sm:hidden">
                                    {isLoading ? "Signing..." : "Connect"}
                                </span>
                            </Button>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}