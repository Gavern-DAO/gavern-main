"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Input } from "../ui/input";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { Button } from "../ui/button";
import { CiSearch } from "react-icons/ci";
import { Copy, LogOut, EllipsisVertical, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const { connect, connected, connecting, wallet } = useWallet();
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

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

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-[5px] border-0 font-medium bg-[#F1F1F1] dark:bg-[#0a0a0a] text-gray-900 dark:text-white text-xs md:text-sm"
                    disabled={isAuthenticating}
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
                      {isAuthenticating ? "Authenticating..." : `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
                    </span>
                    <span className="sm:hidden truncate max-w-[60px]">
                      {isAuthenticating
                        ? "Auth..."
                        : `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
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
                    onClick={() => {
                      console.log("[Navbar] 📋 Copy address clicked");
                      handleCopyAddress();
                    }}
                    className="gap-2 cursor-pointer text-[#101828B2] dark:text-gray-300"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy Address"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      console.log("[Navbar] 🔌 Disconnect wallet clicked");
                      onDisconnectClick();
                    }}
                    className="gap-2 text-[#101828B2] dark:text-gray-300 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleConnectClick}
                disabled={isLoading}
                className={isLoading ? "opacity-70 cursor-not-allowed" : ""}
              >
                <span className="hidden sm:inline">
                  {isConnecting || connecting ? "Connecting..." :
                    isAuthenticating ? "Authenticating..." : "Connect Wallet"}
                </span>
                <span className="sm:hidden">
                  {isConnecting || connecting ? "Connecting..." :
                    isAuthenticating ? "Auth..." : "Connect"}
                </span>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}