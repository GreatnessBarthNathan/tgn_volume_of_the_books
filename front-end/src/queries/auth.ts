import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  acceptAdminInvitation,
  createAdminRecoveryCode,
  createAdminInvitation,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  recoverAdminAccount,
} from "../api/auth"

export const useAdminSession = () =>
  useQuery({
    queryKey: ["admin-session"],
    queryFn: getAdminSession,
    retry: false,
    staleTime: 60_000,
  })

export const useLoginAdmin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (admin) => queryClient.setQueryData(["admin-session"], admin),
  })
}

export const useLogoutAdmin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => queryClient.setQueryData(["admin-session"], null),
  })
}

export const useCreateAdminInvitation = () =>
  useMutation({ mutationFn: createAdminInvitation })

export const useCreateAdminRecoveryCode = () =>
  useMutation({ mutationFn: createAdminRecoveryCode })

export const useAcceptAdminInvitation = () =>
  useMutation({ mutationFn: acceptAdminInvitation })

export const useRecoverAdminAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recoverAdminAccount,
    onSuccess: () => queryClient.setQueryData(["admin-session"], null),
  })
}
