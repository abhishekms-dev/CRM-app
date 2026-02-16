const BASE_URL = "http://localhost:8080/api/customers"

export async function getCustomersByAdmin(adminId) {
  const res = await fetch(`${BASE_URL}/admin/${adminId}`)
  return res.json()
}

export async function addCustomer(customer, adminId) {
  const res = await fetch(`${BASE_URL}/admin/${adminId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer)
  })
  return res.json()
}

export async function updateCustomer(id, customer) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer)
  })
  return res.json()
}

export async function updateCustomerStatus(id, status) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
  return res.json()
}

export async function deleteCustomer(id) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
}