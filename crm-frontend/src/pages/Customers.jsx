import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getCustomersByAdmin, deleteCustomer } from "../api/CustomerApi"
import { Plus, Search, Edit2, Trash2, Mail, Phone, Users, ArrowUpDown } from "lucide-react"
import StatusBadge from "../components/StatusBadge"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("name")
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: "" })

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const admin = JSON.parse(localStorage.getItem("admin"))
    if (admin) {
      try {
        const data = await getCustomersByAdmin(admin.id)
        setCustomers(data)
      } catch (error) {
        toast.error("Failed to load customers")
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      
      const matchesStatus = statusFilter === "ALL" || customer.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "email") {
        return a.email.localeCompare(b.email)
      } else if (sortBy === "status") {
        return (a.status || "ACTIVE").localeCompare(b.status || "ACTIVE")
      }
      return 0
    })

  async function handleStatusChange(customerId, newStatus) {
    try {
      const response = await fetch(`http://localhost:8080/api/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        setCustomers(prev =>
          prev.map(c => (c.id === customerId ? { ...c, status: newStatus } : c))
        )
        toast.success("Status updated successfully")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCustomer(id)
      setCustomers(prev => prev.filter(c => c.id !== id))
      setDeleteModal({ show: false, id: null, name: "" })
      toast.success("Customer deleted successfully")
    } catch (error) {
      toast.error("Failed to delete customer")
    }
  }

 

  const statusCounts = {
    ALL: customers.length,
    ACTIVE: customers.filter(c => c.status === "ACTIVE").length,
    PENDING: customers.filter(c => c.status === "PENDING").length,
    COMPLETED: customers.filter(c => c.status === "COMPLETED").length,
    SHELVED: customers.filter(c => c.status === "SHELVED").length,
    CANCELLED: customers.filter(c => c.status === "CANCELLED").length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Customers <span className="text-blue-600 dark:text-blue-400">({customers.length})</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your customer relationships</p>
        </div>
       <Link
  to="/create"
  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
>
  <Plus className="w-5 h-5" />
  <span>Add Customer</span>
</Link>
      </motion.div>

      <motion.div
        className="mb-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "ACTIVE", "PENDING", "COMPLETED", "SHELVED", "CANCELLED"].map((status) => (
            <motion.button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status} ({statusCounts[status]})
            </motion.button>
          ))}
        </div>
      </motion.div>

      {filteredAndSortedCustomers.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence>
            {filteredAndSortedCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/30"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {customer.name.charAt(0).toUpperCase()}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white truncate">{customer.name}</h3>
                      <p className="text-blue-100 text-sm">Customer ID: #{customer.id}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="mb-3">
                    <StatusBadge
                      status={customer.status || "ACTIVE"}
                      onChange={(newStatus) => handleStatusChange(customer.id, newStatus)}
                      editable={true}
                    />
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Email</p>
                      <p className="text-sm truncate">{customer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Phone</p>
                      <p className="text-sm">{customer.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 flex space-x-2">
                  <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={`/edit/${customer.id}`}
                      className="flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2.5 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 font-medium w-full"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                  </motion.div>

                  <motion.button
                    onClick={() => setDeleteModal({ show: true, id: customer.id, name: customer.name })}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2.5 px-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-12 transition-colors duration-300"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <Users className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== "ALL" ? "No customers found" : "No customers yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== "ALL"
                ? "Try adjusting your search or filter"
                : "Get started by adding your first customer"}
            </p>
            {!searchTerm && statusFilter === "ALL" && (
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Customer</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {deleteModal.show && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Delete Customer</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{deleteModal.name}</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setDeleteModal({ show: false, id: null, name: "" })}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(deleteModal.id)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}