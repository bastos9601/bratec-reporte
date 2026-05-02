import { useState } from 'react'
import LayoutPrincipal from '../layouts/layoutPrincipal'
import PanelAdmin from './panelAdmin'

export default function PanelAdminWrapper() {
  const [vistaActual, setVistaActual] = useState('reportes')

  return (
    <LayoutPrincipal vistaActual={vistaActual} onCambiarVista={setVistaActual}>
      <PanelAdmin vistaActual={vistaActual} setVistaActual={setVistaActual} />
    </LayoutPrincipal>
  )
}
