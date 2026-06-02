'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

declare global {
  interface Window {
    Conekta: any
  }
}

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
  const [exito, setExito] = useState(false)
  const [conektaListo, setConektaListo] = useState(false)

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

    const verificarConekta = setInterval(() => {
      if (window.Conekta) {
        window.Conekta.setPublicKey('key_B67CMqaqhbTVDKZ7mZOHntj')
        setConektaListo(true)
        clearInterval(verificarConekta)
      }
    }, 300)

    return () => clearInterval(verificarConekta)
  }, [planId])

  const handlePagar = async () => {
    if (!nombre || !tarjeta || !expiry || !cvc) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!conektaListo) {
      setError('Sistema de pago cargando, intenta de nuevo')
      return
    }

    const [expMes, expAnio] = expiry.split('/')
    if (!expMes || !expAnio) {
      setError('Formato de vencimiento inválido. Usa MM/AA')
      return
    }

    setProcesando(true)
    setError('')

    // Nuevo formato de Conekta con objeto único
    window.Conekta.token.create(
      {
        card: {
          number: tarjeta.replace(/\s/g, ''),
          name: nombre,
          exp_year: `20${expAnio.trim()}`,
          exp_month: expMes.trim(),
          cvc: cvc,
        }
      },
      async (token: any) => {
        try {
          const res = await fetch('/api/pago', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planId,
              userId: sesion?.user?.id,
              nombre,
              correo,
              tokenId: token.id,
            })
          })

          const data = await res.json()

          if (!res.ok) {
            setError(data.error || 'Error al procesar el pago')
            setProcesando(false)
            return
          }

          setExito(true)

        } catch (err: any) {
          setError('Error de conexión. Intenta de nuevo.')
          setProcesando(false)
        }
      },
      (err: any) => {
        setError(err.message_to_purchaser || 'Error al procesar la tarjeta')
        setProcesando(false)
      }
    )
  }

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!plan) return <div className="text-center py-20 text-sm text-gray-400">Plan no encontrado</div>
  if (!sesion) {
    window.location.href = `/login?redirect=/pago&plan=${planId}`
    return null
  }

  if (exito) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-xl font-black mb-2" style={{color: '#575757'}}>¡Pago exitoso!</h1>
      <p className="text-sm text-gray-500 mb-6">Tu plan <strong>{plan.nombre}</strong> está activo. Ya puedes ver los contactos de los operadores.</p>
      <a href="/operadores" className="py-3 px-8 rounded-xl text-white font-bold text-sm" style={{backgroundColor: '#9A2120'}}>
        Ver operadores
      </a>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/planes" className="text-gray-400 text-lg">←</a>
        <h1 className="text-base font-black" style={{color: '#575757'}}>Checkout</h1>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">

        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Plan seleccionado</p>
          <p className="text-base font-black" style={{color: '#575757'}}>{plan.nombre}</p>
          <p className="text-xs text-gray-400 mb-2">{plan.descripcion}</p>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">Total a pagar</p>
            <p className="text-xl font-black" style={{color: '#9A2120'}}>${plan.precio.toLocaleString('es-MX')} MXN</p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
          <p className="text-xs font-bold text-yellow-800 mb-1">🧪 Modo pruebas — usa esta tarjeta:</p>
          <p className="text-xs text-yellow-700">Número: <strong>4111 1111 1111 1111</strong></p>
          <p className="text-xs text-yellow-700">Vencimiento: <strong>12/25</strong> — CVC: <strong>123</strong></p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>💳 Datos de pago</h2>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Nombre en la tarjeta</label>
              <input type="text" placeholder="Como aparece en tu tarjeta" value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Correo electrónico</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Número de tarjeta</label>
              <input type="text" placeholder="4111 1111 1111 1111" value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value.replace(/\D/g, '').slice(0, 16))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Vencimiento</label>
                <input type="text" placeholder="MM/AA" value={expiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                    if (val.length >= 3) val = val.slice(0,2) + '/' + val.slice(2)
                    setExpiry(val)
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>CVC</label>
                <input type="text" placeholder="123" value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}

          <button
            onClick={handlePagar}
            disabled={procesando || !conektaListo}
            className="w-full py-3 rounded-xl text-white font-bold text-sm mt-4"
            style={{backgroundColor: '#9A2120', opacity: (procesando || !conektaListo) ? 0.7 : 1}}>
            {procesando ? 'Procesando pago...' : !conektaListo ? 'Cargando...' : `Pagar $${plan.precio.toLocaleString('es-MX')} MXN`}
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