'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)
  const [sesionActiva, setSesionActiva] = useState(false)

  useEffect(() => {
    const verificar = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) setSesionActiva(true)
    }
    verificar()
  }, [])

  const handleReset = async () => {
    if (!password || !confirmar) {
      setError('Por favor completa ambos campos')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError('Error al actualizar la contraseña. El link puede haber expirado.')
      setLoading(false)
      return
    }

    setListo(true)
    setLoading(false)

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="mb-6">
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-10 object-contain" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        {listo ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-base font-black mb-2" style={{color: '#575757'}}>¡Contraseña actualizada!</h1>
            <p className="text-xs text-gray-400 mb-4">Te redirigiremos al login en unos segundos...</p>
            <a href="/login"
              className="w-full py-3 rounded-xl text-white font-bold text-sm block text-center"
              style={{backgroundColor: '#9A2120'}}>
              Ir al login
            </a>
          </div>
        ) : (
          <>
            <h1 className="text-base font-black mb-1" style={{color: '#575757'}}>Nueva contraseña</h1>
            <p className="text-xs text-gray-400 mb-4">Escribe tu nueva contraseña.</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Nueva contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>

              {error && <p className="text-xs text-red-500 text-center">{error}</p>}

              <button onClick={handleReset} disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm"
                style={{backgroundColor: '#9A2120', opacity: loading ? 0.7 : 1}}>
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>

              <a href="/login" className="text-xs text-center" style={{color: '#9A2120'}}>
                ← Volver al login
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}