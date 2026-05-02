export default function Header({ titulo, usuario }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{titulo}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Bienvenido de nuevo</p>
        </div>
        <div className="flex items-center gap-3 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {usuario?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-none">
              {usuario?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">{usuario?.rol}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
