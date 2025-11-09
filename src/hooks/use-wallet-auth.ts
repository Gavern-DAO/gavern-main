"use client";
import { useEffect, useState, useRef } from "react";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, userApi } from "@/lib/api";
import { setAuthToken } from "@/lib/cookie";

interface Dao {
  realmName: string;
  imageUrl: string;
  governingTokenDepositAmount: string;
}

interface GetDaosResponse {
  count: number;
  result: Dao[];
}

export const useWalletAuth = () => {
  const { connected, publicKey, disconnect, signMessage } = useWallet();
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const [successfulWalletModalOpen, setSuccessfulWalletModalOpen] =
    useState(false);
  const [daosFoundModalOpen, setDaosFoundModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const queryClient = useQueryClient();
  const isManuallyDisconnectingRef = useRef(false);
  const wasSuccessModalOpenRef = useRef(false);

  const getDaosMutation = useMutation({
    mutationFn: userApi.getDaos,
    onSuccess: (data: GetDaosResponse) => {
      const daosWithImages = data.result.map((dao: Dao) => ({
        ...dao,
        imageUrl: `/${dao.realmName.toLowerCase().replace(/\s+/g, "-")}.png`,
      }));
      queryClient.setQueryData(["daos"], {
        count: daosWithImages.length,
        result: daosWithImages,
      });
    },
    onError: () => {
      // On error, we can clear the daos data or handle it as needed
      queryClient.setQueryData(["daos"], {
        count: 0,
        result: [],
      });
    },
  });

  const authenticateMutation = useMutation({
    mutationFn: async () => {
      if (!publicKey || !signMessage) {
        throw new Error("Wallet not connected or signMessage not available");
      }

      // 1. Request challenge
      const challenge = await authApi.requestChallenge({
        walletAddress: publicKey.toBase58(),
      });

      // 2. Sign challenge
      const encodedMessage = new TextEncoder().encode(challenge);
      const signature = await signMessage(encodedMessage);
      const signatureString = bs58.encode(signature);

      // 3. Verify challenge
      const data = await authApi.verifyChallenge({
        walletAddress: publicKey.toBase58(),
        challenge,
        signature: signatureString,
      });

      return data;
    },
    onSuccess: (data) => {
      // On successful verification, set authenticated and show modals
      setAuthToken(data.accessToken);
      setIsAuthenticated(true);
      setSuccessfulWalletModalOpen(true);
      setCountdown(10);
      getDaosMutation.mutate(); // Fetch DAOs after successful auth
    },
    onError: (error) => {
      console.error("Authentication failed:", error);
      // Handle auth error, maybe show a toast or message
      setIsAuthenticated(false);
      handleDisconnect(); // Disconnect wallet on auth failure
    },
  });

  const { mutate: authenticate, isPending: isAuthenticating } =
    authenticateMutation;

  useEffect(() => {
    if (
      connected &&
      publicKey &&
      !isAuthenticated &&
      !isAuthenticating &&
      !isManuallyDisconnectingRef.current
    ) {
      authenticate();
    }

    if (isManuallyDisconnectingRef.current && connected) {
      isManuallyDisconnectingRef.current = false;
    }

    if (!connected) {
      setIsAuthenticated(false);
      setSuccessfulWalletModalOpen(false);
      setDaosFoundModalOpen(false);
    }
  }, [
    connected,
    publicKey,
    isAuthenticated,
    isAuthenticating,
    authenticate,
    setIsAuthenticated,
  ]);

  // Countdown runs independently (for UX only)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (successfulWalletModalOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [successfulWalletModalOpen, countdown]);

  // Effect to transition from success modal to DAOs modal
  useEffect(() => {
    if (wasSuccessModalOpenRef.current && !successfulWalletModalOpen) {
      setDaosFoundModalOpen(true);
    }
    wasSuccessModalOpenRef.current = successfulWalletModalOpen;
  }, [successfulWalletModalOpen]);

  const handleDisconnect = () => {
    isManuallyDisconnectingRef.current = true;
    disconnect();
    setIsAuthenticated(false);
    setSuccessfulWalletModalOpen(false);
    setDaosFoundModalOpen(false);
  };

  return {
    connected,
    publicKey,
    isAuthenticated,
    successfulWalletModalOpen,
    setSuccessfulWalletModalOpen,
    daosFoundModalOpen,
    setDaosFoundModalOpen,
    countdown,
    handleDisconnect,
    getDaosMutation,
  } as const;
};
