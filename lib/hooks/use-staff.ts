import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as staffApi from "@/lib/api/staff";

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: staffApi.listStaff,
  });
}

export function useInviteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; role: string }) => staffApi.inviteStaff(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useCancelStaffInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.cancelStaffInvitation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useUpdateStaffRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => staffApi.updateStaffRole(id, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useTransferOwnership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { new_owner_staff_id: string; password: string }) => staffApi.transferOwnership(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useStaffInvitations() {
  return useQuery({ queryKey: ["staff", "invitations"], queryFn: staffApi.listStaffInvitations });
}

export function useRemoveStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.removeStaffMember(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useSetStaffGrant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: { grant_code: string; is_granted: boolean; reason?: string } }) => staffApi.setStaffGrant(staffId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useRemoveStaffGrant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, grantCode }: { staffId: string; grantCode: string }) => staffApi.removeStaffGrant(staffId, grantCode),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}
