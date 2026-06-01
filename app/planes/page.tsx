'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="px-4 py-6 text-center bg-white border-b border-gray-100">
        <h1 className="text-xl font-black" style={{color: '#152337'}}>Planes OperLink</h1>
        <p className="text-xs text-gray-400 mt-1">Conecta con los mejores operadores de México</p>

        {/* Selector */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mt-4 mx-auto max-w-xs">
          <button onClick={() => setTipo('empresa')}
            className="flex-1 py-2 text-xs font-bold"
            style={{backgroundColor: tipo === 'empresa' ? '#9A2120' : 'white', color: tipo === 'empresa' ? 'white' : '#152337'}}>
            🏢 Empresa
          </button>
          <button onClick={() => setTipo('operador')}
            className="flex-1 py-2 text-xs font-bold"
            style={{backgroundColor: tipo === 'operador' ? '#9A2120' : 'white', color: tipo === 'operador' ? 'white' : '#152337'}}>
            👷 Operador
          </button>
        </div>
      </div>

      {/* Planes en grid horizontal */}
      <div className="px-3 py-4 overflow-x-auto">
        <div className="flex gap-3 min-w-max mx-auto">
          {loading && <p className="text-xs text-gray-400 py-6">Cargando...</p>}

          {planesFiltrados.map((plan) => {
            const esPopular = plan.nombre === 'Membresía Mensual'
            return (
              <div key={plan.id}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  width: '160px',
                  border: esPopular ? '2px solid #9A2120' : '1px solid #e5e7eb',
                  backgroundColor: esPopular ? '#fff5f5' : 'white',
                  boxShadow: esPopular ? '0 4px 20px rgba(154,33,32,0.15)' : '0 1px 4px rgba(0,0,0,0.06)'
                }}>

                {esPopular && (
                  <div className="py-1 text-center text-[10px] font-bold text-white" style={{backgroundColor: '#9A2120'}}>
                    ⭐ MÁS POPULAR
                  </div>
                )}

                <div className="p-3 flex flex-col flex-1">
                  <p className="text-xs font-black mb-1" style={{color: '#152337'}}>{plan.nombre}</p>
                  <p className="text-[10px] text-gray-400 mb-3">{plan.descripcion}</p>

                  <div className="mb-3">
                    <span className="text-2xl font-black" style={{color: '#9A2120'}}>${plan.precio.toLocaleString('es-MX')}</span>
                    <span className="text-[10px] text-gray-400 ml-1">MXN</span>
                    {plan.duracion === 'mensual' && <p className="text-[10px] text-gray-400">por mes</p>}
                    {plan.duracion === 'anual' && <p className="text-[10px] text-gray-400">por año</p>}
                  </div>

                  {/* Features */}
                  <div className="flex flex-col gap-1 mb-4 flex-1">
                    {plan.duracion === 'por_contacto' && <p className="text-[10px] text-gray-500">✅ {plan.contactos} contacto</p>}
                    {plan.duracion === 'paquete' && <p className="text-[10px] text-gray-500">✅ {plan.contactos} contactos</p>}
                    {(plan.duracion === 'mensual' || plan.duracion === 'anual') && (
                      <>
                        <p className="text-[10px] text-gray-500">✅ Contactos ilimitados</p>
                        <p className="text-[10px] text-gray-500">✅ Soporte prioritario</p>
                        {plan.duracion === 'anual' && <p className="text-[10px] text-green-600">✅ 2 meses gratis</p>}
                      </>
                    )}
                  </div>

                  {sesion ? (
                    <a href={`/pago?plan=${plan.id}`}
                      className="w-full py-2 rounded-xl text-white text-[11px] font-bold text-center block mt-auto"
                      style={{backgroundColor: esPopular ? '#9A2120' : '#6b7280'}}>
                      Contratar
                    </a>
                  ) : (
                    <a href={`/login?redirect=/pago&plan=${plan.id}`}
                      className="w-full py-2 rounded-xl text-white text-[11px] font-bold text-center block mt-auto"
                      style={{backgroundColor: esPopular ? '#9A2120' : '#6b7280'}}>
                      Contratar
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Comparativo */}
      {tipo === 'empresa' && (
        <div className="px-4 mt-2">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs font-black mb-3" style={{color: '#152337'}}>¿Por qué OperLink vs Indeed/OCC?</p>
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

              <div className="text-[10px] text-gray-500 text-left">Solo maquinaria</div>
              <div className="text-[10px] font-bold text-green-600">✅ Sí</div>
              <div className="text-[10px] text-red-400">❌ No</div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}