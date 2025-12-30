import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} border-4 border-school-grey-200 border-t-university-red rounded-full`}
      />
      {message && (
        <p className="mt-4 text-school-grey-500 text-sm">{message}</p>
      )}
    </div>
  )
}
