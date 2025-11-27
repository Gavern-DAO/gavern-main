"use client";
import { useRef, useEffect } from "react";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, userApi } from "@/lib/api";
import { setAuthToken } from "@/lib/cookie";

export const useWalletAuth = () => {
  const { connected, publicKey, disconnect, signMessage } = useWallet();
  const { 
    isAuthenticated, 
    setIsAuthenticated,
    successfulWalletModalOpen,
    setSuccessfulWalletModalOpen,
    daosFoundModalOpen,
    setDaosFoundModalOpen,
    countdown,
    setCountdown,
    resetAuthState, // ✅ Get reset function
  } = useAuthStore();
  
  const queryClient = useQueryClient();

  // ✅ Track authentication state to prevent multiple attempts
  const isAuthInProgress = useRef(false);

  const getDaosMutation = useMutation({
    mutationFn: userApi.getDaos,
    onSuccess: (data) => {
      console.log("✅ DAOs fetched successfully:", data);
      const daos = data.result.map((dao) => ({
        ...dao,
        imageUrl: `/${dao.realmName.toLowerCase().replace(/\s+/g, "-")}.png`,
      }));
      queryClient.setQueryData(["daos"], { count: daos.length, result: daos });

      console.log("🔄 Closing SuccessfulWalletModal, opening DaosFoundModal");
      setSuccessfulWalletModalOpen(false);
      setDaosFoundModalOpen(true);
    },
    onError: (e: Error) => {
      console.log("❌ Error Fetching Daos:", e);
      console.log("🔄 Closing SuccessfulWalletModal");
      setSuccessfulWalletModalOpen(false);

      if (e.message === "This user doesn't belong to any DAO") {
        console.log("🔄 Opening DaosFoundModal (no DAOs)");
        setDaosFoundModalOpen(true);
      }
      queryClient.setQueryData(["daos"], { count: 0, result: [] });
    },
  });

  const authenticateMutation = useMutation({
    mutationFn: async () => {
      if (!publicKey || !signMessage) {
        throw new Error(
          "Wallet not ready - no public key or signMessage function"
        );
      }

      console.log("📝 Fetching challenge...");
      const challenge = await authApi.requestChallenge({
        walletAddress: publicKey.toBase58(),
      });

      console.log("✍️ Signing challenge...");
      const encoded = new TextEncoder().encode(challenge);
      const signature = await signMessage(encoded);
      const signatureString = bs58.encode(signature);

      console.log("🔐 Verifying challenge...");
      return authApi.verifyChallenge({
        walletAddress: publicKey.toBase58(),
        challenge,
        signature: signatureString,
      });
    },
    onSuccess: (data) => {
      console.log("✅ Auth success!");
      setAuthToken(data.accessToken);
      setIsAuthenticated(true);

      console.log("🎉 Opening SuccessfulWalletModal");
      setSuccessfulWalletModalOpen(true);
      setCountdown(10);

      isAuthInProgress.current = false;

      console.log("🔍 Starting DAOs fetch...");
      getDaosMutation.mutate();
    },
    onError: (err) => {
      console.error("❌ Auth failed:", err);
      disconnect();
      resetAuthState(); // ✅ Reset all state on auth failure
      isAuthInProgress.current = false;
    },
  });

  const startAuthentication = async () => {
    if (isAuthInProgress.current) {
      console.log("⏸️ Authentication already in progress...");
      return;
    }

    if (!connected || !publicKey) {
      console.warn("⚠️ Wallet not connected, please connect first");
      throw new Error("Wallet not connected");
    }

    if (!signMessage) {
      console.warn("⚠️ Wallet does not support message signing");
      throw new Error("Sign message not supported");
    }

    console.log("🚀 Starting authentication process...");
    isAuthInProgress.current = true;

    try {
      await authenticateMutation.mutateAsync();
    } catch (error) {
      isAuthInProgress.current = false;
      throw error;
    }
  };

  const handleDisconnect = () => {
    console.log("👋 Disconnecting wallet...");
    
    // ✅ 1. Disconnect wallet
    disconnect();
    
    // ✅ 2. Clear auth token cookie
    setAuthToken(""); // Clear the cookie
    
    // ✅ 3. Reset all Zustand auth state
    resetAuthState();
    
    // ✅ 4. Clear React Query cache
    queryClient.clear();
    
    // ✅ 5. Reset auth progress flag
    isAuthInProgress.current = false;
    
    console.log("✅ Disconnect complete!");
  };

  // ✅ Auto-close SuccessfulWalletModal and open DaosFoundModal when countdown reaches 0
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (successfulWalletModalOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (successfulWalletModalOpen && countdown === 0) {
      console.log("⏰ Countdown reached 0, forcing modal transition");
      setSuccessfulWalletModalOpen(false);
      setDaosFoundModalOpen(true);
    }
    return () => clearTimeout(timer);
  }, [successfulWalletModalOpen, countdown, setSuccessfulWalletModalOpen, setDaosFoundModalOpen, setCountdown]);

  // ✅ Debug: Log modal state changes
  useEffect(() => {
    console.log("🔵 Modal State:", {
      successfulWalletModalOpen,
      daosFoundModalOpen,
      countdown,
      isAuthenticating: authenticateMutation.isPending,
      isFetchingDaos: getDaosMutation.isPending,
    });
  }, [successfulWalletModalOpen, daosFoundModalOpen, countdown, authenticateMutation.isPending, getDaosMutation.isPending]);

  return {
    connected,
    publicKey,
    isAuthenticated,
    isAuthenticating: authenticateMutation.isPending,
    startAuthentication,
    handleDisconnect,
    successfulWalletModalOpen,
    setSuccessfulWalletModalOpen,
    daosFoundModalOpen,
    setDaosFoundModalOpen,
    countdown,
  };
};