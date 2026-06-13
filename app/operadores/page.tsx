'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { estadosMunicipios, estados } from '../lib/mexico'

const fotaPorTipo: Record<string, string> = {
  'Construcción': '/Operador_MAquinaria.png',
  'Almacén / Logística': '/Operador_Montacargas1.png',
  'Transporte': '/Operador_Tractocamion.png',
}

export default function Operadores() {
  const [operadores, setOperadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroMunicipio, setFiltroMunicipio] = useState('')
  const [filtroMaquinaria, setFiltroMaquinaria] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [sesion, setSesion] = useState<any>(null)
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)
  const [empresa, setEmpresa] = useState<any>(null)
  const [pagina, setPagina] = useState(0)
  const [hayMas, setHayMas] = useState(true)
  const POR_PAGINA = 20

  const cargarOperadores = async (paginaNum: number, reset = false) => {
    const { data } = await supabase
      .from('operadores')
      .select('id, nombre, apellido, tipo_operador, ciudad, municipio, estado, experiencia_anos, disponibilidad, fecha_disponibilidad, maquinaria, calificacion_promedio, total_calificaciones, foto_url')
      .neq('disponibilidad', 'desactivado')
      .order('created_at', { ascending: false })
      .range(paginaNum * POR_PAGINA, (paginaNum + 1) * POR_PAGINA - 1)

    if (data) {
      if (reset) {
        setOperadores(data)
      } else {
        setOperadores(prev => [...prev, ...data])
      }
      setHayMas(data.length === POR_PAGINA)
    }
  }

  useEffect(() => {
    const cargar = async () => {
      await cargarOperadores(0, true)

      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      setSesion(sessionData.session)

      if (userId) {
        const { data: usuario } = await supabase
          .from('usuarios').select('tipo').eq('id', userId).single()
        setTipoUsuario(usuario?.tipo || null)

        if (usuario?.tipo === 'empresa') {
          const { data: emp } = await supabase
            .from('empresas')
            .select('id, membresia_activa, contactos_disponibles')
            .eq('user_id', userId).single()
          setEmpresa(emp)
        }
      }

      setLoading(false)
    }
    cargar()
  }, [])

  const municipios = filtroEstado ? estadosMunicipios[filtroEstado] || [] : []

  const operadoresFiltrados = operadores.filter(op => {
    if (filtroTipo !== 'Todos' && op.tipo_operador !== filtroTipo) return false
    if (filtroEstado && op.estado !== filtroEstado) return false
    if (filtroMunicipio && op.municipio !== filtroMunicipio) return false
    if (filtroMaquinaria && !op.maquinaria?.some((m: string) =>
      m.toLowerCase().includes(filtroMaquinaria.toLowerCase()))) return false
    return true
  })

  const handleDesbloquear = async (operadorId: string) => {
    if (!sesion) { window.location.href = '/login'; return }
    if (tipoUsuario !== 'empresa') { window.location.href = '/login'; return }
    if (!empresa?.membresia_activa) { window.location.href = '/planes'; return }

    const { data: previo } = await supabase
      .from('contactos_desbloqueados')
      .select('id').eq('empresa_id', empresa.id).eq('operador_id', operadorId).maybeSingle()

    if (previo) {
      window.location.href = `/operadores/detalle?id=${operadorId}`
      return
    }

    if (empresa.contactos_disponibles <= 0 && empresa.contactos_disponibles !== 9999) {
      window.location.href = '/planes'
      return
    }

    await supabase.from('contactos_desbloqueados')
      .insert({ empresa_id: empresa.id, operador_id: operadorId })

    if (empresa.contactos_disponibles < 9999) {
      await supabase.from('empresas')
        .update({ contactos_disponibles: empresa.contactos_disponibles - 1 })
        .eq('id', empresa.id)
    }

    window.location.href = `/operadores/detalle?id=${operadorId}`
  }

  const limpiarFiltros = () => {
    setFiltroEstado('')
    setFiltroMunicipio('')
    setFiltroMaquinaria('')
    setFiltroTipo('Todos')
  }

  const hayFiltrosActivos = filtroEstado || filtroMunicipio || filtroMaquinaria || filtroTipo !== 'Todos'

  const badgeDisponibilidad = (op: any) => {
    if (op.disponibilidad === 'disponible') return { color: 'bg-green-400', texto: 'Disponible' }
    if (op.fecha_disponibilidad) return {
      color: 'bg-yellow-400',
      texto: `Desde ${new Date(op.fecha_disponibilidad).toLocaleDateString('es-MX')}`
    }
    return { color: 'bg-red-400', texto: 'No disponible' }
  }

  return (
    <div className="bg-gray-50 pb-6">

      {/* Filtros tipo */}
      <section className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Todos', 'Construcción', 'Transporte', 'Almacén / Logística'].map((f, i) => (
            <button key={i} onClick={() => setFiltroTipo(f)}
              className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold border"
              style={filtroTipo === f
                ? {backgroundColor: '#9A2120', color: 'white', borderColor: '#9A2120'}
                : {backgroundColor: 'white', color: '#575757', borderColor: '#e5e7eb'}}>
              {f}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="🔍 Buscar por maquinaria..."
            value={filtroMaquinaria}
            onChange={(e) => setFiltroMaquinaria(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
          />
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="border rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1"
            style={{
              borderColor: hayFiltrosActivos ? '#9A2120' : '#e5e7eb',
              color: hayFiltrosActivos ? '#9A2120' : '#575757',
              backgroundColor: hayFiltrosActivos ? '#fff5f5' : 'white'
            }}>
            🗺 {hayFiltrosActivos ? 'Filtros ●' : 'Filtros'}
          </button>
        </div>

        {mostrarFiltros && (
          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold block mb-1" style={{color: '#575757'}}>Estado</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); setFiltroMunicipio('') }}
                  className="w-full border border-gray-200 rounded-xl px-2 py-2 text-xs">
                  <option value="">Todos los estados</option>
                  {estados.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1" style={{color: '#575757'}}>Municipio</label>
                <select
                  value={filtroMunicipio}
                  onChange={(e) => setFiltroMunicipio(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-2 py-2 text-xs"
                  disabled={!filtroEstado}>
                  <option value="">Todos</option>
                  {municipios.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            {hayFiltrosActivos && (
              <button onClick={limpiarFiltros}
                className="text-xs text-center py-1.5 rounded-xl border"
                style={{borderColor: '#9A2120', color: '#9A2120'}}>
                ✕ Limpiar filtros
              </button>
            )}
          </div>
        )}
      </section>

      {/* Lista de operadores */}
      <section className="px-4 mt-4">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">Cargando operadores...</p>
          </div>
        ) : operadoresFiltrados.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No hay operadores con estos filtros.</p>
            <button onClick={limpiarFiltros}
              className="mt-3 text-xs px-4 py-2 rounded-xl text-white font-bold"
              style={{backgroundColor: '#9A2120'}}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">{operadoresFiltrados.length} operadores</p>
            <div className="grid grid-cols-2 gap-3">
              {operadoresFiltrados.map((op) => {
                const foto = op.foto_url || fotaPorTipo[op.tipo_operador] || '/Operador_MAquinaria.png'
                const maquinarias: string[] = op.maquinaria || []
                const badge = badgeDisponibilidad(op)

                return (
                  <div key={op.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">

                    {/* Foto */}
                    <div className="relative h-32">
                      <img src={foto} alt="Operador" className="w-full h-full object-cover object-top" />
                      <div className="absolute bottom-1 right-1 bg-black/70 rounded-full px-1.5 py-0.5 text-white text-[8px] flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full inline-block ${badge.color}`}></span>
                        {badge.texto}
                      </div>
                      <div className="absolute top-1 left-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white" style={{backgroundColor: '#9A2120'}}>
                        {op.tipo_operador}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold" style={{color: '#575757'}}>
                          📍 {op.municipio || op.ciudad}
                        </p>
                        <p className="text-[9px] text-gray-400">{op.experiencia_anos} años</p>
                      </div>
                      {op.estado && (
                        <p className="text-[9px] text-gray-400 mb-1">{op.estado}</p>
                      )}

                      {op.calificacion_promedio > 0 && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] text-yellow-500">★</span>
                          <span className="text-[10px] font-semibold">{Number(op.calificacion_promedio).toFixed(1)}</span>
                          <span className="text-[9px] text-gray-400">({op.total_calificaciones})</span>
                        </div>
                      )}

                      {maquinarias.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {maquinarias.slice(0, 2).map((m, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full border" style={{borderColor: '#9A2120', color: '#9A2120'}}>
                              {m}
                            </span>
                          ))}
                          {maquinarias.length > 2 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              +{maquinarias.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => handleDesbloquear(op.id)}
                        className="w-full py-1.5 rounded-xl text-white text-[10px] font-bold"
                        style={{backgroundColor: '#9A2120'}}>
                        🔓 Desbloquear
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>

            {/* Botón cargar más */}
            {hayMas && (
              <button
                onClick={async () => {
                  const nuevaPagina = pagina + 1
                  setPagina(nuevaPagina)
                  await cargarOperadores(nuevaPagina)
                }}
                className="w-full mt-4 py-3 rounded-xl text-xs font-bold border-2"
                style={{borderColor: '#9A2120', color: '#9A2120'}}>
                Cargar más operadores
              </button>
            )}
          </>
        )}
      </section>

    </div>
  )
}