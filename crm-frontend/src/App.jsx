import { Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import AdminLogin from "./pages/AdminLogin"
import Customers from "./pages/Customers"
import CreateCustomer from "./pages/CreateCustomer"
import EditCustomer from "./pages/EditCustomer"
import Dashboard from "./pages/Dashboard"

function PrivateRoute({ children }) {
  const admin = localStorage.getItem("admin")
  return admin ? children : <Navigate to="/" />
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const admin = localStorage.getItem("admin")
    setIsAuthenticated(!!admin)
  }, [])

  const handleLogin = () => setIsAuthenticated(true)
  const handleLogout = () => {
    localStorage.removeItem("admin")
    localStorage.removeItem("adminId")
    setIsAuthenticated(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<AdminLogin onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateCustomer />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditCustomer />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  )
}