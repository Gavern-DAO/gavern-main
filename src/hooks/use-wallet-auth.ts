"use client";
import { useRef, useEffect, useCallback } from "react";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, userApi } from "@/lib/api";
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
  useEffect(() => {
    const token = getAuthToken();
    if (token && connected && publicKey && !isAuthenticated) {
      console.log("[useWalletAuth] Restoring session from cookie");
      setIsAuthenticated(true);
    } else if (!token && isAuthenticated) {
      console.log("[useWalletAuth] Token missing, resetting auth state");
      resetAuthState();
    }
  }, [connected, publicKey, isAuthenticated, setIsAuthenticated, resetAuthState]);

  // Track authentication state to prevent multiple attempts
  const isAuthInProgress = useRef(false);

  // Shared Query: Deduplicates with the Page component using the same key
  const userDaosQuery = useQuery({
    queryKey: ["userDaos"],
    queryFn: userApi.getDaos,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Automatically invalidate other queries when userDaos successfully completes for the first time
  useEffect(() => {
    if (userDaosQuery.status === "success" && isAuthenticated) {
      console.log("♻️ userDaos success -> Invalidating related dashboard queries");
      queryClient.invalidateQueries({ queryKey: ["trackedDaos"] });
      queryClient.invalidateQueries({ queryKey: ["trackedDaosWithSummary"] });
      queryClient.invalidateQueries({ queryKey: ["summarizedDaos"] });
    }
  }, [userDaosQuery.status, isAuthenticated, queryClient]);

  // Track completion status for the modal transition

  const authenticateMutation = useMutation({
    mutationFn: async () => {
      if (!publicKey || !signMessage) {
        throw new Error("Wallet not ready");
      }
      const challenge = await authApi.requestChallenge({
        walletAddress: publicKey.toBase58(),
      });
      const encoded = new TextEncoder().encode(challenge);
      const signature = await signMessage(encoded);
      const signatureString = bs58.encode(signature);

      return authApi.verifyChallenge({
        walletAddress: publicKey.toBase58(),
        challenge,
        signature: signatureString,
      });
    },
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      setIsAuthenticated(true);
      setSuccessfulWalletModalOpen(true);
      setCountdown(10);
      isAuthInProgress.current = false;
    },
    onError: (err) => {
      console.error("❌ Auth failed:", err);
      resetAuthState();
      isAuthInProgress.current = false;
    },
    retry: 0,
  });

  const startAuthentication = useCallback(async () => {
    if (isAuthInProgress.current) return;
    if (!connected || !publicKey || !signMessage) throw new Error("Wallet not ready");

    isAuthInProgress.current = true;
    try {
      await authenticateMutation.mutateAsync();
    } catch (error) {
      isAuthInProgress.current = false;
      throw error;
    }
  }, [connected, publicKey, signMessage, authenticateMutation]);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
    setAuthToken("");
    resetAuthState();
    queryClient.clear();
    isAuthInProgress.current = false;
  }, [disconnect, resetAuthState, queryClient]);

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
      // Use queryClient.getQueryState to avoid stale closures/linting issues with status narrowing
      const checkCompletion = () => {
        const state = queryClient.getQueryState(["userDaos"]);
        return state?.status === "success" || state?.status === "error";
      };

      if (checkCompletion()) {
        console.log("⏰ Countdown is 0 & API complete -> Transitioning to DaosFoundModal");
        setSuccessfulWalletModalOpen(false);
        setDaosFoundModalOpen(true);
      } else {
        console.log("⏰ Countdown is 0 but API still pending -> Polling...");
        const pollInterval = setInterval(() => {
          if (checkCompletion()) {
            console.log("⏰ API finally complete -> Transitioning to DaosFoundModal");
            setSuccessfulWalletModalOpen(false);
            setDaosFoundModalOpen(true);
            clearInterval(pollInterval);
          }
        }, 200);
        return () => clearInterval(pollInterval);
      }
    }
  }, [successfulWalletModalOpen, countdown, setSuccessfulWalletModalOpen, setDaosFoundModalOpen, queryClient]);

  return {
    connected,
    publicKey,
    isAuthenticated,
    isAuthenticating: authenticateMutation.isPending,
    isFetchingDaos: userDaosQuery.isLoading,
    startAuthentication,
    handleDisconnect,
    successfulWalletModalOpen,
    setSuccessfulWalletModalOpen,
    daosFoundModalOpen,
    setDaosFoundModalOpen,
    countdown,
  };
};