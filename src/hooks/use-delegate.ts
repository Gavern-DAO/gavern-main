import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { delegateApi } from "@/services/delegate-api";
import { CreateProofOfWorkRequest, UpdateProofOfWorkRequest } from "@/types/delegate";

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
    onSuccess: (_, variables) => {
      // Invalidate the proof of work query for the user who created it (via their pubkey if we had it in context, 
      // but simpler to just invalidate all or refetch relevant if we knew the pubkey)
      // Since we don't have the pubkey of the creator easily here without extra context, 
      // we'll assume the component will handle invalidation or we invalidate broadly if needed.
      // Ideally, we'd invalidate ["proofOfWork", variables.daoPubkey] depending on how we want to view it.
      // But typically proof of work is viewed by the delegate's pubkey.
      // For now, let's just assume the user will refetch or we invalidate 'proofOfWork'
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
