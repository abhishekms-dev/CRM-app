import { useEffect, useState } from "react"
import { getCustomers, addCustomer } from "../api/CustomerApi"
import CustomerTable from "../components/CustomerTable"
import React from "react"

function Customers() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ name: "", email: "", company: "" })

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const data = await getCustomers()
    setCustomers(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await addCustomer(form)
    setForm({ name: "", email: "", company: "" })
    loadCustomers()
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Customers</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <input className="border p-2" placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input className="border p-2" placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input className="border p-2" placeholder="Company"
          value={form.company}
          onChange={e => setForm({ ...form, company: e.target.value })}
        />
        <button className="bg-indigo-600 text-white px-4">Add</button>
      </form>

      <CustomerTable customers={customers} />
    </div>
  )
}

export default Customers
