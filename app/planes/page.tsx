'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Planes() {
  const [tipo, setTipo] = useState<'empresa' | 'operador'>('empresa')
  const [planes, setPlanes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sesion, setSesion] = useState<any>(null)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('planes').select('*').order('precio')
      setPlanes(data || [])

      const { data: sessionData } = await supabase.auth.getSession()
      setSesion(sessionData.session)
      setLoading(false)
    }
    cargar()
  }, [])

  const planesFiltrados = planes.filter(p => p.tipo === tipo)

  const iconos: Record<string, string> = {
    'por_contacto': '👤',
    'paquete': '👥',
    'mensual': '📅',
    'anual': '🏆',
  }

  const destacado: Record<string, boolean> = {
    'Membresía Mensual': true,
    'Membresía Anual': false,
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-5 border-b border-gray-100 text-center">
        <h1 className="text-xl font-black" style={{color: '#152337'}}>Planes OperLink</h1>
        <p className="text-xs text-gray-400 mt-1">Conecta con los mejores operadores de México</p>
      </div>

      {/* Selector tipo */}
      <div className="px-4 py-4">
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          <button onClick={() => setTipo('empresa')}
            className="flex-1 py-2.5 text-sm font-bold"
            style={{backgroundColor: tipo === 'empresa' ? '#9A2120' : 'white', color: tipo === 'empresa' ? 'white' : '#152337'}}>
            🏢 Soy Empresa
          </button>
          <button onClick={() => setTipo('operador')}
            className="flex-1 py-2.5 text-sm font-bold"
            style={{backgroundColor: tipo === 'operador' ? '#9A2120' : 'white', color: tipo === 'operador' ? 'white' : '#152337'}}>
            👷 Soy Operador
          </button>
        </div>
      </div>

      {/* Comparativo vs Indeed */}
      {tipo === 'empresa' && (
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
            <p className="text-xs font-bold mb-2" style={{color: '#152337'}}>¿Por qué OperLink?</p>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="text-[10px] text-gray-400"></div>
              <div className="text-[10px] font-bold" style={{color: '#9A2120'}}>OperLink</div>
              <div className="text-[10px] text-gray-400">Indeed/OCC</div>

              <div className="text-[10px] text-gray-500 text-left">Especialización</div>
              <div className="text-[10px] font-bold text-green-600">✅ Maquinaria</div>
              <div className="text-[10px] text-red-400">❌ General</div>

              <div className="text-[10px] text-gray-500 text-left">Precio/mes</div>
              <div className="text-[10px] font-bold text-green-600">$1,499</div>
              <div className="text-[10px] text-red-400">$3,500-$8,000</div>

              <div className="text-[10px] text-gray-500 text-left">Contacto directo</div>
              <div className="text-[10px] font-bold text-green-600">✅ Sí</div>
              <div className="text-[10px] text-red-400">❌ No</div>
            </div>
          </div>
        </div>
      )}

      {/* Planes */}
      <div className="px-4 flex flex-col gap-3">
        {loading && <p className="text-xs text-gray-400 text-center py-6">Cargando planes...</p>}

        {planesFiltrados.map((plan) => (
          <div key={plan.id}
            className="bg-white rounded-2xl shadow-sm border overflow-hidden"
            style={{borderColor: destacado[plan.nombre] ? '#9A2120' : '#e5e7eb', borderWidth: destacado[plan.nombre] ? 2 : 1}}>

            {destacado[plan.nombre] && (
              <div className="py-1 text-center text-xs font-bold text-white" style={{backgroundColor: '#9A2120'}}>
                ⭐ MÁS POPULAR
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{iconos[plan.duracion]}</span>
                  <p className="text-sm font-black" style={{color: '#152337'}}>{plan.nombre}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black" style={{color: '#9A2120'}}>${plan.precio.toLocaleString('es-MX')}</p>
                  <p className="text-[10px] text-gray-400">MXN</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">{plan.descripcion}</p>

              {sesion ? (
                <button
                  className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
                  style={{backgroundColor: '#9A2120'}}>
                  Contratar plan
                </button>
              ) : (
                <Link href="/login"
                  className="w-full py-2.5 rounded-xl text-white text-xs font-bold text-center block"
                  style={{backgroundColor: '#9A2120'}}>
                  Iniciar sesión para contratar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}