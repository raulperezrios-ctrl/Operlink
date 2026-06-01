'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const fotosAleatorias = [
  '/Operador_MAquinaria.png',
  '/Operador_Montacargas1.png',
  '/Operador_Tractocamion.png',
  '/Operador_Montacargas2.png',
]

export default function Operadores() {
  const [operadores, setOperadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')

  useEffect(() => {
    const cargarOperadores = async () => {
      const { data } = await supabase
        .from('operadores')
        .select('*')
        .eq('disponibilidad', 'disponible')
      
      if (data) setOperadores(data)
      setLoading(false)
    }
    cargarOperadores()
  }, [])

  const operadoresFiltrados = filtro === 'Todos' 
    ? operadores 
    : operadores.filter(op => {
        if (filtro === 'Maquinaria') return op.tipo_operador === 'Construcción'
        if (filtro === 'Logística') return op.tipo_operador === 'Almacén / Logística'
        if (filtro === 'Transporte') return op.tipo_operador === 'Transporte'
        return true
      })

  return (
    <div className="bg-gray-50 pb-6">

      {/* Filtros */}
      <section className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Todos', 'Maquinaria', 'Transporte', 'Logística'].map((f, i) => (
            <button key={i} onClick={() => setFiltro(f)}
              className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold border"
              style={filtro === f ? {backgroundColor: '#9A2120', color: 'white', borderColor: '#9A2120'} : {backgroundColor: 'white', color: '#152337', borderColor: '#e5e7eb'}}>
              {f}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <input type="text" placeholder="🔍 Buscar por ciudad o maquinaria..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs" />
          <button className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold" style={{color: '#152337'}}>
            Filtros
          </button>
        </div>
      </section>

      {/* Lista de operadores */}
      <section className="px-4 mt-4">

        {loading ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">Cargando operadores...</p>
          </div>
        ) : operadoresFiltrados.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No hay operadores disponibles aún.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">{operadoresFiltrados.length} operadores disponibles</p>
            <div className="grid grid-cols-2 gap-3">
              {operadoresFiltrados.map((op, i) => (
                <div key={op.id} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                  <div className="relative h-36">
                    <img 
                      src={fotosAleatorias[i % fotosAleatorias.length]} 
                      alt="Operador" 
                      className="w-full h-full object-cover object-top" 
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 rounded-full px-2 py-0.5 text-white text-[9px] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block"></span>
                      Disponible
                    </div>
                    <div className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{backgroundColor: '#9A2120'}}>
                      {op.tipo_operador}
                    </div>
                  </div>
                  <div className="p-3">
                    <span className="text-[11px] font-bold" style={{color: '#9A2120'}}>{op.tipo_operador}</span>
                    <p className="text-xs font-semibold mt-0.5" style={{color: '#152337'}}>Operador disponible</p>
                    <p className="text-[10px] text-gray-500 mt-1">📍 {op.ciudad}, {op.estado}</p>
                    <p className="text-[10px] text-gray-500">📅 {op.experiencia_anos} años exp.</p>
                    <a href={`/operadores/detalle?id=${op.id}`} className="mt-2 w-full border rounded-xl py-1.5 text-[11px] font-semibold text-center block" style={{borderColor: '#9A2120', color: '#9A2120'}}>
                      Ver perfil
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

    </div>
  );
}