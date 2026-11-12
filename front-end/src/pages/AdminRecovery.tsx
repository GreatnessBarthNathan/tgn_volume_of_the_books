import { FormEvent, useEffect } from "react"
import { isAxiosError } from "axios"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useRecoverAdminAccount } from "../queries/auth"

function AdminRecovery() {
  const navigate = useNavigate()
  const { mutate, isLoading, isError, error, isSuccess } =
    useRecoverAdminAccount()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    mutate({
      code: String(formData.get("code") || ""),
      username: String(formData.get("username") || ""),
      password: String(formData.get("password") || ""),
    })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Admin credentials recovered. Please sign in.")
      navigate("/admin/login", { replace: true })
    }
    if (isError) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.msg || "Unable to recover admin account"
          : "Unable to recover admin account"
      )
    }
  }, [error, isError, isSuccess, navigate])

  return (
    <main>
      <form className='form-card' onSubmit={handleSubmit}>
        <h1 className='mb-3 text-center text-[var(--primaryColor)] font-semibold'>
          Recover admin account
        </h1>
        <p className='mb-4 text-center'>
          Use the master code to recover the entered username, or an
          admin-issued code to recover the account it belongs to. Other admin
          accounts and their access are not changed.
        </p>
        <label className='block font-semibold' htmlFor='code'>
          Master or admin recovery code
        </label>
        <input
          id='code'
          name='code'
          type='password'
          maxLength={256}
          autoComplete='off'
          required
          className='mb-3 border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
        />
        <label className='block font-semibold' htmlFor='username'>
          Admin username
        </label>
        <input
          id='username'
          name='username'
          minLength={3}
          maxLength={32}
          pattern='[a-zA-Z0-9._-]+'
          autoComplete='username'
          required
          className='mb-3 border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
        />
        <label className='block font-semibold' htmlFor='password'>
          New password (12-128 characters)
        </label>
        <input
          id='password'
          name='password'
          type='password'
          maxLength={128}
          minLength={12}
          autoComplete='new-password'
          required
          className='mb-4 border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
        />
        <button
          type='submit'
          disabled={isLoading}
          className='border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white capitalize disabled:opacity-60'
        >
          {isLoading ? "Recovering..." : "Reset admin credentials"}
        </button>
        <p className='mt-3 text-center'>
          <Link
            to='/admin/login'
            className='text-[var(--primaryColor)] underline'
          >
            Back to admin sign in
          </Link>
        </p>
      </form>
    </main>
  )
}

export default AdminRecovery
