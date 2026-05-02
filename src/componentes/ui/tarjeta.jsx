export default function Tarjeta({ children, className = '', hover = false }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-200 ${hover ? 'hover:shadow-lg hover:border-gray-300 hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </div>
  )
}
