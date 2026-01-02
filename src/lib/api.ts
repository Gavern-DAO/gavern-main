import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getAuthToken, removeAuthToken } from "./cookie";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Types
export interface TokenMetadata {
  symbol: string;
  name: string;
  logoURI?: string;
}

export interface Dao {
  imageUrl: string;
  realmName: string;
  governingTokenDepositAmount: string;
  tokenMetadata?: TokenMetadata | null;
}


export interface ApiDaoResult {
  imageUrl?: string;
  realmName?: string;
  name?: string;
  governingTokenDepositAmount?: string;
  tokenMetadata?: TokenMetadata | null;
  [key: string]: unknown;
}


export interface UserDaosResponse {
  count: number;
  result: ApiDaoResult[];
}

export interface TreasuryToken {
  mint: string;
  decimals: number;
  amount: string;
  uiAmount: number;
  price: number;
  value: number;
  symbol: string;
  name: string;
  logoURI?: string;
}

export interface TreasuryYield {
  [key: string]: unknown;
}

export interface TreasuryStaking {
  [key: string]: unknown;
}

export interface TreasuryInfo {
  totalValue: number;
  tokens: TreasuryToken[];
  yield: TreasuryYield[];
  staking: TreasuryStaking[];
}

export interface Proposal {
  name: string;
  status: string;
  datePublished: string;
  creator: string;
  description: string;
  numberOfVotes: number;
  participationRate: number;
  pubkey: string;
}

export type ProposalSummary = Proposal[];

export interface FullSummaryDao {
  [key: string]: unknown;
}

export interface UserVoteAndProposals {
  [key: string]: unknown;
}

export interface MemberInfo {
  member: string;
  delegator: boolean;
  governancePower: string;
  proposalsCreated: number;
  votesCast: number;
  snsId?: string | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MemberInfoResponse {
  pagination: PaginationInfo;
  members: MemberInfo[];
}

export interface TopActiveMember {
  pubkey: string;
  proposalsCreated: number;
  votesCast: number;
  votingPower: string;
  snsId?: string | null;
}

export interface VoterTurnout {
  totalMembers: number;
  activeVoters: number;
  inactiveVoters: number;
}

export type MemberCount = string;

export type VoteCount = string;

export interface ChallengeRequestDTO {
  walletAddress: string;
}

export interface VerifyChallengeDTO {
  walletAddress: string;
  signature: string;
  challenge: string; // Base 58
}

export interface TestSignChallengeDTO {
  challenge: string;
  privateKey: string;
}

export interface SendEmailOtpDto {
  email: string;
  walletAddress: string;
}

export interface VerifyEmailOtpDto {
  email: string;
  otp: string;
  walletAddress: string;
}

export interface TrackDaoDto {
  pubkey: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// Generic axios wrapper with auth support
export async function apiFetch<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const token = getAuthToken();

  const config: AxiosRequestConfig = {
    ...options,
    url: endpoint,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const apiError: ApiError = {
        message: axiosError.response?.data?.message || axiosError.message || "API Error",
        statusCode: axiosError.response?.status,
      };
      throw apiError;
    }
    throw error;
  }
}

// ============================================
// AUTH ENDPOINTS
// ============================================

export const authApi = {
  /**
   * Request authentication challenge
   * POST /auth/challenge
   */
  requestChallenge: async (data: ChallengeRequestDTO) => {
    return apiFetch<string>("/auth/challenge", {
      method: "POST",
      data: data,
      responseType: "text",
    });
  },

  /**
   * Verify signed challenge
   * POST /auth/verify
   */
  verifyChallenge: async (data: VerifyChallengeDTO) => {
    return apiFetch<{
      status: string;
      user: {
        id: 1;
        name: string | null;
        email: string | null;
        walletAddress: string;
        role: string;
        isEmailVerified: boolean;
        pendingEmail: string | null;
        emailVerificationOtp: string | null;
        emailVerificationExpires: string | null;
        twitter: string | null;
        telegram: string | null;
        discord: string | null;
        profilePictureUrl: string | null;
      };
      accessToken: string;
    }>("/auth/verify", {
      method: "POST",
      data: data,
    });
  },

  /**
   * Test sign challenge (development only)
   * POST /auth/test-sign
   */
  testSign: async (data: TestSignChallengeDTO) => {
    return apiFetch<{ signature: string }>("/auth/test-sign", {
      method: "POST",
      data: data,
    });
  },

  /**
   * Request OTP for email verification
   * POST /auth/send-otp
   */
  sendOtp: async (data: SendEmailOtpDto) => {
    return apiFetch<{ success: boolean }>("/auth/send-otp", {
      method: "POST",
      data: data,
    });
  },

  /**
   * Verify OTP
   * POST /auth/verify-otp
   */
  verifyOtp: async (data: VerifyEmailOtpDto) => {
    return apiFetch<{ success: boolean; verified: boolean }>("/auth/verify-otp", {
      method: "POST",
      data: data,
    });
  },
};

// ============================================
// USER ENDPOINTS
// ============================================

export const userApi = {
  /**
   * Get DAOs by wallet address
   * GET /user/daos-user
   */
  getDaosByWallet: async (wallet: string) => {
    const data = await apiFetch<{
      count: number;
      result: ApiDaoResult[];
    }>(`/user/daos-user?wallet=${encodeURIComponent(wallet)}`, {
      method: "GET",
    });

    return {
      ...data,
      result: (data.result || []).map((dao) => ({
        ...dao,
        imageUrl: dao.imageUrl || `/${(dao.realmName || "unknown").toLowerCase().replace(/\s+/g, "-")}.png`,
      })),
    };
  },

  /**
   * Get DAOs for logged-in user
   * GET /user/daos
   * 
   * Backend returns: { tracking, newTracked, count, result }
   * We extract: { count, result } for frontend consumption
   */
  getDaos: async () => {
    const response = await apiFetch<{
      tracking: boolean;
      newTracked: number;
      count: number;
      result: ApiDaoResult[];
    }>("/user/daos", {
      method: "GET",
    });

    // Extract count and result from top level (they are spread, not nested)
    const count = response.count || 0;
    const result = response.result || [];

    return {
      count,
      result: result.map((dao) => ({
        ...dao,
        // Map 'name' to 'realmName' for frontend compatibility
        realmName: dao.realmName || dao.name || "Unknown DAO",
        // Generate imageUrl from realmName
        imageUrl: dao.imageUrl || dao.tokenMetadata?.logoURI || `/${(dao.realmName || dao.name || "unknown").toLowerCase().replace(/\s+/g, "-")}.png`,
        tokenMetadata: dao.tokenMetadata || null,
      })),
    };
  },

  /**
   * Track a DAO
   * POST /user/track
   */
  trackDao: async (data: TrackDaoDto) => {
    return apiFetch<{ success: boolean }>("/user/track", {
      method: "POST",
      data: data,
    });
  },

  /**
   * Untrack a DAO
   * DELETE /user/{pubkey}/untrack
   */
  untrackDao: async (pubkey: string) => {
    return apiFetch<{ success: boolean }>(`/user/${pubkey}/untrack`, {
      method: "DELETE",
    });
  },

  /**
   * Get tracked DAOs
   * GET /user/tracked
   */
  getTrackedDaos: async () => {
    return apiFetch<{ id: string; name: string; pubkey: string }[]>("/user/tracked", {
      method: "GET",
    });
  },

  /**
   * Get tracked DAOs with summaries and governance power
   * GET /user/tracked-with-summary
   */
  getTrackedDaosWithSummary: async () => {
    return apiFetch<TrackedDaosWithSummaryResponse>("/user/tracked-with-summary", {
      method: "GET",
    });
  },

  /**
   * Update user profile details
   * PATCH /user/profile
   */
  updateProfile: async (data: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    name?: string;
  }) => {
    return apiFetch<{
      id: number;
      walletAddress: string;
      twitter: string | null;
      telegram: string | null;
      discord: string | null;
      name: string | null;
    }>("/user/profile", {
      method: "PATCH",
      data: data,
    });
  },

  /**
   * Upload user profile picture
   * POST /user/upload-profile-picture
   */
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<{
      id: number;
      walletAddress: string;
      profilePictureUrl: string;
    }>("/user/upload-profile-picture", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Response types for tracked DAOs with summary
export interface PowerBreakdown {
  total: string;
  v1: string;
  v2: string;
  vsr: string;
}

export interface ProposalInfo {
  exists: boolean;
  latest?: string | null;
}

export interface DaoSummary {
  realm: string;
  realmName?: string;
  realmOwner: string;
  proposalCount: number;
  status: "active" | "dead";
  activeProposal?: ProposalInfo;
  closedProposal?: ProposalInfo;
  treasuryBalance: number;
  communityMint?: string;
  councilMint?: string;
}

export interface TrackedDaoWithSummary {
  pubkey: string;
  name: string;
  summary: DaoSummary | null;
  governancePower: string;
  powerBreakdown: PowerBreakdown;
}

export interface TrackedDaosWithSummaryResponse {
  count: number;
  result: TrackedDaoWithSummary[];
}

// ============================================
// DAOS ENDPOINTS
// ============================================

export interface TreasuryParams {
  realm: string;
  realmOwner: string;
}

export interface ProposalSummaryParams {
  realm: string;
  realmOwner: string;
}

export interface VotePropsParams {
  walletAddress: string;
  realm: string;
  realmOwner: string;
  governingTokenMint: string;
}

export interface MemberInfoParams {
  realm: string;
  realmOwner: string;
  governingTokenMint: string;
  page: number;
  limit: number;
}

export interface MemberCountParams {
  realm: string;
  realmOwner: string;
}

export interface VoteCountParams {
  realm: string;
  realmOwner: string;
}

export interface TopActiveMemberParams {
  realm: string;
  realmOwner: string;
}

export interface VoterTurnoutParams {
  realm: string;
  realmOwner: string;
}

export interface DaoSummaryOne {
  realm: string;
  realmOwner: string;
  proposalCount: number;
  status: string;
  activeProposal: {
    exists: boolean;
    latest: string | null;
  };
  closedProposal: {
    exists: boolean;
    latest: string | null;
  };
  treasuryBalance: number;
  realmName: string;
  communityMint: string;
  councilMint: string;
}

export const daosApi = {
  /**
   * Get all DAOs
   * GET /daos
   */
  getAllDaos: async () => {
    return apiFetch<
      {
        pubkey: string;
        owner: string;
        name: string;
      }[]
    >("/daos", {
      method: "GET",
    });
  },

  /**
   * Get treasury info for DAO
   * GET /daos/treasury
   */
  getTreasuryInfo: async (params: TreasuryParams) => {
    const query = new URLSearchParams({
      realm: params.realm,
      realmOwner: params.realmOwner,
    });
    return apiFetch<TreasuryInfo>(`/daos/treasury?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get proposals summary for DAO
   * GET /daos/proposals/summary
   */
  getProposalsSummary: async (params: ProposalSummaryParams) => {
    const query = new URLSearchParams({
      realm: params.realm,
      realmOwner: params.realmOwner,
    });
    return apiFetch<ProposalSummary>(`/daos/proposals/summary?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get full summary for all DAOs
   * GET /daos/full-summary
   */
  getFullSummary: async () => {
    return apiFetch<FullSummaryDao[]>("/daos/full-summary", {
      method: "GET",
    });
  },

  /**
   * Get summary for specific DAOs
   * GET /daos/summary
   */
  getSummaryForDaos: async (daos: string[]) => {
    const query = new URLSearchParams();
    daos.forEach((dao) => query.append("daos", dao));
    return apiFetch<
      // {
      //   realm: string;
      //   realmOwner: string;
      //   proposalCount: 57;
      //   status: string;
      //   activeProposal: {
      //     exists: boolean;
      //     latest: string;
      //   };
      //   closedProposal: {
      //     exists: boolean;
      //     latest: string;
      //   };
      //   treasuryBalance: number;
      //   realmName: string;
      //   communityMint: string;
      //   councilMint: string;
      // }
      DaoSummaryOne[]
    >(`/daos/summary?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get user votes and proposals count
   * GET /daos/vote-props
   */
  getUserVoteAndProposals: async (params: VotePropsParams) => {
    const query = new URLSearchParams({
      walletAddress: params.walletAddress,
      realm: params.realm,
      realmOwner: params.realmOwner,
      governingTokenMint: params.governingTokenMint,
    });
    return apiFetch<UserVoteAndProposals>(`/daos/vote-props?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get member info (paginated)
   * GET /daos/members
   */
  getMemberInfo: async (params: MemberInfoParams) => {
    const query = new URLSearchParams({
      realm: params.realm,
      realmOwner: params.realmOwner,
      governingTokenMint: params.governingTokenMint,
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    return apiFetch<MemberInfoResponse>(`/daos/members?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get member count
   * GET /daos/members-count
   */
  getMemberCount: async (params: MemberCountParams) => {
    const query = new URLSearchParams({
      realm: params.realm,
      realmOwner: params.realmOwner,
    });
    return apiFetch<string>(`/daos/members-count?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get vote count
   * GET /daos/vote-count
   */
  getVoteCount: async (params: VoteCountParams) => {
    const query = new URLSearchParams({
      realm: params.realm,
      realmOwner: params.realmOwner,
    });
    return apiFetch<string>(`/daos/vote-count?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get summary for a single DAO
   * GET /daos/summary-one
   */
  getDaoSummaryOne: async (daoPubkey: string) => {
    const query = new URLSearchParams({
      dao: daoPubkey,
    });
    return apiFetch<DaoSummaryOne[]>(`/daos/summary-one?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get stored roles for a DAO
   * GET /daos/stored-roles/{daoPubkey}
   */
  getStoredRoles: async (daoPubkey: string) => {
    return apiFetch<
      {
        id: string;
        name: string;
        description: string;
        pubkey: string | null;
        telegram: string | null;
        discord: string | null;
        x: string | null;
        assignedAt: string;
      }[]
    >(`/daos/stored-roles/${daoPubkey}`, {
      method: "GET",
    });
  },

  /**
   * Get top active members for DAO
   * GET /daos/top-active-members
   */
  getTopActiveMembers: async (params: TopActiveMemberParams) => {
    const query = new URLSearchParams({
      realm: params.realm,
      realmOwner: params.realmOwner,
    });
    return apiFetch<TopActiveMember[]>(`/daos/top-active-members?${query.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Get voter turnout for DAO
   * GET /daos/vote-turnout
   */
  getVoterTurnout: async (params: VoterTurnoutParams) => {
    const query = new URLSearchParams({
      realm: params.realm,
      realmOwner: params.realmOwner,
    });
    return apiFetch<VoterTurnout>(`/daos/vote-turnout?${query.toString()}`, {
      method: "GET",
    });
  },
};

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Logout helper
 */
export function logout() {
  if (typeof window !== "undefined") {
    removeAuthToken();
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!getAuthToken();
}

export const requestChallenge = async (walletAddress: string) => {
  return `Welcome to Gavern. Please sign to prove you own: ${walletAddress}. Timestamp: ${Date.now()}`;
};

export const verifyChallenge = async (data: VerifyChallengeDTO) => {
  // In a real app, you'd verify the signature on the backend.
  // For this example, we'll just simulate a successful verification.
  console.log("Verifying challenge with data:", data);
  return {
    status: "success",
    user: {
      id: 1,
      name: null,
      email: null,
      walletAddress: data.walletAddress,
      role: "regular",
      isEmailVerified: false,
      pendingEmail: null,
      emailVerificationOtp: null,
      emailVerificationExpires: null,
    },
  };
};

// Export all
const api = {
  auth: authApi,
  user: userApi,
  daos: daosApi,
  logout,
  isAuthenticated,
};

export default api;
