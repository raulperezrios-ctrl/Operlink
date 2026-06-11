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
    rfc: '',
    razon_social: '',
    regimen_fiscal: '',
    uso_cfdi: '',
    codigo_postal_fiscal: '',
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
          rfc: emp.rfc || '',
          razon_social: emp.razon_social || '',
          regimen_fiscal: emp.regimen_fiscal || '',
          uso_cfdi: emp.uso_cfdi || '',
          codigo_postal_fiscal: emp.codigo_postal_fiscal || '',
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
        rfc: form.rfc,
        razon_social: form.razon_social,
        regimen_fiscal: form.regimen_fiscal,
        uso_cfdi: form.uso_cfdi,
        codigo_postal_fiscal: form.codigo_postal_fiscal,
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

  const regimenesFiscales = [
    '601 - General de Ley Personas Morales',
    '603 - Personas Morales con Fines no Lucrativos',
    '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios',
    '606 - Arrendamiento',
    '608 - Demás ingresos',
    '609 - Consolidación',
    '610 - Residentes en el Extranjero sin Establecimiento Permanente en México',
    '611 - Ingresos por Dividendos (socios y accionistas)',
    '612 - Personas Físicas con Actividades Empresariales y Profesionales',
    '614 - Ingresos por intereses',
    '616 - Sin obligaciones fiscales',
    '620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
    '621 - Incorporación Fiscal',
    '622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
    '623 - Opcional para Grupos de Sociedades',
    '624 - Coordinados',
    '625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
    '626 - Régimen Simplificado de Confianza',
  ]

  const usosCFDI = [
    'G01 - Adquisición de mercancias',
    'G02 - Devoluciones, descuentos o bonificaciones',
    'G03 - Gastos en general',
    'I01 - Construcciones',
    'I02 - Mobilario y equipo de oficina por inversiones',
    'I03 - Equipo de transporte',
    'I04 - Equipo de computo y accesorios',
    'I05 - Dados, troqueles, moldes, matrices y herramental',
    'I06 - Comunicaciones telefónicas',
    'I07 - Comunicaciones satelitales',
    'I08 - Otra maquinaria y equipo',
    'D01 - Honorarios médicos, dentales y gastos hospitalarios',
    'D10 - Pagos por servicios educativos (colegiaturas)',
    'S01 - Sin efectos fiscales',
    'CP01 - Pagos',
    'CN01 - Nómina',
  ]

  const municipios = estadosMunicipios[form.estado] || []

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/mi-cuenta/empresa" className="text-gray-400 text-lg">←</a>
        <div>
          <h1 className="text-lg font-black" style={{color: '#575757'}}>Editar perfil / Datos de Facturacion</h1>
          <p className="text-xs text-gray-500">Actualiza la información de tu empresa y datos de facturacion</p>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Información general */}
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

        </div>

        {/* Datos de facturación */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">

          <div>
            <h2 className="text-sm font-bold" style={{color: '#575757'}}>Datos de facturación</h2>
            <p className="text-xs text-gray-400 mt-0.5">Opcional — necesarios para emitir facturas</p>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>RFC</label>
            <input name="rfc" type="text" value={form.rfc} onChange={handleChange}
              placeholder="Ej. XAXX010101000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none uppercase" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Razón social</label>
            <input name="razon_social" type="text" value={form.razon_social} onChange={handleChange}
              placeholder="Nombre fiscal completo"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Código postal fiscal</label>
            <input name="codigo_postal_fiscal" type="text" value={form.codigo_postal_fiscal} onChange={handleChange}
              placeholder="Ej. 45085"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Régimen fiscal</label>
            <select name="regimen_fiscal" value={form.regimen_fiscal} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">Selecciona tu régimen</option>
              {regimenesFiscales.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Uso de CFDI</label>
            <select name="uso_cfdi" value={form.uso_cfdi} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">Selecciona el uso</option>
              {usosCFDI.map((u, i) => (
                <option key={i} value={u}>{u}</option>
              ))}
            </select>
          </div>

        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        <div className="flex gap-2">
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
  )
}