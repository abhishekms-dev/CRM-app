
import React from "react"
function CustomerTable({ customers }) {
  return (
    <table className="w-full bg-white shadow">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2">ID</th>
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Company</th>
        </tr>
      </thead>
      <tbody>
        {customers.map(c => (
          <tr key={c.id} className="border-t">
            <td className="p-2">{c.id}</td>
            <td className="p-2">{c.name}</td>
            <td className="p-2">{c.email}</td>
            <td className="p-2">{c.company}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerTable

