'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tipo, setTipo] = useState('empresa')
  const [verPassword, setVerPassword] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
      return
    }

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('tipo')
      .eq('id', data.user.id)
      .single()

    if (usuario?.tipo === 'admin') {
      router.push('/admin')
      return
    }

    if (usuario?.tipo !== tipo) {
      setError(`Esta cuenta es de ${usuario?.tipo === 'operador' ? 'operador 👷' : 'empresa 🏢'}. Selecciona el tipo correcto.`)
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (usuario?.tipo === 'operador') {
      router.push('/mi-cuenta/operador')
    } else if (usuario?.tipo === 'empresa') {
      router.push('/mi-cuenta/empresa')
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">

      <div className="mb-6">
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-10 object-contain" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          <button className="flex-1 py-2 text-sm font-bold text-white" style={{backgroundColor: '#9A2120'}}>
            Entrar
          </button>
          <a href="#registro" className="flex-1 py-2 text-sm font-semibold text-gray-500 text-center">
            Registrarse
          </a>
        </div>

        <p className="text-xs font-semibold mb-2" style={{color: '#575757'}}>¿Quién eres?</p>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTipo('operador')}
            className="flex-1 border-2 rounded-xl py-2 text-xs font-bold"
            style={{backgroundColor: tipo === 'operador' ? '#9A2120' : 'white', color: tipo === 'operador' ? 'white' : '#575757', borderColor: tipo === 'operador' ? '#9A2120' : '#e5e7eb'}}>
            👷 Operador
          </button>
          <button onClick={() => setTipo('empresa')}
            className="flex-1 border-2 rounded-xl py-2 text-xs font-bold"
            style={{backgroundColor: tipo === 'empresa' ? '#9A2120' : 'white', color: tipo === 'empresa' ? 'white' : '#575757', borderColor: tipo === 'empresa' ? '#9A2120' : '#e5e7eb'}}>
            🏢 Empresa
          </button>
        </div>

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
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Contraseña</label>
            <div className="relative">
              <input
                type={verPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {verPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <a href="/recuperar-password" className="text-xs text-right" style={{color: '#9A2120'}}>¿Olvidaste tu contraseña?</a>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold text-sm mt-1"
            style={{backgroundColor: '#9A2120', opacity: loading ? 0.7 : 1}}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">o continúa con</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button className="w-full border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 flex items-center justify-center gap-2">
          <span>🌐</span> Google
        </button>

      </div>

      <div id="registro" className="w-full max-w-sm mt-4 bg-white rounded-2xl shadow-sm p-4">
        <p className="text-xs font-bold text-center mb-3" style={{color: '#575757'}}>¿No tienes cuenta? Regístrate gratis</p>
        <div className="flex gap-2">
          <a href="/registro-operador" className="flex-1 border-2 rounded-xl py-2.5 text-xs font-bold text-center" style={{borderColor: '#9A2120', color: '#9A2120'}}>
            👷 Soy Operador
          </a>
          <a href="/registro-empresa" className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white text-center" style={{backgroundColor: '#575757'}}>
            🏢 Soy Empresa
          </a>
        </div>
      </div>

    </div>
  )
}