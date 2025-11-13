"use client";
import React from "react";
import { useWalletAuth } from "@/hooks/use-wallet-auth";

// Place this component somewhere visible on your page
export default function HookStateDebugger() {
  const hookState = useWalletAuth();
  
  return (
    <div 
      className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono z-[99999] max-w-sm"
      style={{ zIndex: 99999 }}
    >
      <h3 className="font-bold mb-2">🔍 Hook State Debug</h3>
      <div className="space-y-1">
        <div>successfulWalletModalOpen: <span className={hookState.successfulWalletModalOpen ? "text-green-400" : "text-red-400"}>
          {String(hookState.successfulWalletModalOpen)}
        </span></div>
        <div>daosFoundModalOpen: <span className={hookState.daosFoundModalOpen ? "text-green-400" : "text-red-400"}>
          {String(hookState.daosFoundModalOpen)}
        </span></div>
        <div>countdown: {hookState.countdown}</div>
        <div>isAuthenticated: {String(hookState.isAuthenticated)}</div>
        <div>isAuthenticating: {String(hookState.isAuthenticating)}</div>
        <div>connected: {String(hookState.connected)}</div>
      </div>
    </div>
  );
}