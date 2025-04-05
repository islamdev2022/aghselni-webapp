import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  message: string
}

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex h-40 flex-col items-center justify-center space-y-2">
      {icon}
      <p className="text-gray-500">{message}</p>
    </div>
  )
}