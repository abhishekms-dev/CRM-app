
import React from "react"
const BASE_URL = "http://localhost:8080/api/customers"

export async function getCustomers() {
  const response = await fetch(BASE_URL)
  return response.json()
}

export async function addCustomer(customer) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer)
  })
  return response.json()
}
