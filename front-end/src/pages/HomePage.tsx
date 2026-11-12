import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Logo from "../components/Logo"

function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = window.localStorage.getItem("volume-theme")
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("volume-theme", theme)
  }, [theme])

  return (
    <div className='app-shell'>
      <header className='site-header'>
        <Logo />
        <Navbar
          theme={theme}
          onToggleTheme={() =>
            setTheme((currentTheme) =>
              currentTheme === "light" ? "dark" : "light"
            )
          }
        />
      </header>
      <main className='main-content'>
        <Outlet />
      </main>
      <footer className='page-footer'>
        <span>The Extraordinary People of Exploits Led By The Spirit</span>
      </footer>
    </div>
  )
}

export default HomePage
