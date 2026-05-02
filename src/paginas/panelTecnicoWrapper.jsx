import { useState } from 'react'
import LayoutPrincipal from '../layouts/layoutPrincipal'
import PanelTecnico from './panelTecnico'

export default function PanelTecnicoWrapper() {
  const [vistaActual, setVistaActual] = useState('reportes')

  return (
    <LayoutPrincipal vistaActual={vistaActual} onCambiarVista={setVistaActual}>
      <PanelTecnico />
    </LayoutPrincipal>
  )
}
