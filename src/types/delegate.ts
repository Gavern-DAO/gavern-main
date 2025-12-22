export interface DelegateActivity {
  name: string;
  pubkey: string;
  proposalsCreated: number;
  votesCast: number;
  governancePower: string;
}

export interface VotingHistoryItem {
  daoName: string;
  daoPubkey: string;
  proposalName: string;
  status: "Succeeded" | "Active" | "Defeated" | "Executable" | "Cancelled"; // Added other likely statuses
  voteChoice: "Approve" | "Deny" | "Abstain" | "Veto"; // Added other likely choices
  hoursLeft?: number;
  proposalCreatedAt: string;
  proposalCreator: string;
}

export interface VotingHistoryResponse {
  totalCount: number;
  history: VotingHistoryItem[];
}

export interface DelegationStats {
  delegationsCount: number;
}

export interface ProofOfWork {
  id: number;
  workTitle: string;
  daoName: string;
  daoPubkey: string;
  skillsRequired: string[];
  workLink: string;
  discord?: string;
  telegram?: string;
  x?: string;
}

export interface CreateProofOfWorkRequest {
  workTitle: string;
  daoName: string;
  daoPubkey: string;
  skillsRequired: string[];
  workLink: string;
  discord?: string;
  telegram?: string;
  x?: string;
}

export interface UpdateProofOfWorkRequest {
  workTitle?: string;
  daoName?: string;
  daoPubkey?: string;
  skillsRequired?: string[];
  workLink?: string;
  discord?: string;
  telegram?: string;
  x?: string;
}

export interface DelegateStatsResponse {
  totalProposalsCreated: number;
  totalVotesCast: number;
  totalDelegationsReceived: number;
}
