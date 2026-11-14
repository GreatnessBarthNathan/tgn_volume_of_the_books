import { FormEvent, useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useAcceptAdminInvitation } from "../queries/auth"

function AdminAcceptInvitation() {
  const [showPassword, setShowPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token") || ""
  const { mutate, isLoading, isError, error, isSuccess } =
    useAcceptAdminInvitation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    mutate({
      token,
      username: String(formData.get("username") || ""),
      password: String(formData.get("password") || ""),
    })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Administrator account created. You can now sign in.")
      navigate("/admin/login", { replace: true })
    }
    if (isError) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.msg || "Unable to accept invitation"
          : "Unable to accept invitation"
      )
    }
  }, [error, isError, isSuccess, navigate])

  return (
    <main>
      <form className='form-card' onSubmit={handleSubmit}>
        <h1 className='mb-4 text-center text-[var(--primaryColor)] font-semibold'>
          Accept administrator invitation
        </h1>
        {!token && (
          <p className='mb-3 text-center'>
            This invitation link is missing its token.
          </p>
        )}
        <label className='block font-semibold' htmlFor='username'>
          Username
        </label>
        <input
          id='username'
          name='username'
          autoComplete='username'
          required
          className='mb-3 border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
        />
        <label className='block font-semibold' htmlFor='password'>
          Password (12-128 characters)
        </label>
        <div className='relative mb-4'>
          <input
            id='password'
            name='password'
            type={showPassword ? "text" : "password"}
            autoComplete='new-password'
            required
            className='border p-1 pr-14 w-full border-[var(--primaryColor)] rounded-sm outline-none'
          />
          <button
            type='button'
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[var(--primaryColor)] underline'
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type='submit'
          disabled={isLoading || !token}
          className='border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white capitalize disabled:opacity-60'
        >
          {isLoading ? "Creating..." : "Create account"}
        </button>
        <p className='mt-3 text-center'>
          <Link
            to='/admin/login'
            className='text-[var(--primaryColor)] underline'
          >
            Admin sign in
          </Link>
        </p>
      </form>
    </main>
  )
}

export default AdminAcceptInvitation
