import { Link, NavLink } from "react-router-dom"
import { isAxiosError } from "axios"
import { toast } from "react-toastify"
import { useAdminSession, useLogoutAdmin } from "../queries/auth"
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi"

type NavbarProps = {
  theme: "light" | "dark"
  onToggleTheme: () => void
}

function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const { data: admin } = useAdminSession()
  const { mutate, isLoading } = useLogoutAdmin()

  return (
    <nav className='navbar' aria-label='Main navigation'>
      <div className='nav-links'>
        <NavLink
          to='/'
          end
          className={({ isActive }) =>
            `nav-link${isActive ? " nav-link-active" : ""}`
          }
        >
          Explore
        </NavLink>
        {admin ? (
          <>
            <NavLink to='/create-book' className='nav-link nav-link-primary'>
              Add entry
            </NavLink>
            <NavLink to='/create-chapter' className='nav-link'>
              New chapter
            </NavLink>
            <NavLink to='/create-verse' className='nav-link'>
              New verse
            </NavLink>
            <NavLink to='/admin/accounts' className='nav-link'>
              Admins
            </NavLink>
            <button
              type='button'
              disabled={isLoading}
              onClick={() =>
                mutate(undefined, {
                  onError: (error) =>
                    toast.error(
                      isAxiosError(error)
                        ? error.response?.data?.msg || "Unable to sign out"
                        : "Unable to sign out"
                    ),
                })
              }
              className='signout-button disabled:opacity-60'
            >
              <FiLogOut aria-hidden='true' />
              <span className='admin-label'>{admin.username}</span>
            </button>
          </>
        ) : (
          <Link to='/admin/login' className='nav-link'>
            Admin sign in
          </Link>
        )}
      </div>
      <button
        type='button'
        className='theme-toggle'
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <FiMoon aria-hidden='true' />
        ) : (
          <FiSun aria-hidden='true' />
        )}
        <span>{theme === "light" ? "Dark" : "Light"}</span>
      </button>
    </nav>
  )
}

export default Navbar
