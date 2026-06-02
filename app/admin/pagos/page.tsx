'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminPagos() {
  const [pagos, setPagos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPagos = async () => {
      const { data } = await supabase
        .from('pagos')
        .select('*')
      setPagos(data || [])
      setLoading(false)
    }
    fetchPagos()
  }, [])

  const colorEstatus = (estatus: string) => {
    if (estatus === 'completado') return { bg: '#dcfce7', text: '#16a34a' }
    if (estatus === 'fallido') return { bg: '#fee2e2', text: '#dc2626' }
    return { bg: '#fef9c3', text: '#ca8a04' }
  }

  const total = pagos
    .filter(p => p.estatus === 'completado')
    .reduce((sum, p) => sum + (p.monto || 0), 0)

  return (
    <div className="bg-gray-50 min-h-screen pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 text-lg">←</Link>
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-6" />
      </div>

      {/* Título */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-base font-black" style={{color: '#575757'}}>Pagos</h1>
        <p className="text-xs text-gray-400 mt-0.5">{pagos.length} transacciones</p>
      </div>

      {/* Total */}
      <div className="px-4 mb-3">
        <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
          <p className="text-xs text-gray-400">Total recaudado</p>
          <p className="text-2xl font-black mt-1" style={{color: '#9A2120'}}>
            ${total.toLocaleString('es-MX')} MXN
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 flex flex-col gap-2">
        {loading && <p className="text-xs text-gray-400 text-center py-6">Cargando...</p>}

        {!loading && pagos.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay pagos registrados</p>
        )}

        {pagos.map((pago) => {
          const c = colorEstatus(pago.estatus)
          return (
            <div key={pago.id} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{color: '#575757'}}>
                    {pago.concepto}
                  </p>
                  <p className="text-xs text-gray-400">{pago.comprador_tipo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black" style={{color: '#9A2120'}}>
                    ${pago.monto?.toLocaleString('es-MX')}
                  </p>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{backgroundColor: c.bg, color: c.text}}>
                    {pago.estatus || 'pendiente'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}