'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const fotaPorTipo: Record<string, string> = {
  'Construcción': '/Operador_MAquinaria.png',
  'Almacén / Logística': '/Operador_Montacargas1.png',
  'Transporte': '/Operador_Tractocamion.png',
}

function DetalleSolicitudContent() {
  const searchParams = useSearchParams()
  const solicitudId = searchParams.get('id')
  const [solicitud, setSolicitud] = useState<any>(null)
  const [aplicaciones, setAplicaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [contactosDisponibles, setContactosDisponibles] = useState(0)
  const [membresiaActiva, setMembresiaActiva] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      if (!solicitudId) return

      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id
      if (!uid) {
        window.location.href = '/login'
        return
      }
      setUserId(uid)

      // Obtener empresa
      const { data: emp } = await supabase
        .from('empresas')
        .select('id, membresia_activa, contactos_disponibles')
        .eq('user_id', uid)
        .single()

      if (emp) {
        setEmpresaId(emp.id)
        setMembresiaActiva(emp.membresia_activa)
        setContactosDisponibles(emp.contactos_disponibles)
      }

      // Obtener solicitud
      const { data: sol } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('id', solicitudId)
        .single()
      setSolicitud(sol)

      // Obtener aplicaciones con datos del operador
      const { data: apps } = await supabase
        .from('aplicaciones')
        .select('*, operadores(id, nombre, apellido, tipo_operador, ciudad, estado, experiencia_anos, foto_url, maquinaria)')
        .eq('solicitud_id', solicitudId)
        .order('fecha', { ascending: false })
      setAplicaciones(apps || [])

      setLoading(false)
    }
    cargar()
  }, [solicitudId])

  const handleVerContacto = async (operadorId: string) => {
    if (!empresaId || !userId) return

    // Verificar si ya lo desbloqueó
    const { data: previo } = await supabase
      .from('contactos_desbloqueados')
      .select('id')
      .eq('empresa_id', empresaId)
      .eq('operador_id', operadorId)
      .maybeSingle()

    if (previo) {
      window.location.href = `/operadores/detalle?id=${operadorId}&volver=solicitud&solicitudId=${solicitudId}`
      return
    }

    if (!membresiaActiva) {
      window.location.href = '/planes'
      return
    }

    if (contactosDisponibles <= 0 && contactosDisponibles !== 9999) {
      window.location.href = '/planes'
      return
    }

    // Desbloquear
    await supabase
      .from('contactos_desbloqueados')
      .insert({ empresa_id: empresaId, operador_id: operadorId })

    if (contactosDisponibles < 9999) {
      await supabase
        .from('empresas')
        .update({ contactos_disponibles: contactosDisponibles - 1 })
        .eq('id', empresaId)
      setContactosDisponibles(contactosDisponibles - 1)
    }

    window.location.href = `/operadores/detalle?id=${operadorId}&volver=solicitud&solicitudId=${solicitudId}`
  }

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!solicitud) return <div className="text-center py-20 text-sm text-gray-400">Solicitud no encontrada</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/mi-cuenta/empresa?tab=solicitudes" className="text-gray-400 text-lg">←</a>
        <div>
          <p className="text-xs text-gray-400">#{solicitud.folio}</p>
          <h1 className="text-base font-black" style={{color: '#575757'}}>{solicitud.tipo_maquinaria}</h1>
        </div>
        <span className="ml-auto text-xs px-2 py-1 rounded-full font-semibold"
          style={{
            backgroundColor: solicitud.estatus === 'activa' ? '#dcfce7' : '#fee2e2',
            color: solicitud.estatus === 'activa' ? '#16a34a' : '#dc2626'
          }}>
          {solicitud.estatus === 'activa' ? 'Activa' : 'Cerrada'}
        </span>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Detalle de la solicitud */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Detalles</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Tipo</span>
              <span className="text-xs font-semibold">{solicitud.tipo_solicitud}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Ciudad</span>
              <span className="text-xs font-semibold">{solicitud.ciudad}, {solicitud.estado}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Fecha inicio</span>
              <span className="text-xs font-semibold">
                {solicitud.fecha_inicio ? new Date(solicitud.fecha_inicio).toLocaleDateString('es-MX') : 'Por definir'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Duración</span>
              <span className="text-xs font-semibold">{solicitud.duracion}</span>
            </div>
            {solicitud.sueldo_pago && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Pago</span>
                <span className="text-xs font-bold" style={{color: '#9A2120'}}>
                  ${solicitud.sueldo_pago?.toLocaleString('es-MX')} MXN
                </span>
              </div>
            )}
          </div>
          {solicitud.descripcion && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Descripción</p>
              <p className="text-xs text-gray-600 leading-relaxed">{solicitud.descripcion}</p>
            </div>
          )}
        </div>

        {/* Operadores postulados */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold" style={{color: '#575757'}}>
              Operadores postulados
            </h2>
            <span className="text-xs px-2 py-1 rounded-full font-semibold"
              style={{backgroundColor: '#fff5f5', color: '#9A2120'}}>
              {aplicaciones.length} postulados
            </span>
          </div>

          {aplicaciones.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 text-center">
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-sm text-gray-400">Aún no hay operadores postulados</p>
              <p className="text-xs text-gray-400 mt-1">Los operadores interesados aparecerán aquí</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {aplicaciones.map((app, i) => {
                const op = app.operadores
                const foto = fotaPorTipo[op?.tipo_operador] || '/Operador_MAquinaria.png'
                const maquinarias: string[] = op?.maquinaria || []

                return (
                  <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={foto} alt="Operador"
                        className="w-14 h-14 rounded-full object-cover border-2"
                        style={{borderColor: '#e5e7eb'}} />
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{color: '#575757'}}>
                          {op?.nombre?.charAt(0)}. {op?.apellido?.charAt(0)}.
                        </p>
                        <p className="text-xs text-gray-400">{op?.tipo_operador}</p>
                        <p className="text-xs text-gray-400">📍 {op?.ciudad}, {op?.estado}</p>
                        <p className="text-xs text-gray-400">{op?.experiencia_anos} años de experiencia</p>
                      </div>
                    </div>

                    {/* Maquinaria */}
                    {maquinarias.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {maquinarias.slice(0, 3).map((m, j) => (
                          <span key={j} className="text-[10px] px-2 py-0.5 rounded-full border"
                            style={{borderColor: '#9A2120', color: '#9A2120'}}>
                            {m}
                          </span>
                        ))}
                        {maquinarias.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            +{maquinarias.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => handleVerContacto(op?.id)}
                      className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
                      style={{backgroundColor: '#9A2120'}}>
                      🔓 Ver contacto completo
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default function DetalleSolicitud() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-gray-400">Cargando...</div>}>
      <DetalleSolicitudContent />
    </Suspense>
  )
}