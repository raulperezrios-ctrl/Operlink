'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleEnviar = async () => {
    if (!email) {
      setError('Por favor escribe tu correo')
      return
    }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.operlink.mx/reset-password',
    })

    if (err) {
      setError('Error al enviar el correo. Verifica tu email.')
      setLoading(false)
      return
    }

    setEnviado(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="mb-6">
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-10 object-contain" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        {enviado ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-base font-black mb-2" style={{color: '#575757'}}>Revisa tu correo</h1>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Te enviamos un link para restablecer tu contraseña a <strong>{email}</strong>. Revisa también tu carpeta de spam.
            </p>
            <a href="/login"
              className="w-full py-3 rounded-xl text-white font-bold text-sm block text-center"
              style={{backgroundColor: '#9A2120'}}>
              Volver al login
            </a>
          </div>
        ) : (
          <>
            <h1 className="text-base font-black mb-1" style={{color: '#575757'}}>¿Olvidaste tu contraseña?</h1>
            <p className="text-xs text-gray-400 mb-4">Escribe tu correo y te enviaremos un link para restablecerla.</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>

              {error && <p className="text-xs text-red-500 text-center">{error}</p>}

              <button onClick={handleEnviar} disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm"
                style={{backgroundColor: '#9A2120', opacity: loading ? 0.7 : 1}}>
                {loading ? 'Enviando...' : 'Enviar link de recuperación'}
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