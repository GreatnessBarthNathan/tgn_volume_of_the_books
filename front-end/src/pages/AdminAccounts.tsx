import { useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { toast } from "react-toastify"
import {
  useCreateAdminInvitation,
  useCreateAdminRecoveryCode,
} from "../queries/auth"

function AdminAccounts() {
  const [recoveryUsername, setRecoveryUsername] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [recoveryExpiresAt, setRecoveryExpiresAt] = useState("")
  const [invitationUrl, setInvitationUrl] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const invitationMutation = useCreateAdminInvitation()
  const recoveryMutation = useCreateAdminRecoveryCode()
  const { mutate, isLoading, isError, error } = invitationMutation

  useEffect(() => {
    if (invitationMutation.isError) {
      toast.error(
        isAxiosError(invitationMutation.error)
          ? invitationMutation.error.response?.data?.msg ||
              "Unable to create invitation"
          : "Unable to create invitation"
      )
    }
    if (recoveryMutation.isError) {
      toast.error(
        isAxiosError(recoveryMutation.error)
          ? recoveryMutation.error.response?.data?.msg ||
              "Unable to create recovery code"
          : "Unable to create recovery code"
      )
    }
  }, [
    error,
    isError,
    invitationMutation.error,
    invitationMutation.isError,
    recoveryMutation.error,
    recoveryMutation.isError,
  ])

  const createInvitation = () => {
    setInvitationUrl("")
    mutate(undefined, {
      onSuccess: ({ token, expiresAt: invitationExpiresAt }) => {
        const url = new URL("/admin/accept-invite", window.location.origin)
        url.searchParams.set("token", token)
        setInvitationUrl(url.toString())
        setExpiresAt(new Date(invitationExpiresAt).toLocaleString())
        toast.success("Administrator invitation created")
      },
    })
  }

  const copyInvitation = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl)
      toast.success("Invitation link copied")
    } catch {
      toast.error("Unable to copy the invitation link; select and copy it instead")
    }
  }

  const createRecoveryCode = () => {
    setRecoveryCode("")
    recoveryMutation.mutate(recoveryUsername.trim(), {
      onSuccess: ({ token, expiresAt: codeExpiresAt }) => {
        setRecoveryCode(token)
        setRecoveryExpiresAt(new Date(codeExpiresAt).toLocaleString())
        toast.success("Recovery code created")
      },
    })
  }

  const copyRecoveryCode = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCode)
      toast.success("Recovery code copied")
    } catch {
      toast.error("Unable to copy the code; select and copy it instead")
    }
  }

  return (
    <main>
      <section className='form-card'>
        <h1 className='mb-4 text-center text-[var(--primaryColor)] font-semibold'>
          Invite an administrator
        </h1>
        <button
          type='button'
          onClick={createInvitation}
          disabled={isLoading}
          className='border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white capitalize disabled:opacity-60'
        >
          {isLoading ? "Creating..." : "Create invitation link"}
        </button>
        {invitationUrl && (
          <div className='mt-4'>
            <p className='mb-2'>
              Share this one-time link with the invitee. It expires {expiresAt}.
            </p>
            <input
              aria-label='Administrator invitation link'
              readOnly
              value={invitationUrl}
              onFocus={(event) => event.currentTarget.select()}
              className='mb-2 border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
            />
            <button
              type='button'
              onClick={copyInvitation}
              className='border p-1 w-full rounded-sm'
            >
              Copy invitation link
            </button>
          </div>
        )}
      </section>
      <section className='form-card mt-6'>
        <h2 className='mb-3 text-center text-[var(--primaryColor)] font-semibold'>
          Generate an admin recovery code
        </h2>
        <p className='mb-3'>
          Generate a single-use code for yourself or another admin. Generating
          a new code replaces that admin&apos;s previous code.
        </p>
        <label className='block font-semibold' htmlFor='recovery-username'>
          Admin username
        </label>
        <input
          id='recovery-username'
          value={recoveryUsername}
          onChange={(event) => setRecoveryUsername(event.target.value)}
          required
          className='mb-3 border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
        />
        <button
          type='button'
          onClick={createRecoveryCode}
          disabled={
            recoveryMutation.isLoading ||
            !/^[a-zA-Z0-9._-]{3,32}$/.test(recoveryUsername.trim())
          }
          className='border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white disabled:opacity-60'
        >
          {recoveryMutation.isLoading ? "Generating..." : "Generate recovery code"}
        </button>
        {recoveryCode && (
          <div className='mt-4'>
            <p className='mb-2'>
              Save and give this code to the admin now. It is shown only once
              and expires {recoveryExpiresAt}.
            </p>
            <input
              aria-label='Admin recovery code'
              readOnly
              value={recoveryCode}
              onFocus={(event) => event.currentTarget.select()}
              className='mb-2 border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
            />
            <button
              type='button'
              onClick={copyRecoveryCode}
              className='border p-1 w-full rounded-sm'
            >
              Copy recovery code
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminAccounts
