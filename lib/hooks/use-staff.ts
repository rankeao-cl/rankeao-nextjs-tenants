import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listStaff, inviteStaff, cancelStaffInvitation, updateStaffRole, transferOwnership } from "@/lib/api/staff";

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: listStaff,
  });
}

export function useInviteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; role: string }) => inviteStaff(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useCancelStaffInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelStaffInvitation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useUpdateStaffRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateStaffRole(id, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useTransferOwnership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { new_owner_id: string }) => transferOwnership(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}
