'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmpresas = async () => {
      const { data } = await supabase
        .from('empresas')
        .select('*')
      setEmpresas(data || [])
      setLoading(false)
    }
    fetchEmpresas()
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
        <h1 className="text-base font-black" style={{color: '#152337'}}>Empresas</h1>
        <p className="text-xs text-gray-400 mt-0.5">{empresas.length} registradas</p>
      </div>

      {/* Lista */}
      <div className="px-4 flex flex-col gap-2">
        {loading && <p className="text-xs text-gray-400 text-center py-6">Cargando...</p>}

        {!loading && empresas.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay empresas registradas</p>
        )}

        {empresas.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{color: '#152337'}}>
                  {emp.nombre_empresa}
                </p>
                <p className="text-xs text-gray-400">{emp.industria}</p>
                <p className="text-xs text-gray-400">{emp.ciudad}, {emp.estado}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{backgroundColor: emp.user_id ? '#dcfce7' : '#fee2e2',
                          color: emp.user_id ? '#16a34a' : '#dc2626'}}>
                  {emp.user_id ? 'Activa' : 'Sin cuenta'}
                </span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between">
              <p className="text-xs text-gray-400">{emp.correo}</p>
              <p className="text-xs text-gray-400">{emp.telefono}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}