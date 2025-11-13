"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Input } from "../ui/input";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { Button } from "../ui/button";
import { CiSearch } from "react-icons/ci";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light" || theme === undefined;
  const {
    isAuthenticated,
    handleDisconnect,
    startAuthentication,
    isAuthenticating,
    publicKey
  } = useWalletAuth();
  const { setVisible } = useWalletModal();
  const { connect, connected, disconnect, connecting, wallet } = useWallet();
  const [isConnecting, setIsConnecting] = React.useState(false);

  // ✅ Track if we've already triggered auth for this connection
  const hasTriggeredAuthRef = React.useRef(false);

  const handleConnectClick = async () => {
    // ✅ Prevent multiple clicks
    if (isConnecting || connecting || isAuthenticating) return;

    try {
      console.log("Starting wallet connection flow...");
      setIsConnecting(true);

      // ✅ Check if wallet is already selected but not connected
      if (wallet && !connected) {
        console.log("Wallet already selected, connecting directly...");
        await connect();
        console.log("Wallet connected!");
        // Don't call startAuthentication here - let useEffect handle it
      } else if (!wallet) {
        // ✅ Only open modal if no wallet is selected
        console.log("No wallet selected, opening modal...");
        setVisible(true);
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setIsConnecting(false);
      hasTriggeredAuthRef.current = false;
    }
  };

  // ✅ Handle authentication when wallet connects
  React.useEffect(() => {
    // Only trigger auth if:
    // 1. Wallet is connected
    // 2. Not already authenticated
    // 3. Haven't already triggered auth for this connection
    // 4. Not currently authenticating
    if (connected && !isAuthenticated && !hasTriggeredAuthRef.current && !isAuthenticating) {
      console.log("Wallet connected, starting authentication...");
      hasTriggeredAuthRef.current = true;

      startAuthentication()
        .catch((err) => {
          console.error("Authentication failed:", err);
          hasTriggeredAuthRef.current = false;
        })
        .finally(() => {
          setIsConnecting(false);
        });
    }
  }, [connected, isAuthenticated, isAuthenticating, startAuthentication]);

  // ✅ Reset flags when wallet disconnects
  React.useEffect(() => {
    if (!connected) {
      setIsConnecting(false);
      hasTriggeredAuthRef.current = false;
    }
  }, [connected]);

  // ✅ Reset auth trigger flag when user becomes authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      hasTriggeredAuthRef.current = false;
    }
  }, [isAuthenticated]);

  // ✅ Handle disconnect button click
  const onDisconnectClick = () => {
    console.log("🔴 Disconnect button clicked");
    // Reset local state
    setIsConnecting(false);
    hasTriggeredAuthRef.current = false;
    // Call the hook's disconnect handler (which will disconnect wallet + clear auth)
    handleDisconnect();
  };

  const isLoading = isConnecting || connecting || isAuthenticating;

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
            <Label className="hidden md:flex items-center">
              <CiSearch color="#909090" />
              <Input
                className="bg-transparent border-none outline-none shadow-none focus:outline-none focus:ring-0 px-0 dark:px-3 focus-visible:outline-0 focus-visible:ring-0 min-w-[353px] placeholder:text-[#909090] text-base leading-[24px] font-normal dark:bg-transparent"
                placeholder="Search for a DAO"
              />
            </Label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className="focus:outline-none p-1"
                aria-label="Switch to light mode"
              >
                <MdOutlineLightMode
                  className={`w-4 h-4 cursor-pointer ${isLightTheme ? "text-foreground" : "text-muted-foreground"
                    }`}
                />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className="focus:outline-none p-1"
                aria-label="Switch to dark mode"
              >
                <MdOutlineDarkMode
                  className={`w-4 h-4 cursor-pointer ${isLightTheme ? "text-muted-foreground" : "text-foreground"
                    }`}
                />
              </button>
            </div>
            {isAuthenticated && publicKey ? (
              <Button onClick={onDisconnectClick}>
                Disconnect: {publicKey.toBase58().slice(0, 4)}...
                {publicKey.toBase58().slice(-6)}
              </Button>
            ) : (
              <Button
                onClick={handleConnectClick}
                disabled={isLoading}
                className={isLoading ? "opacity-70 cursor-not-allowed" : ""}
              >
                {isConnecting || connecting ? "Connecting..." :
                  isAuthenticating ? "Authenticating..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}