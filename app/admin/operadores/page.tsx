'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminOperadores() {
  const [operadores, setOperadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOperadores = async () => {
      const { data } = await supabase
        .from('operadores')
        .select('*')
      setOperadores(data || [])
      setLoading(false)
    }
    fetchOperadores()
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 text-lg">←</Link>
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-6" />
      </div>

      {/* Título */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-base font-black" style={{color: '#575757'}}>Operadores</h1>
        <p className="text-xs text-gray-400 mt-0.5">{operadores.length} registrados</p>
      </div>

      {/* Lista */}
      <div className="px-4 flex flex-col gap-2">
        {loading && <p className="text-xs text-gray-400 text-center py-6">Cargando...</p>}

        {!loading && operadores.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay operadores registrados</p>
        )}

        {operadores.map((op) => (
          <div key={op.id} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{color: '#575757'}}>
                  {op.nombre} {op.apellido}
                </p>
                <p className="text-xs text-gray-400">{op.tipo_operador}</p>
                <p className="text-xs text-gray-400">{op.ciudad}, {op.estado}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: op.disponibilidad === 'disponible' ? '#dcfce7' : '#fee2e2',
                    color: op.disponibilidad === 'disponible' ? '#16a34a' : '#dc2626'
                  }}>
                  {op.disponibilidad === 'desactivado' ? '🚫 Desactivado' : op.disponibilidad || 'N/D'}
                </span>
                <p className="text-xs text-gray-400 mt-1">{op.experiencia_anos} años exp.</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">{op.correo}</p>
              <div className="flex items-center gap-2">
                {op.verificado && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{backgroundColor: '#dbeafe', color: '#1d4ed8'}}>✔ Verificado</span>
                )}
                <a href={`/admin/operadores/detalle?id=${op.id}`}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold text-white"
                  style={{backgroundColor: '#9A2120'}}>
                  Ver detalle
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}