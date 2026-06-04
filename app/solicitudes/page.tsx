'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todas')
  const [sesion, setSesion] = useState<any>(null)
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      setSesion(sessionData.session)

      if (userId) {
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('tipo')
          .eq('id', userId)
          .single()
        setTipoUsuario(usuario?.tipo || null)
      }

      const { data } = await supabase
        .from('solicitudes')
        .select('*')
        .order('id', { ascending: false })
      setSolicitudes(data || [])
      setLoading(false)
    }
    cargar()
  }, [])

  // Si es empresa, mostrar redirección
  if (!loading && tipoUsuario === 'empresa') {
    return (
      <div className="bg-gray-50 min-h-screen pb-24 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-lg font-black mb-2" style={{color: '#575757'}}>Tus solicitudes</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Como empresa, gestiona tus solicitudes desde tu perfil — ahí puedes ver los operadores que se postularon.
        </p>
        <a href="/mi-cuenta/empresa?tab=solicitudes"
          className="py-3 px-8 rounded-xl text-white font-bold text-sm"
          style={{backgroundColor: '#9A2120'}}>
          Ir a mis solicitudes
        </a>
        <a href="/solicitudes/nueva"
          className="mt-3 py-3 px-8 rounded-xl font-bold text-sm border-2"
          style={{borderColor: '#9A2120', color: '#9A2120'}}>
          + Nueva solicitud
        </a>
      </div>
    )
  }

  const solicitudesFiltradas = filtro === 'Todas'
    ? solicitudes
    : solicitudes.filter(s => s.estatus === filtro.toLowerCase())

  const activas = solicitudes.filter(s => s.estatus === 'activa').length

  return (
    <div className="bg-gray-50 pb-6">

      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <h1 className="text-base font-black" style={{color: '#575757'}}>Oportunidades de trabajo</h1>
        <p className="text-xs text-gray-400">{activas} solicitudes activas</p>
      </div>

      {/* Banner para no registrados */}
      {!sesion && (
        <div className="mx-4 mt-4 rounded-xl p-3 text-center" style={{backgroundColor: '#fff5f5', border: '1px solid #9A2120'}}>
          <p className="text-xs font-bold mb-1" style={{color: '#9A2120'}}>¿Eres operador?</p>
          <p className="text-xs text-gray-500 mb-2">Regístrate gratis y postúlate a estas oportunidades</p>
          <a href="/registro-operador"
            className="text-xs px-4 py-1.5 rounded-full text-white font-bold inline-block"
            style={{backgroundColor: '#9A2120'}}>
            Registrarme gratis
          </a>
        </div>
      )}

      {/* Filtros */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 mt-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Todas', 'activa', 'cerrada'].map((f, i) => (
            <button key={i} onClick={() => setFiltro(f)}
              className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold border"
              style={filtro === f
                ? {backgroundColor: '#9A2120', color: 'white', borderColor: '#9A2120'}
                : {backgroundColor: 'white', color: '#575757', borderColor: '#e5e7eb'}}>
              {f === 'Todas' ? 'Todas' : f === 'activa' ? 'Activas' : 'Cerradas'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 mt-4 flex flex-col gap-3">
        {loading && <p className="text-xs text-gray-400 text-center py-6">Cargando...</p>}

        {!loading && solicitudesFiltradas.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay solicitudes disponibles</p>
        )}

        {solicitudesFiltradas.map((sol, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-400 font-mono">#{sol.folio}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: sol.estatus === 'activa' ? '#dcfce7' : '#f3f4f6',
                  color: sol.estatus === 'activa' ? '#16a34a' : '#6b7280'
                }}>
                {sol.estatus === 'activa' ? 'Activa' : 'Cerrada'}
              </span>
            </div>

            <h2 className="text-sm font-black" style={{color: '#575757'}}>{sol.tipo_maquinaria}</h2>
            <p className="text-xs text-gray-500 mt-0.5">📍 {sol.ciudad}, {sol.estado}</p>
            <p className="text-xs text-gray-500">🔧 {sol.tipo_solicitud}</p>
            <p className="text-xs text-gray-500">⏱ {sol.duracion}</p>
            {sol.sueldo_pago && (
              <p className="text-xs font-bold mt-1" style={{color: '#9A2120'}}>
                💰 ${sol.sueldo_pago?.toLocaleString('es-MX')} MXN
              </p>
            )}

            <div className="mt-3">
              {!sesion ? (
                <a href="/registro-operador"
                  className="w-full py-2 rounded-xl text-white text-xs font-bold text-center block"
                  style={{backgroundColor: '#9A2120'}}>
                  Regístrate para postularte
                </a>
              ) : tipoUsuario === 'operador' ? (
                <PostularseBoton solicitudId={sol.id} />
              ) : null}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

function PostularseBoton({ solicitudId }: { solicitudId: string }) {
  const [postulado, setPostulado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    const verificar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) return

      const { data: op } = await supabase
        .from('operadores')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!op) return

      const { data: aplicacion } = await supabase
        .from('aplicaciones')
        .select('id')
        .eq('solicitud_id', solicitudId)
        .eq('operador_id', op.id)
        .maybeSingle()

      if (aplicacion) setPostulado(true)
      setVerificando(false)
    }
    verificar()
  }, [solicitudId])

  const handlePostularse = async () => {
    setLoading(true)
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) return

    const { data: op } = await supabase
      .from('operadores')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!op) return

    await supabase
      .from('aplicaciones')
      .insert({
        solicitud_id: solicitudId,
        operador_id: op.id,
        estatus: 'pendiente',
      })

    setPostulado(true)
    setLoading(false)
  }

  if (verificando) return null

  return postulado ? (
    <div className="w-full py-2 rounded-xl text-xs font-bold text-center"
      style={{backgroundColor: '#dcfce7', color: '#16a34a'}}>
      ✅ Ya te postulaste
    </div>
  ) : (
    <button onClick={handlePostularse} disabled={loading}
      className="w-full py-2 rounded-xl text-white text-xs font-bold"
      style={{backgroundColor: '#9A2120', opacity: loading ? 0.7 : 1}}>
      {loading ? 'Postulando...' : '🙋 Postularme'}
    </button>
  )
}