export default function Modal({ isOpen, onClose, titulo, children, tamañoGrande = false }) {
  console.log('📦 Modal render', { isOpen })
  
  if (!isOpen) return null

  const handleBackdropMouseDown = (e) => {
    console.log('👆 Backdrop mouseDown', { target: e.target.className })
    // Solo cerrar si se hace mouseDown directamente en el contenedor principal
    if (e.target.classList.contains('modal-backdrop')) {
      console.log('✅ Cerrando modal por backdrop')
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div 
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onMouseDown={handleBackdropMouseDown}
    >
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto ${tamañoGrande ? 'max-w-5xl' : 'max-w-md'}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="text-xl font-bold text-gray-900">{titulo}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
