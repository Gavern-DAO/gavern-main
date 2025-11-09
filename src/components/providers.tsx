"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import axios from "axios";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: false, // Don't refetch on reconnect
      staleTime: 1000 * 60 * 30, // 30 minutes - data is considered fresh for 30 minutes
      gcTime: 1000 * 60 * 60, // 1 hour - cache persists for 1 hour (formerly cacheTime)
      retry: (failureCount, error: Error) => {
        // Don't retry on 4xx errors (client errors) - these won't be fixed by retrying
        if (axios.isAxiosError(error)) {
          const statusCode = error?.response?.data?.statusCode ||
            (axios.isAxiosError(error) ? error.response?.status : null);

          if (statusCode && statusCode >= 400 && statusCode < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors (network errors, 5xx errors, etc.)
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount: number, error: Error) => {
        // Don't retry mutations on 4xx errors
        if (axios.isAxiosError(error)) {
          const statusCode =
            error.response?.data?.statusCode ?? error.response?.status;

          if (statusCode && statusCode >= 400 && statusCode < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  if (!mounted) {
    return <>
      <div className="w-full h-screen dark:bg-[#010101] mx-auto rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] py-20 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-gray-300 border-t-[#010101] rounded-full animate-spin"></div>
      </div>
      {/* <QueryClientProvider client={queryClient}> */}
      {/* {children} */}
      {/* </QueryClientProvider> */}
    </>;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
