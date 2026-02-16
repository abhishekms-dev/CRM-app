import { Link, useLocation, useNavigate } from "react-router-dom"
import { Users, LogOut, LayoutDashboard, Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useState, useEffect } from "react"

export default function Navbar({ onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const admin = JSON.parse(localStorage.getItem("admin") || "{}")
  const [customerCount, setCustomerCount] = useState(0)

useEffect(() => {
  const admin = JSON.parse(localStorage.getItem("admin") || "{}")
  if (admin.id) {
    fetch(`http://localhost:8080/api/customers/admin/${admin.id}`)
      .then(res => res.json())
      .then(data => setCustomerCount(data.length))
      .catch(() => setCustomerCount(0))
  }
}, [location])
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    onLogout()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
         <div className="flex items-center">
  <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent" style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.03em' }}>
    CRM
  </span>
</div>

          <div className="flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/dashboard")
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

           <Link
  to="/customers"
  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
    isActive("/customers")
      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
  }`}
>
  <Users className="w-5 h-5" />
  <span>Customers</span>
  {customerCount > 0 && (
    <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-blue-600 dark:bg-blue-500 text-white rounded-full">
      {customerCount}
    </span>
  )}
</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {admin.name?.charAt(0) || "A"}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 font-medium"
            >
              <LogOut className="w-5 h-5" />
              {/* <span>Logout</span> */}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}