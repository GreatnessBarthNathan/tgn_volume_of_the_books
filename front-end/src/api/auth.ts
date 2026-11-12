import customFetch from "../utils/customFetch"

export type AdminType = { username: string }

export const getAdminSession = async () => {
  const {
    data: { admin },
  } = await customFetch.get<{ admin: AdminType }>("/auth/session")
  return admin
}

export const loginAdmin = async (data: {
  username: string
  password: string
}) => {
  const {
    data: { admin },
  } = await customFetch.post<{ admin: AdminType }>("/auth/login", data)
  return admin
}

export const logoutAdmin = () => customFetch.post("/auth/logout")

export const createAdminInvitation = async () => {
  const {
    data: { invitation },
  } = await customFetch.post<{
    invitation: { token: string; expiresAt: string }
  }>("/auth/accounts/invitations")
  return invitation
}

export const createAdminRecoveryCode = async (username: string) => {
  const {
    data: { recoveryCode },
  } = await customFetch.post<{
    recoveryCode: { token: string; username: string; expiresAt: string }
  }>("/auth/accounts/recovery-codes", { username })
  return recoveryCode
}

export const acceptAdminInvitation = (data: {
  token: string
  username: string
  password: string
}) =>
  customFetch.post<{ admin: AdminType }>(
    "/auth/accounts/accept-invitation",
    data
  )

export const recoverAdminAccount = (data: {
  code: string
  username: string
  password: string
}) => customFetch.post("/auth/recover", data)
