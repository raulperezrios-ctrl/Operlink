'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

function PagoContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sesion, setSesion] = useState<any>(null)
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [tarjeta, setTarjeta] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      if (!planId) return

      const { data: planData } = await supabase
        .from('planes')
        .select('*')
        .eq('id', planId)
        .single()
      setPlan(planData)

      const { data: sessionData } = await supabase.auth.getSession()
      setSesion(sessionData.session)
      if (sessionData.session?.user?.email) {
        setCorreo(sessionData.session.user.email)
      }

      setLoading(false)
    }
    cargar()
  }, [planId])

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!plan) return <div className="text-center py-20 text-sm text-gray-400">Plan no encontrado</div>
  if (!sesion) {
    window.location.href = `/login?redirect=/pago&plan=${planId}`
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/planes" className="text-gray-400 text-lg">←</a>
        <h1 className="text-base font-black" style={{color: '#152337'}}>Checkout</h1>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Resumen del plan */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Plan seleccionado</p>
          <p className="text-base font-black" style={{color: '#152337'}}>{plan.nombre}</p>
          <p className="text-xs text-gray-400 mb-2">{plan.descripcion}</p>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">Total a pagar</p>
            <p className="text-xl font-black" style={{color: '#9A2120'}}>${plan.precio.toLocaleString('es-MX')} MXN</p>
          </div>
        </div>

        {/* Formulario de pago */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#152337'}}>💳 Datos de pago</h2>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Nombre en la tarjeta</label>
              <input type="text" placeholder="Como aparece en tu tarjeta" value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Correo electrónico</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Número de tarjeta</label>
              <input type="text" placeholder="0000 0000 0000 0000" value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value.replace(/\D/g, '').slice(0, 16))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Vencimiento</label>
                <input type="text" placeholder="MM/AA" value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>CVC</label>
                <input type="text" placeholder="123" value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}

          <button
            onClick={() => alert('Pago con Conekta próximamente')}
            disabled={procesando}
            className="w-full py-3 rounded-xl text-white font-bold text-sm mt-4"
            style={{backgroundColor: '#9A2120', opacity: procesando ? 0.7 : 1}}>
            {procesando ? 'Procesando...' : `Pagar $${plan.precio.toLocaleString('es-MX')} MXN`}
          </button>

          <p className="text-[10px] text-gray-400 text-center mt-2">🔒 Pago seguro con Conekta</p>
        </div>

      </div>
    </div>
  )
}

export default function Pago() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-gray-400">Cargando...</div>}>
      <PagoContent />
    </Suspense>
  )
}