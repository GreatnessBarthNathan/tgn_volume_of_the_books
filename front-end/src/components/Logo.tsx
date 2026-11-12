import { Link } from "react-router-dom"

function Logo() {
  return (
    <Link to='/' className='brand-lockup' aria-label='The Volume of the Books home'>
      <span className='brand-mark'>
        <img src='/tgn_logo.png' alt='' />
      </span>
      <span className='brand-copy'>
        <span className='brand-name'>The Volume of the Books</span>
        <span className='brand-caption'>A living archive</span>
      </span>
    </Link>
  )
}

export default Logo
