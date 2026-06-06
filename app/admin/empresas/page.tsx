'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todas')

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

  const empresasFiltradas = empresas.filter(emp => {
    if (filtro === 'todas') return true
    if (filtro === 'con_membresia') return emp.membresia_activa === true
    if (filtro === 'sin_membresia') return !emp.membresia_activa
    if (filtro === 'sin_cuenta') return !emp.user_id
    return true
  })

  const conteos = {
    todas: empresas.length,
    con_membresia: empresas.filter(e => e.membresia_activa === true).length,
    sin_membresia: empresas.filter(e => !e.membresia_activa && e.user_id).length,
    sin_cuenta: empresas.filter(e => !e.user_id).length,
  }

  const filtros = [
    { id: 'todas', label: 'Todas', count: conteos.todas },
    { id: 'con_membresia', label: '💳 Con membresía', count: conteos.con_membresia, color: '#16a34a' },
    { id: 'sin_membresia', label: '⏳ Sin membresía', count: conteos.sin_membresia, color: '#ca8a04' },
    { id: 'sin_cuenta', label: '❌ Sin cuenta', count: conteos.sin_cuenta, color: '#dc2626' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 text-lg">←</Link>
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-6" />
      </div>

      {/* Título */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-base font-black" style={{color: '#575757'}}>Empresas</h1>
        <p className="text-xs text-gray-400 mt-0.5">{empresasFiltradas.length} de {empresas.length} registradas</p>
      </div>

      {/* Filtros */}
      <div className="px-4 mb-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {filtros.map((f) => (
            <button key={f.id} onClick={() => setFiltro(f.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap"
              style={filtro === f.id
                ? {backgroundColor: f.color || '#9A2120', color: 'white', borderColor: f.color || '#9A2120'}
                : {backgroundColor: 'white', color: '#575757', borderColor: '#e5e7eb'}}>
              {f.label}
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={filtro === f.id
                  ? {backgroundColor: 'rgba(255,255,255,0.3)'}
                  : {backgroundColor: '#f3f4f6'}}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 flex flex-col gap-2">
        {loading && <p className="text-xs text-gray-400 text-center py-6">Cargando...</p>}

        {!loading && empresasFiltradas.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay empresas en este filtro</p>
        )}

        {empresasFiltradas.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold" style={{color: '#575757'}}>{emp.nombre_empresa}</p>
                <p className="text-xs text-gray-400">{emp.industria}</p>
                <p className="text-xs text-gray-400">📍 {emp.ciudad}, {emp.estado}</p>
                <p className="text-xs text-gray-400">{emp.correo}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: emp.membresia_activa ? '#dcfce7' : '#fef9c3',
                    color: emp.membresia_activa ? '#16a34a' : '#ca8a04'
                  }}>
                  {emp.membresia_activa ? '💳 Con membresía' : '⏳ Sin membresía'}
                </span>
                {emp.membresia_activa && (
                  <span className="text-[10px] text-gray-400">
                    {emp.contactos_disponibles === 9999 ? '∞ Ilimitados' : `${emp.contactos_disponibles} contactos`}
                  </span>
                )}
                {!emp.user_id && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{backgroundColor: '#fee2e2', color: '#dc2626'}}>
                    ❌ Sin cuenta
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">{emp.telefono}</p>
              <a href={`/admin/empresas/detalle?id=${emp.id}`}
                className="text-xs px-3 py-1.5 rounded-full font-semibold text-white"
                style={{backgroundColor: '#9A2120'}}>
                Ver detalle →
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}