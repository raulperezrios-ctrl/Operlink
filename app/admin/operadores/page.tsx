'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminOperadores() {
  const [operadores, setOperadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')

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

  const operadoresFiltrados = operadores.filter(op => {
    if (filtro === 'todos') return true
    if (filtro === 'verificados') return op.verificado === true
    if (filtro === 'sin_verificar') return !op.verificado || op.verificado === false || op.verificado === null
    if (filtro === 'activos') return op.disponibilidad === 'disponible'
    if (filtro === 'desactivados') return op.disponibilidad === 'desactivado'
    return true
  })

  const conteos = {
    todos: operadores.length,
    verificados: operadores.filter(o => o.verificado === true).length,
    sin_verificar: operadores.filter(o => !o.verificado || o.verificado === null).length,
    activos: operadores.filter(o => o.disponibilidad === 'disponible').length,
    desactivados: operadores.filter(o => o.disponibilidad === 'desactivado').length,
  }

  const filtros = [
    { id: 'todos', label: 'Todos', count: conteos.todos },
    { id: 'sin_verificar', label: '⏳ Sin verificar', count: conteos.sin_verificar, color: '#ca8a04' },
    { id: 'verificados', label: '✔ Verificados', count: conteos.verificados, color: '#1d4ed8' },
    { id: 'activos', label: '✅ Activos', count: conteos.activos, color: '#16a34a' },
    { id: 'desactivados', label: '🚫 Desactivados', count: conteos.desactivados, color: '#dc2626' },
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
        <h1 className="text-base font-black" style={{color: '#575757'}}>Operadores</h1>
        <p className="text-xs text-gray-400 mt-0.5">{operadoresFiltrados.length} de {operadores.length} registrados</p>
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

        {!loading && operadoresFiltrados.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay operadores en este filtro</p>
        )}

        {operadoresFiltrados.map((op) => (
          <div key={op.id} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold" style={{color: '#575757'}}>
                    {op.nombre} {op.apellido}
                  </p>
                  {op.verificado ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{backgroundColor: '#dbeafe', color: '#1d4ed8'}}>✔ Verificado</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{backgroundColor: '#fef9c3', color: '#ca8a04'}}>⏳ Sin verificar</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{op.tipo_operador}</p>
                <p className="text-xs text-gray-400">📍 {op.ciudad}, {op.estado}</p>
                <p className="text-xs text-gray-400">{op.correo}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: op.disponibilidad === 'disponible' ? '#dcfce7' : op.disponibilidad === 'desactivado' ? '#fee2e2' : '#f3f4f6',
                    color: op.disponibilidad === 'disponible' ? '#16a34a' : op.disponibilidad === 'desactivado' ? '#dc2626' : '#6b7280'
                  }}>
                  {op.disponibilidad === 'disponible' ? '✅ Activo' : op.disponibilidad === 'desactivado' ? '🚫 Desactivado' : '⏸ ' + (op.disponibilidad || 'N/D')}
                </span>
                <p className="text-[10px] text-gray-400">{op.experiencia_anos} años exp.</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-50 flex justify-end">
              <a href={`/admin/operadores/detalle?id=${op.id}`}
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