import { useEffect, useState } from "react"
import { Users, CheckCircle, Clock, Archive, Activity } from "lucide-react"
import { getCustomersByAdmin } from "../api/CustomerApi"
import StatusBadge from "../components/StatusBadge"
import { motion } from "framer-motion"

function CountUpAnimation({ end, duration = 1000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = (currentTime - startTime) / duration

      if (progress < 1) {
        setCount(Math.floor(end * progress))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}</span>
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"))
    if (admin) {
      getCustomersByAdmin(admin.id)
        .then(data => {
          setCustomers(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [])

  const activeCustomers = customers.filter(c => c.status === "ACTIVE").length
  const completedCustomers = customers.filter(c => c.status === "COMPLETED").length
  const pendingCustomers = customers.filter(c => c.status === "PENDING").length
  const shelvedCustomers = customers.filter(c => c.status === "SHELVED").length

  const stats = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Active Projects",
      value: activeCustomers,
      icon: Activity,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Completed",
      value: completedCustomers,
      icon: CheckCircle,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Pending",
      value: pendingCustomers,
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400"
    }
  ]

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
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your customer relationship management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className={`p-3 rounded-lg ${stat.bgColor}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </motion.div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${stat.bgColor} ${stat.textColor}`}>
                  Live
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                <CountUpAnimation end={stat.value} />
              </p>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
          </motion.div>
        ))}
      </div>

      {shelvedCustomers > 0 && (
        <motion.div
          className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Archive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            You have <span className="font-semibold">{shelvedCustomers}</span> shelved project{shelvedCustomers !== 1 ? 's' : ''}.
          </p>
        </motion.div>
      )}

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Customers</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your latest customer additions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.slice(0, 5).map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={customer.status || "ACTIVE"} editable={false} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {customers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No customers yet. Add your first customer to get started!</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Active Projects", value: activeCustomers, icon: Activity, gradient: "from-green-500 to-emerald-600", desc: "Currently in progress" },
          { title: "Completed", value: completedCustomers, icon: CheckCircle, gradient: "from-blue-500 to-indigo-600", desc: "Successfully finished" },
          { title: "Pending", value: pendingCustomers, icon: Clock, gradient: "from-purple-500 to-pink-600", desc: "Awaiting approval" }
        ].map((item, index) => (
          <motion.div
            key={index}
            className={`bg-gradient-to-br ${item.gradient} rounded-xl p-6 text-white shadow-lg`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <item.icon className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">
                <CountUpAnimation end={item.value} />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-white/80 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}