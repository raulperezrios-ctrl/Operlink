'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegistroOperador() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tipoOperador, setTipoOperador] = useState('Construcción')
  const [disponibilidad, setDisponibilidad] = useState('disponible')
  const [tipoTrabajo, setTipoTrabajo] = useState('Temporal')
  const [cambioCiudad, setCambioCiudad] = useState('si')

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    ciudad: '',
    estado: 'Jalisco',
    experiencia_anos: '',
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

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

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

    await supabase.from('usuarios').insert({
      id: userId,
      email: form.email,
      tipo: 'operador',
    })

    await supabase.from('operadores').insert({
      user_id: userId,
      nombre: form.nombre,
      apellido: form.apellido,
      telefono: form.telefono,
      ciudad: form.ciudad,
      estado: form.estado,
      tipo_operador: tipoOperador,
      experiencia_anos: parseInt(form.experiencia_anos),
      disponibilidad: disponibilidad,
      descripcion: form.descripcion,
      correo: form.email,
    })

    router.push('/registro-operador/maquinaria')
    setLoading(false)
  }

  const tipos = [
    {emoji: '🏗️', label: 'Construcción', desc: 'Excavadora, retroexcavadora, grúa...'},
    {emoji: '📦', label: 'Almacén / Logística', desc: 'Montacargas, reach truck...'},
    {emoji: '🚛', label: 'Transporte', desc: 'Tractocamión, volteo, pipa...'},
  ]

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#575757'}}>Crear perfil de operador</h1>
        <p className="text-xs text-gray-500 mt-1">Completa tu información para aparecer en el catálogo</p>
        <div className="flex gap-2 mt-3">
          {['Datos', 'Maquinaria', 'Documentos', 'Foto'].map((paso, i) => (
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

          <h2 className="text-sm font-bold mt-2" style={{color: '#575757'}}>Información personal</h2>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Nombre *</label>
            <input name="nombre" type="text" placeholder="Tu nombre" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Apellido *</label>
            <input name="apellido" type="text" placeholder="Tu apellido" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
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

          {/* Tipo de operador */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{color: '#575757'}}>¿Qué tipo de operador eres? *</label>
            <div className="grid grid-cols-1 gap-2">
              {tipos.map((op, i) => (
                <button key={i} onClick={() => setTipoOperador(op.label)}
                  className="flex items-center gap-3 border-2 rounded-xl p-3 text-left"
                  style={{borderColor: tipoOperador === op.label ? '#9A2120' : '#e5e7eb', backgroundColor: tipoOperador === op.label ? '#fff5f5' : 'white'}}>
                  <span className="text-2xl">{op.emoji}</span>
                  <div>
                    <p className="text-xs font-bold" style={{color: tipoOperador === op.label ? '#9A2120' : '#575757'}}>{op.label}</p>
                    <p className="text-[10px] text-gray-400">{op.desc}</p>
                  </div>
                  {tipoOperador === op.label && <span className="ml-auto text-xs font-bold" style={{color: '#9A2120'}}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Años de experiencia *</label>
            <input name="experiencia_anos" type="number" placeholder="Ej. 5" onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-2" style={{color: '#575757'}}>Disponibilidad *</label>
            <div className="grid grid-cols-2 gap-2">
              {['disponible', 'no_disponible'].map((op) => (
                <button key={op} onClick={() => setDisponibilidad(op)}
                  className="border-2 rounded-xl py-2 text-xs font-bold"
                  style={{backgroundColor: disponibilidad === op ? '#9A2120' : 'white', color: disponibilidad === op ? 'white' : '#575757', borderColor: disponibilidad === op ? '#9A2120' : '#e5e7eb'}}>
                  {op === 'disponible' ? '✅ Disponible' : '❌ No disponible'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Tipo de trabajo *</label>
            <div className="grid grid-cols-3 gap-2">
              {['Temporal', 'Fijo', 'Ambos'].map((tipo) => (
                <button key={tipo} onClick={() => setTipoTrabajo(tipo)}
                  className="border-2 rounded-xl py-2 text-xs font-bold"
                  style={{backgroundColor: tipoTrabajo === tipo ? '#9A2120' : 'white', color: tipoTrabajo === tipo ? 'white' : '#575757', borderColor: tipoTrabajo === tipo ? '#9A2120' : '#e5e7eb'}}>
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>¿Acepta cambio de ciudad?</label>
            <div className="grid grid-cols-2 gap-2">
              {['si', 'no'].map((op) => (
                <button key={op} onClick={() => setCambioCiudad(op)}
                  className="border-2 rounded-xl py-2 text-xs font-bold"
                  style={{backgroundColor: cambioCiudad === op ? '#9A2120' : 'white', color: cambioCiudad === op ? 'white' : '#575757', borderColor: cambioCiudad === op ? '#9A2120' : '#e5e7eb'}}>
                  {op === 'si' ? '✅ Sí' : '❌ No'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Descripción breve</label>
            <textarea name="descripcion" placeholder="Cuéntanos sobre tu experiencia..." rows={3} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
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