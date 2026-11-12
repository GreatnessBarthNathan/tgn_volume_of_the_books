import { Navigate, useLocation } from "react-router-dom"
import { isAxiosError } from "axios"
import Loading from "./Loading"
import { useAdminSession } from "../queries/auth"

function AdminRoute({ children }: { children: JSX.Element }) {
  const location = useLocation()
  const { data: admin, isLoading, isError, error } = useAdminSession()

  if (isLoading) return <Loading />
  if (
    isError &&
    (!isAxiosError(error) || error.response?.status !== 401)
  ) {
    return (
      <p className='mt-10 text-center text-[var(--primaryText)]'>
        Unable to verify administrator access. Please try again later.
      </p>
    )
  }
  if (isError || !admin) {
    return <Navigate to='/admin/login' state={{ from: location }} replace />
  }
  return children
}

export default AdminRoute
