'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data } = await supabase
        .from('usuarios')
        .select('*')
      setUsuarios(data || [])
      setLoading(false)
    }
    fetchUsuarios()
  }, [])

  const colorTipo = (tipo: string) => {
    if (tipo === 'operador') return { bg: '#dbeafe', text: '#1d4ed8' }
    if (tipo === 'empresa') return { bg: '#fef9c3', text: '#ca8a04' }
    if (tipo === 'admin') return { bg: '#fee2e2', text: '#dc2626' }
    return { bg: '#f3f4f6', text: '#6b7280' }
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
        <h1 className="text-base font-black" style={{color: '#575757'}}>Usuarios</h1>
        <p className="text-xs text-gray-400 mt-0.5">{usuarios.length} registrados</p>
      </div>

      {/* Lista */}
      <div className="px-4 flex flex-col gap-2">
        {loading && <p className="text-xs text-gray-400 text-center py-6">Cargando...</p>}

        {!loading && usuarios.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay usuarios registrados</p>
        )}

        {usuarios.map((us) => {
          const c = colorTipo(us.tipo)
          return (
            <div key={us.id} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{color: '#575757'}}>
                    {us.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ID: {us.id?.slice(0, 8)}...
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{backgroundColor: c.bg, color: c.text}}>
                  {us.tipo || 'N/D'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}