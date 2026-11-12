import { Link, useRouteError } from "react-router-dom"

function Error() {
  const error = useRouteError()

  // Narrowing the type of `error`
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: number }).status

    if (status === 404) {
      return (
        <div className='empty-state'>
          <div className='m-auto max-w-[360px]'>
            <img className='mx-auto mb-5 w-36' src='/error_img.svg' alt='' />
            <h2 className='section-title'>Page not found</h2>
            <p className='mt-3 text-[var(--primaryText)]'>
              Seems you are looking for the wrong page
            </p>
            <Link to='/' className='nav-link nav-link-primary mt-5'>
              Back to the archive
            </Link>
          </div>
        </div>
      )
    }
  }

  return (
    <div className='error-state'>
      <h1 className='section-title'>Something went wrong</h1>
      <p className='mt-3'>Please return to the archive and try again.</p>
      <Link to='/' className='nav-link nav-link-primary mt-5'>
        Back to the archive
      </Link>
    </div>
  )
}

export default Error
