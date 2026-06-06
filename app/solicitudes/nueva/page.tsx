'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { estadosMunicipios, estados } from '../../lib/mexico'

export default function NuevaSolicitud() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [tipoSolicitud, setTipoSolicitud] = useState('Solo Operador')
  const [prioridad, setPrioridad] = useState('Media')

  const [form, setForm] = useState({
    tipo_maquinaria: '',
    ciudad: '',
    estado: 'Jalisco',
    municipio: 'Guadalajara',
    fecha_inicio: '',
    duracion: '1 día',
    sueldo_pago: '',
    pago_periodo: 'por día',
    descripcion: '',
  })

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) { window.location.href = '/login'; return }
      const { data: emp } = await supabase.from('empresas').select('id').eq('user_id', userId).single()
      if (!emp) { window.location.href = '/login'; return }
      setEmpresaId(emp.id)
    }
    cargar()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name === 'estado') {
      const municipios = estadosMunicipios[value] || []
      setForm({ ...form, estado: value, municipio: municipios[0] || '' })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handlePublicar = async () => {
    if (!form.tipo_maquinaria || !form.descripcion) {
      setError('Por favor completa los campos obligatorios')
      return
    }
    if (!empresaId) {
      setError('No se encontró el perfil de empresa')
      return
    }

    setLoading(true)
    setError('')

    const folio = 'SOL-' + Date.now().toString().slice(-6)

    const { error: solError } = await supabase
      .from('solicitudes')
      .insert({
        folio,
        empresa_id: empresaId,
        tipo_maquinaria: form.tipo_maquinaria,
        tipo_solicitud: tipoSolicitud,
        ciudad: form.ciudad,
        estado: form.estado,
        municipio: form.municipio,
        fecha_inicio: form.fecha_inicio || null,
        duracion: form.duracion,
        sueldo_pago: form.sueldo_pago ? parseFloat(form.sueldo_pago) : null,
        descripcion: form.descripcion,
        estatus: 'activa',
      })

    if (solError) {
      setError('Error al publicar: ' + solError.message)
      setLoading(false)
      return
    }

    router.push('/mi-cuenta/empresa?tab=solicitudes')
    setLoading(false)
  }

  const maquinarias = [
    'Excavadora', 'Retroexcavadora', 'Motoniveladora', 'Compactadora',
    'Grúa', 'Bulldozer', 'Cargador Frontal', 'Vibrocompactador',
    'Montacargas Hombre Sentado', 'Montacargas Hombre Parado',
    'Reach Truck', 'Reach Stacker', 'Transpaleta Eléctrica',
    'Apilador', 'Orden Picker', 'Tractocamión', 'Camión de Volteo',
    'Pipa', 'Rabón', 'Tortón', 'Camión Redilas', 'Camioneta de Carga',
  ]

  const duraciones = ['por hora', 'por día', 'por semana', 'por mes', 'por contrato']
  const municipios = estadosMunicipios[form.estado] || []

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/mi-cuenta/empresa?tab=solicitudes" className="text-gray-400 text-lg">←</a>
        <div>
          <h1 className="text-lg font-black" style={{color: '#575757'}}>Nueva Solicitud</h1>
          <p className="text-xs text-gray-500">Publica lo que necesitas y encuentra al operador ideal</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">

          <h2 className="text-sm font-bold" style={{color: '#575757'}}>Detalles de la solicitud</h2>

          {/* Tipo de solicitud */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{color: '#575757'}}>Tipo de solicitud *</label>
            <div className="flex flex-col gap-2">
              {[
                { emoji: '👷', label: 'Solo Operador', desc: 'Necesito un operador para mi propio equipo' },
                { emoji: '🚜', label: 'Operador con Máquina', desc: 'Hombre-Máquina / Hombre-Camión — operador con su equipo incluido' },
              ].map((tipo) => (
                <button key={tipo.label} onClick={() => setTipoSolicitud(tipo.label)}
                  className="flex items-center gap-3 border-2 rounded-xl p-3 text-left w-full"
                  style={{
                    borderColor: tipoSolicitud === tipo.label ? '#9A2120' : '#e5e7eb',
                    backgroundColor: tipoSolicitud === tipo.label ? '#fff5f5' : 'white'
                  }}>
                  <span className="text-2xl">{tipo.emoji}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold" style={{color: tipoSolicitud === tipo.label ? '#9A2120' : '#575757'}}>
                      {tipo.label}
                    </p>
                    <p className="text-[10px] text-gray-400">{tipo.desc}</p>
                  </div>
                  {tipoSolicitud === tipo.label && (
                    <span className="text-xs font-bold" style={{color: '#9A2120'}}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Maquinaria */}
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Maquinaria o equipo requerido *</label>
            <select name="tipo_maquinaria" onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">Selecciona maquinaria</option>
              {maquinarias.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Ciudad</label>
            <input name="ciudad" type="text" placeholder="Ej. Guadalajara" onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>

          {/* Estado y Municipio */}
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

          {/* Fecha y Duración */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Fecha inicio</label>
              <input name="fecha_inicio" type="date" onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Duración estimada</label>
              <select name="duracion" onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
                <option>1 día</option>
                <option>1 semana</option>
                <option>1 mes</option>
                <option>3 meses</option>
                <option>6 meses</option>
                <option>Indefinido</option>
              </select>
            </div>
          </div>

          {/* Presupuesto */}
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Presupuesto / Pago (MXN)</label>
            <div className="flex gap-2 items-center">
              <div className="flex-1 flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <span className="px-3 text-sm text-gray-400">$</span>
                <input name="sueldo_pago" type="number" placeholder="0.00" onChange={handleChange}
                  className="flex-1 py-2.5 text-sm focus:outline-none" />
                <span className="px-2 text-xs text-gray-400">MXN</span>
              </div>
              <select name="pago_periodo" onChange={handleChange}
                className="border border-gray-200 rounded-xl px-2 py-2.5 text-xs text-gray-600">
                {duraciones.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Descripción del trabajo *</label>
            <textarea name="descripcion" placeholder="Describe el trabajo, requisitos especiales, condiciones..."
              rows={4} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
          </div>

          {/* Prioridad */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{color: '#575757'}}>Prioridad</label>
            <div className="flex gap-2">
              {['Baja', 'Media', 'Alta'].map((p) => (
                <button key={p} onClick={() => setPrioridad(p)}
                  className="flex-1 border-2 rounded-xl py-2 text-xs font-bold"
                  style={{
                    backgroundColor: prioridad === p ? (p === 'Alta' ? '#dc2626' : p === 'Media' ? '#ca8a04' : '#6b7280') : 'white',
                    borderColor: prioridad === p ? (p === 'Alta' ? '#dc2626' : p === 'Media' ? '#ca8a04' : '#6b7280') : '#e5e7eb',
                    color: prioridad === p ? 'white' : '#575757'
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          {/* Botones */}
          <div className="flex gap-2 mt-2">
            <a href="/mi-cuenta/empresa?tab=solicitudes"
              className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center"
              style={{borderColor: '#9A2120', color: '#9A2120'}}>
              Cancelar
            </a>
            <button onClick={handlePublicar} disabled={loading}
              className="flex-1 rounded-xl py-3 text-xs font-bold text-white"
              style={{backgroundColor: '#9A2120', opacity: loading ? 0.7 : 1}}>
              {loading ? 'Publicando...' : 'Publicar solicitud'}
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}