import { FormEvent, useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAdminSession, useLoginAdmin } from "../queries/auth"

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { data: admin } = useAdminSession()
  const { mutate, isLoading, isError, error, isSuccess } = useLoginAdmin()
  const destination = location.state?.from?.pathname || "/"

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    mutate({
      username: String(formData.get("username") || ""),
      password: String(formData.get("password") || ""),
    })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Signed in as administrator")
      navigate(destination, { replace: true })
    }
    if (isError) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.msg || "Unable to sign in"
          : "Unable to sign in"
      )
    }
  }, [destination, error, isError, isSuccess, navigate])

  if (admin) return <Navigate to='/' replace />

  return (
    <main>
      <form
        className='form-card'
        onSubmit={handleSubmit}
      >
        <h1 className='capitalize mb-4 text-center text-[var(--primaryColor)] font-semibold'>
          Administrator sign in
        </h1>
        <label className='block capitalize font-semibold' htmlFor='username'>
          Username
        </label>
        <input
          id='username'
          name='username'
          autoComplete='username'
          required
          className='mb-3 border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
        />
        <label className='block capitalize font-semibold' htmlFor='password'>
          Password
        </label>
        <div className='relative mb-4'>
          <input
            id='password'
            name='password'
            type={showPassword ? "text" : "password"}
            autoComplete='current-password'
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
          disabled={isLoading}
          className='border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white capitalize disabled:opacity-60'
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        <p className='mt-3 text-center'>
          <Link to='/' className='text-[var(--primaryColor)] underline'>
            Continue browsing
          </Link>
        </p>
        <p className='mt-2 text-center'>
          <Link
            to='/admin/recover'
            className='text-[var(--primaryColor)] underline'
          >
            Forgot username or password?
          </Link>
        </p>
      </form>
    </main>
  )
}

export default AdminLogin
