import { apiFetch } from "@/lib/api";
import {
  DelegateActivity,
  VotingHistoryResponse,
  DelegationStats,
  ProofOfWork,
  CreateProofOfWorkRequest,
  UpdateProofOfWorkRequest,
  DelegateStatsResponse,
} from "@/types/delegate";

export const delegateApi = {
  /**
   * Get delegate activity
   * GET /delegate/{pubkey}/activity
   */
  getDelegateActivity: async (pubkey: string) => {
    return apiFetch<DelegateActivity[]>(`/delegate/${pubkey}/activity`, {
      method: "GET",
    });
  },

  /**
   * Get delegate voting history
   * GET /delegate/{pubkey}/voting-history
   */
  getVotingHistory: async (pubkey: string) => {
    return apiFetch<VotingHistoryResponse>(`/delegate/${pubkey}/voting-history`, {
      method: "GET",
    });
  },

  /**
   * Get delegations received count
   * GET /delegate/{pubkey}/delegations-received
   */
  getDelegationsReceived: async (pubkey: string) => {
    return apiFetch<DelegationStats>(`/delegate/${pubkey}/delegations-received`, {
      method: "GET",
    });
  },

  /**
   * Get delegate proof of work
   * GET /delegate/{pubkey}/proof-of-work
   */
  getProofOfWork: async (pubkey: string) => {
    return apiFetch<ProofOfWork[]>(`/delegate/${pubkey}/proof-of-work`, {
      method: "GET",
    });
  },

  /**
   * Create proof of work
   * POST /delegate/proof-of-work
   */
  createProofOfWork: async (data: CreateProofOfWorkRequest) => {
    return apiFetch<ProofOfWork>("/delegate/proof-of-work", {
      method: "POST",
      data,
    });
  },

  /**
   * Update proof of work
   * PATCH /delegate/proof-of-work/{id}
   */
  updateProofOfWork: async (id: number, data: UpdateProofOfWorkRequest) => {
    return apiFetch<ProofOfWork>(`/delegate/proof-of-work/${id}`, {
      method: "PATCH",
      data,
    });
  },

  /**
   * Get aggregated delegate stats
   * GET /delegate/{pubkey}/stats
   */
  getDelegateStats: async (pubkey: string) => {
    return apiFetch<DelegateStatsResponse>(`/delegate/${pubkey}/stats`, {
      method: "GET",
    });
  },
};
