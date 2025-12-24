import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { delegateApi } from "@/services/delegate-api";
import { CreateProofOfWorkRequest, UpdateProofOfWorkRequest } from "@/types/delegate";
import { daosApi } from "@/lib/api";

export const useDelegateActivity = (pubkey: string | undefined) => {
  return useQuery({
    queryKey: ["delegateActivity", pubkey],
    queryFn: () => delegateApi.getDelegateActivity(pubkey!),
    enabled: !!pubkey,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useVotingHistory = (pubkey: string | undefined) => {
  return useQuery({
    queryKey: ["votingHistory", pubkey],
    queryFn: () => delegateApi.getVotingHistory(pubkey!),
    enabled: !!pubkey,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDelegationsReceived = (pubkey: string | undefined) => {
  return useQuery({
    queryKey: ["delegationsReceived", pubkey],
    queryFn: () => delegateApi.getDelegationsReceived(pubkey!),
    enabled: !!pubkey,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProofOfWork = (pubkey: string | undefined) => {
  return useQuery({
    queryKey: ["proofOfWork", pubkey],
    queryFn: () => delegateApi.getProofOfWork(pubkey!),
    enabled: !!pubkey,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateProofOfWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProofOfWorkRequest) => delegateApi.createProofOfWork(data),
    onSuccess: () => {
      // Invalidate the proof of work query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["proofOfWork"] });
    },
  });
};

export const useUpdateProofOfWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProofOfWorkRequest }) =>
      delegateApi.updateProofOfWork(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proofOfWork"] });
    },
  });
};

export const useDelegateStats = (pubkey: string | undefined) => {
  return useQuery({
    queryKey: ["delegateStats", pubkey],
    queryFn: () => delegateApi.getDelegateStats(pubkey!),
    enabled: !!pubkey,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAllDaos = () => {
  return useQuery({
    queryKey: ["allDaos"],
    queryFn: () => daosApi.getAllDaos(),
    staleTime: 1000 * 60 * 30, // 30 minutes - DAOs don't change frequently
  });
};
