"use client";
import { useRef, useEffect } from "react";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, userApi, UserDaosResponse } from "@/lib/api";
import { setAuthToken, getAuthToken } from "@/lib/cookie";

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
    resetAuthState,
  } = useAuthStore();

  const queryClient = useQueryClient();

  // Load auth state from cookie on mount
  // Load auth state from cookie on mount
  useEffect(() => {
    const token = getAuthToken();
    // Debug log to trace refresh behavior
    console.log("[useWalletAuth] Auth Check:", {
      tokenExists: !!token,
      connected,
      publicKey: publicKey?.toBase58(),
      isAuthenticated
    });

    if (token && connected && publicKey && !isAuthenticated) {
      console.log("[useWalletAuth] Restoring session from cookie");
      setIsAuthenticated(true);
    } else if (!token && isAuthenticated) {
      // If no token exists but we think we are logged in, reset (e.g. cookie expired)
      console.log("[useWalletAuth] Token missing, resetting auth state");
      resetAuthState();
    }
  }, [connected, publicKey, isAuthenticated, setIsAuthenticated, resetAuthState]);

  // Track authentication state to prevent multiple attempts
  const isAuthInProgress = useRef(false);

  // Track if DAO fetch has completed (success or error)
  const daoFetchComplete = useRef(false);

  const getDaosMutation = useMutation({
    mutationFn: userApi.getDaos,
    onSuccess: (data: UserDaosResponse) => {
      // Cache the data for the modal to read
      queryClient.setQueryData(["daos"], data);

      // Mark fetch as complete
      daoFetchComplete.current = true;
    },
    onError: (e: Error) => {
      console.error("Error fetching DAOs:", e.message);

      // Cache empty result
      queryClient.setQueryData(["daos"], { count: 0, result: [] });

      // Mark fetch as complete (even on error)
      daoFetchComplete.current = true;
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
      daoFetchComplete.current = false; // Reset for new fetch

      console.log("🔍 Starting DAOs fetch...");
      getDaosMutation.mutate();
    },
    onError: (err) => {
      console.error("❌ Auth failed:", err);
      // Do NOT disconnect here - it causes an infinite loop with autoConnect.
      // The wallet stays connected, but user is not authenticated.
      // They can click "Connect Wallet" to retry manually.
      resetAuthState();
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

  const handleDisconnect = async () => {
    console.log("👋 Disconnecting wallet...");

    await disconnect();
    setAuthToken("");
    resetAuthState();
    queryClient.clear();
    isAuthInProgress.current = false;
    daoFetchComplete.current = false;

    console.log("✅ Disconnect complete!");
  };

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (successfulWalletModalOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [successfulWalletModalOpen, countdown, setCountdown]);

  // Transition effect: When countdown reaches 0 AND API fetch is complete, transition to DaosFoundModal
  useEffect(() => {
    if (successfulWalletModalOpen && countdown === 0) {
      // Check if API fetch is complete (using ref to avoid stale closure)
      if (daoFetchComplete.current) {
        console.log("⏰ Countdown is 0 & API complete -> Transitioning to DaosFoundModal");
        setSuccessfulWalletModalOpen(false);
        setDaosFoundModalOpen(true);
      } else {
        console.log("⏰ Countdown is 0 but API still pending -> Waiting...");
        // Poll every 100ms to check if API is complete
        const pollInterval = setInterval(() => {
          if (daoFetchComplete.current) {
            console.log("⏰ API complete -> Transitioning to DaosFoundModal");
            setSuccessfulWalletModalOpen(false);
            setDaosFoundModalOpen(true);
            clearInterval(pollInterval);
          }
        }, 100);

        // Cleanup
        return () => clearInterval(pollInterval);
      }
    }
  }, [successfulWalletModalOpen, countdown, setSuccessfulWalletModalOpen, setDaosFoundModalOpen]);

  // Debug: Log modal state changes
  useEffect(() => {
    console.log("🔵 Modal State:", {
      successfulWalletModalOpen,
      daosFoundModalOpen,
      countdown,
      isAuthenticating: authenticateMutation.isPending,
      isFetchingDaos: getDaosMutation.isPending,
      daoFetchComplete: daoFetchComplete.current,
    });
  }, [successfulWalletModalOpen, daosFoundModalOpen, countdown, authenticateMutation.isPending, getDaosMutation.isPending]);

  return {
    connected,
    publicKey,
    isAuthenticated,
    isAuthenticating: authenticateMutation.isPending,
    isFetchingDaos: getDaosMutation.isPending,
    startAuthentication,
    handleDisconnect,
    successfulWalletModalOpen,
    setSuccessfulWalletModalOpen,
    daosFoundModalOpen,
    setDaosFoundModalOpen,
    countdown,
  };
};