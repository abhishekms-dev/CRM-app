import { Link } from "react-router-dom"
import React from "react"

function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold">CRM</h1>
      <div className="space-x-6">
        <Link to="/">Dashboard</Link>
        <Link to="/customers">Customers</Link>
      </div>
    </nav>
  )
}

export default Navbar
