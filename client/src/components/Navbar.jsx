import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Home',     path: '/',       icon: '🏠' },
  { label: 'My Trips', path: '/trips',  icon: '🗺️' },
  { label: 'Profile',  path: '/profile',icon: '👤' },
]

export default function Navbar() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-brand-400 tracking-tight">
          Traveloop
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-brand-400 text-dark'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-1.5">{item.icon}</span>{item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="ml-2 btn-ghost text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
