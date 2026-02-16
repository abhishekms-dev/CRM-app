export default function StatusBadge({ status, onChange, editable = false }) {
  const statusConfig = {
    ACTIVE: {
      label: "Active",
      color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800",
      icon: ""
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      icon: ""
    },
    SHELVED: {
      label: "Shelved",
      color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      icon: ""
    },
    PENDING: {
      label: "Pending",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      icon: ""
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800",
      icon: ""
    }
  }

  const currentStatus = statusConfig[status] || statusConfig.ACTIVE

  if (!editable) {
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${currentStatus.color}`}>
        <span>{currentStatus.icon}</span>
        <span>{currentStatus.label}</span>
      </span>
    )
  }

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentStatus.color}`}
      onClick={(e) => e.stopPropagation()}
    >
      {Object.entries(statusConfig).map(([key, config]) => (
        <option key={key} value={key}>
          {config.icon} {config.label}
        </option>
      ))}
    </select>
  )
}