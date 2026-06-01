'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSolicitudes = async () => {
      const { data } = await supabase
        .from('solicitudes')
        .select('*')
      setSolicitudes(data || [])
      setLoading(false)
    }
    fetchSolicitudes()
  }, [])

  const colorEstatus = (estatus: string) => {
    if (estatus === 'activa') return { bg: '#dcfce7', text: '#16a34a' }
    if (estatus === 'cerrada') return { bg: '#fee2e2', text: '#dc2626' }
    return { bg: '#fef9c3', text: '#ca8a04' }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 text-lg">←</Link>
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-6" />
      </div>

      {/* Título */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-base font-black" style={{color: '#152337'}}>Solicitudes</h1>
        <p className="text-xs text-gray-400 mt-0.5">{solicitudes.length} registradas</p>
      </div>

      {/* Lista */}
      <div className="px-4 flex flex-col gap-2">
        {loading && <p className="text-xs text-gray-400 text-center py-6">Cargando...</p>}

        {!loading && solicitudes.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay solicitudes registradas</p>
        )}

        {solicitudes.map((sol) => {
          const c = colorEstatus(sol.estatus)
          return (
            <div key={sol.id} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold" style={{color: '#9A2120'}}>
                    #{sol.folio}
                  </p>
                  <p className="text-sm font-bold" style={{color: '#152337'}}>
                    {sol.tipo_maquinaria}
                  </p>
                  <p className="text-xs text-gray-400">{sol.ciudad}, {sol.estado}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{backgroundColor: c.bg, color: c.text}}>
                    {sol.estatus || 'pendiente'}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{sol.tipo_solicitud}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between">
                <p className="text-xs text-gray-400">Inicio: {sol.fecha_inicio || 'N/D'}</p>
                <p className="text-xs font-semibold" style={{color: '#152337'}}>${sol.sueldo_pago}</p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}