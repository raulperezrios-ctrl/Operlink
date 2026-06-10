'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { estadosMunicipios, estados } from '../../../lib/mexico'

export default function EditarEmpresa() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [industria, setIndustria] = useState('Construcción')

  const [form, setForm] = useState({
    nombre_empresa: '',
    nombre_contacto: '',
    telefono: '',
    ciudad: '',
    estado: 'Jalisco',
    municipio: 'Guadalajara',
    sitio_web: '',
    descripcion: '',
  })

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) { window.location.href = '/login'; return }

      const { data: emp } = await supabase
        .from('empresas')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (emp) {
        setEmpresaId(emp.id)
        setIndustria(emp.industria || 'Construcción')
        setForm({
          nombre_empresa: emp.nombre_empresa || '',
          nombre_contacto: emp.nombre_contacto || '',
          telefono: emp.telefono || '',
          ciudad: emp.ciudad || '',
          estado: emp.estado || 'Jalisco',
          municipio: emp.municipio || 'Guadalajara',
          sitio_web: emp.sitio_web || '',
          descripcion: emp.descripcion || '',
        })
      }
      setLoading(false)
    }
    cargar()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name === 'estado') {
      const municipios = estadosMunicipios[value] || []
      setForm({...form, estado: value, municipio: municipios[0] || ''})
    } else {
      setForm({...form, [name]: value})
    }
  }

  const handleGuardar = async () => {
    if (!empresaId) return
    setGuardando(true)
    setError('')

    const { error: updateError } = await supabase
      .from('empresas')
      .update({
        nombre_empresa: form.nombre_empresa,
        nombre_contacto: form.nombre_contacto,
        telefono: form.telefono,
        ciudad: form.ciudad,
        estado: form.estado,
        municipio: form.municipio,
        industria: industria,
        sitio_web: form.sitio_web,
        descripcion: form.descripcion,
      })
      .eq('id', empresaId)

    if (updateError) {
      setError('Error al guardar: ' + updateError.message)
      setGuardando(false)
      return
    }

    router.push('/mi-cuenta/empresa')
  }

  const industrias = [
    {emoji: '🏗️', label: 'Construcción'},
    {emoji: '🚛', label: 'Logística'},
    {emoji: '🏭', label: 'Manufactura'},
    {emoji: '⛏️', label: 'Minería'},
    {emoji: '🌾', label: 'Agricultura'},
    {emoji: '🔧', label: 'Otra'},
  ]

  const municipios = estadosMunicipios[form.estado] || []

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/mi-cuenta/empresa" className="text-gray-400 text-lg">←</a>
        <div>
          <h1 className="text-lg font-black" style={{color: '#575757'}}>Editar perfil</h1>
          <p className="text-xs text-gray-500">Actualiza la información de tu empresa</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">

          <h2 className="text-sm font-bold" style={{color: '#575757'}}>Información de la empresa</h2>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Nombre de la empresa *</label>
            <input name="nombre_empresa" type="text" value={form.nombre_empresa} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Nombre del contacto *</label>
            <input name="nombre_contacto" type="text" value={form.nombre_contacto} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Teléfono *</label>
            <input name="telefono" type="tel" value={form.telefono} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Ciudad *</label>
            <input name="ciudad" type="text" value={form.ciudad} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Estado *</label>
              <select name="estado" value={form.estado} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
                {estados.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Municipio *</label>
              <select name="municipio" value={form.municipio} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
                {municipios.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
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
            <input name="sitio_web" type="url" value={form.sitio_web} onChange={handleChange}
              placeholder="www.tuempresa.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Descripción breve</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
              rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <div className="flex gap-2 mt-2">
            <a href="/mi-cuenta/empresa"
              className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center"
              style={{borderColor: '#9A2120', color: '#9A2120'}}>
              Cancelar
            </a>
            <button onClick={handleGuardar} disabled={guardando}
              className="flex-1 rounded-xl py-3 text-xs font-bold text-white"
              style={{backgroundColor: '#9A2120', opacity: guardando ? 0.7 : 1}}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}