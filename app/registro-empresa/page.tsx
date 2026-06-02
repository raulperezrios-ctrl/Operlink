'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegistroEmpresa() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [industria, setIndustria] = useState('Construcción')

  const [form, setForm] = useState({
    nombre_empresa: '',
    nombre_contacto: '',
    telefono: '',
    ciudad: '',
    estado: 'Jalisco',
    sitio_web: '',
    descripcion: '',
    email: '',
    password: '',
  })

  const handleChange = (e: any) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleRegistro = async () => {
    setLoading(true)
    setError('')

    // 1. Crear usuario en Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Obtener el user_id — primero de signUp, si no, del session activo
    let userId = data.user?.id

    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession()
      userId = sessionData.session?.user?.id
    }

    if (!userId) {
      setError('No se pudo obtener el usuario. Intenta de nuevo.')
      setLoading(false)
      return
    }

    // 3. Guardar en tabla usuarios
    await supabase.from('usuarios').insert({
      id: userId,
      email: form.email,
      tipo: 'empresa',
    })

    // 4. Guardar en tabla empresas
    const { error: empresaError } = await supabase.from('empresas').insert({
      user_id: userId,
      nombre_empresa: form.nombre_empresa,
      nombre_contacto: form.nombre_contacto,
      telefono: form.telefono,
      ciudad: form.ciudad,
      estado: form.estado,
      industria: industria,
      sitio_web: form.sitio_web,
      descripcion: form.descripcion,
      correo: form.email,
    })

    if (empresaError) {
      setError('Error al guardar empresa: ' + empresaError.message)
      setLoading(false)
      return
    }

    router.push('/registro-empresa/logo')
    setLoading(false)
  }

  const industrias = [
    {emoji: '🏗️', label: 'Construcción'},
    {emoji: '🚛', label: 'Logística'},
    {emoji: '🏭', label: 'Manufactura'},
    {emoji: '⛏️', label: 'Minería'},
    {emoji: '🌾', label: 'Agricultura'},
    {emoji: '🔧', label: 'Otra'},
  ]

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#575757'}}>Crear perfil de empresa</h1>
        <p className="text-xs text-gray-500 mt-1">Encuentra los mejores operadores para tu negocio</p>
        <div className="flex gap-2 mt-3">
          {['Datos', 'Logo'].map((paso, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-1.5 rounded-full mb-1" style={{backgroundColor: i === 0 ? '#9A2120' : '#e5e7eb'}}></div>
              <span className="text-[9px]" style={{color: i === 0 ? '#9A2120' : '#9ca3af'}}>{paso}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">

          <h2 className="text-sm font-bold" style={{color: '#575757'}}>Cuenta</h2>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Correo electrónico *</label>
            <input name="email" type="email" placeholder="tucorreo@ejemplo.com" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Contraseña *</label>
            <input name="password" type="password" placeholder="••••••••" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <h2 className="text-sm font-bold mt-2" style={{color: '#575757'}}>Información de la empresa</h2>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Nombre de la empresa *</label>
            <input name="nombre_empresa" type="text" placeholder="Ej. Construcciones del Pacífico" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Nombre del contacto *</label>
            <input name="nombre_contacto" type="text" placeholder="Tu nombre completo" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Teléfono *</label>
            <input name="telefono" type="tel" placeholder="33 1234 5678" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Ciudad *</label>
              <input name="ciudad" type="text" placeholder="Ciudad" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Estado *</label>
              <select name="estado" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
                <option>Jalisco</option>
                <option>Nuevo León</option>
                <option>CDMX</option>
                <option>Puebla</option>
                <option>Guanajuato</option>
                <option>Sonora</option>
                <option>Chihuahua</option>
                <option>Veracruz</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-2" style={{color: '#575757'}}>Industria *</label>
            <div className="grid grid-cols-2 gap-2">
              {industrias.map((ind, i) => (
                <button key={i} onClick={() => setIndustria(ind.label)}
                  className="flex items-center gap-2 border-2 rounded-xl p-2.5 text-left"
                  style={{borderColor: industria === ind.label ? '#9A2120' : '#e5e7eb', backgroundColor: industria === ind.label ? '#fff5f5' : 'white'}}>
                  <span className="text-lg">{ind.emoji}</span>
                  <p className="text-xs font-semibold" style={{color: industria === ind.label ? '#9A2120' : '#575757'}}>{ind.label}</p>
                  {industria === ind.label && <span className="ml-auto text-xs font-bold" style={{color: '#9A2120'}}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Sitio web (opcional)</label>
            <input name="sitio_web" type="url" placeholder="www.tuempresa.com" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Descripción breve</label>
            <textarea name="descripcion" placeholder="Cuéntanos sobre tu empresa..." rows={3} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <button onClick={handleRegistro} disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold text-sm mt-2"
            style={{backgroundColor: '#9A2120', opacity: loading ? 0.7 : 1}}>
            {loading ? 'Registrando...' : 'Continuar →'}
          </button>

        </div>
      </div>

    </div>
  );
}