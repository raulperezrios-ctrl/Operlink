'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

function CalificarBoton({ empresaId, operadorId }: { empresaId: string, operadorId: string }) {
  const [calificacion, setCalificacion] = useState(0)
  const [calificado, setCalificado] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const verificar = async () => {
      const { data } = await supabase
        .from('calificaciones')
        .select('calificacion')
        .eq('empresa_id', empresaId)
        .eq('operador_id', operadorId)
        .maybeSingle()
      if (data) {
        setCalificacion(data.calificacion)
        setCalificado(true)
      }
    }
    verificar()
  }, [empresaId, operadorId])

  const handleCalificar = async (stars: number) => {
    setGuardando(true)
    setCalificacion(stars)

    await supabase.from('calificaciones').upsert({
      empresa_id: empresaId,
      operador_id: operadorId,
      calificacion: stars,
    }, { onConflict: 'empresa_id,operador_id' })

    const { data: todas } = await supabase
      .from('calificaciones')
      .select('calificacion')
      .eq('operador_id', operadorId)

    if (todas && todas.length > 0) {
      const promedio = todas.reduce((acc, c) => acc + c.calificacion, 0) / todas.length
      await supabase
        .from('operadores')
        .update({
          calificacion_promedio: Math.round(promedio * 10) / 10,
          total_calificaciones: todas.length
        })
        .eq('id', operadorId)
    }

    setCalificado(true)
    setMostrar(false)
    setGuardando(false)
  }

  if (calificado && !mostrar) return (
    <button onClick={() => { setCalificado(false); setMostrar(true) }}
      className="flex items-center justify-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className="text-sm" style={{color: s <= calificacion ? '#f59e0b' : '#e5e7eb'}}>★</span>
      ))}
    </button>
  )

  if (mostrar) return (
    <div className="flex flex-col items-center gap-2 bg-gray-50 rounded-xl p-2">
      <p className="text-[10px] text-gray-500">¿Cómo calificarías a este operador?</p>
      <div className="flex gap-2">
        {[1,2,3,4,5].map((s) => (
          <button
            key={s}
            onPointerDown={() => handleCalificar(s)}
            disabled={guardando}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold border-2"
            style={{
              borderColor: s <= calificacion ? '#f59e0b' : '#e5e7eb',
              backgroundColor: s <= calificacion ? '#fef3c7' : 'white',
              color: s <= calificacion ? '#f59e0b' : '#9ca3af'
            }}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={() => { setMostrar(false); setCalificado(calificacion > 0) }}
        className="text-[10px] text-gray-400">
        Cancelar
      </button>
    </div>
  )

  return (
    <button onClick={() => setMostrar(true)}
      className="text-[10px] px-2 py-1 rounded-full border text-center"
      style={{borderColor: '#f59e0b', color: '#f59e0b'}}>
      ⭐ Calificar
    </button>
  )
}

function PerfilEmpresaContent() {
  const searchParams = useSearchParams()
  const [empresa, setEmpresa] = useState<any>(null)
  const [suscripcion, setSuscripcion] = useState<any>(null)
  const [pagos, setPagos] = useState<any[]>([])
  const [operadoresDesbloqueados, setOperadoresDesbloqueados] = useState<any[]>([])
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(searchParams.get('tab') || 'perfil')
  const [cancelando, setCancelando] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id
      if (!uid) {
        window.location.href = '/login'
        return
      }
      setUserId(uid)

      const { data: emp } = await supabase
        .from('empresas')
        .select('*')
        .eq('user_id', uid)
        .single()
      setEmpresa(emp)

      if (emp) {
        const { data: sus } = await supabase
          .from('suscripciones')
          .select('*, planes(nombre, precio, duracion)')
          .eq('user_id', uid)
          .eq('estatus', 'activa')
          .order('fecha_inicio', { ascending: false })
          .limit(1)
          .single()
        setSuscripcion(sus)

        const { data: pag } = await supabase
          .from('pagos')
          .select('*')
          .eq('comprador_id', uid)
          .order('id', { ascending: false })
        setPagos(pag || [])

        const { data: desb } = await supabase
          .from('contactos_desbloqueados')
          .select('*, operadores(id, nombre, apellido, tipo_operador, ciudad, estado, foto_url, calificacion_promedio, total_calificaciones)')
          .eq('empresa_id', emp.id)
        setOperadoresDesbloqueados(desb || [])

        const { data: sol } = await supabase
          .from('solicitudes')
          .select('*')
          .eq('empresa_id', emp.id)
          .order('id', { ascending: false })
        setSolicitudes(sol || [])
      }

      setLoading(false)
    }
    cargar()
  }, [])

  const handleCancelarPlan = async () => {
    if (!confirm('¿Estás seguro de cancelar tu plan? Seguirás con acceso hasta que venza el período pagado.')) return
    setCancelando(true)

    // Cancelar suscripción en Conekta si existe
    if (empresa?.conekta_customer_id) {
      try {
        await fetch('/api/cancelar-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conektaCustomerId: empresa.conekta_customer_id,
            suscripcionId: suscripcion?.id,
            userId,
          })
        })
      } catch (e) {
        console.error('Error cancelando plan:', e)
      }
    }

    // Marcar suscripción como cancelada en Supabase
    await supabase
      .from('suscripciones')
      .update({ estatus: 'cancelada' })
      .eq('id', suscripcion?.id)

    setSuscripcion({ ...suscripcion, estatus: 'cancelada' })
    setCancelando(false)
    alert('Tu plan fue cancelado. Seguirás con acceso hasta que venza el período pagado.')
  }

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!empresa) return <div className="text-center py-20 text-sm text-gray-400">No se encontró el perfil</div>

  const tabs = [
    { id: 'perfil', label: '🏢 Perfil' },
    { id: 'plan', label: '💳 Plan' },
    { id: 'operadores', label: '👷 Operadores' },
    { id: 'solicitudes', label: '📋 Solicitudes' },
    { id: 'pagos', label: '💰 Pagos' },
  ]

  const fotaPorTipo: Record<string, string> = {
    'Construcción': '/Operador_MAquinaria.png',
    'Almacén / Logística': '/Operador_Montacargas1.png',
    'Transporte': '/Operador_Tractocamion.png',
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Mi cuenta</p>
            <h1 className="text-base font-black" style={{color: '#575757'}}>{empresa.nombre_empresa}</h1>
          </div>
          <button onClick={handleCerrarSesion}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{
                backgroundColor: tab === t.id ? '#9A2120' : 'transparent',
                color: tab === t.id ? 'white' : '#575757'
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">

        {/* Tab Perfil */}
        {tab === 'perfil' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Datos de la empresa</h2>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Empresa</span>
                  <span className="text-xs font-semibold">{empresa.nombre_empresa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Contacto</span>
                  <span className="text-xs font-semibold">{empresa.nombre_contacto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Teléfono</span>
                  <span className="text-xs font-semibold">{empresa.telefono}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Correo</span>
                  <span className="text-xs font-semibold">{empresa.correo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Ciudad</span>
                  <span className="text-xs font-semibold">{empresa.ciudad}, {empresa.estado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Industria</span>
                  <span className="text-xs font-semibold">{empresa.industria}</span>
                </div>
              </div>
              <a href="/mi-cuenta/empresa/editar"
                className="mt-4 w-full py-2.5 rounded-xl text-white text-xs font-bold text-center block"
                style={{backgroundColor: '#9A2120'}}>
                ✏️ Editar perfil
              </a>
            </div>
          </div>
        )}

        {/* Tab Plan */}
        {tab === 'plan' && (
          <div className="flex flex-col gap-3">
            {suscripcion && suscripcion.estatus === 'activa' ? (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Plan activo</h2>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-base font-black" style={{color: '#9A2120'}}>{suscripcion.planes?.nombre}</p>
                    <p className="text-xs text-gray-400">${suscripcion.planes?.precio?.toLocaleString('es-MX')} MXN</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{backgroundColor: '#dcfce7', color: '#16a34a'}}>
                    ✅ Activo
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Contactos disponibles</span>
                  <span className="text-xs font-bold" style={{color: '#9A2120'}}>
                    {empresa.contactos_disponibles === 9999 ? 'Ilimitados' : empresa.contactos_disponibles}
                  </span>
                </div>
                {suscripcion.fecha_fin && (
                  <div className="flex justify-between py-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Vence</span>
                    <span className="text-xs font-semibold">
                      {new Date(suscripcion.fecha_fin).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                )}

                {/* Aviso renovación automática */}
                {(suscripcion.planes?.duracion === 'mensual' || suscripcion.planes?.duracion === 'anual') && (
                  <div className="mt-3 p-3 rounded-xl" style={{backgroundColor: '#fff5f5'}}>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      🔄 Tu plan se renueva automáticamente. Si deseas cancelar, puedes hacerlo en cualquier momento y seguirás con acceso hasta que venza el período pagado.
                    </p>
                  </div>
                )}

                <a href="/planes"
                  className="mt-3 w-full py-2.5 rounded-xl text-white text-xs font-bold text-center block"
                  style={{backgroundColor: '#9A2120'}}>
                  Mejorar plan
                </a>

                {/* Botón cancelar — solo para planes recurrentes */}
                {(suscripcion.planes?.duracion === 'mensual' || suscripcion.planes?.duracion === 'anual') && (
                  <button
                    onClick={handleCancelarPlan}
                    disabled={cancelando}
                    className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold border-2 text-center block"
                    style={{borderColor: '#e5e7eb', color: '#6b7280', opacity: cancelando ? 0.7 : 1}}>
                    {cancelando ? 'Cancelando...' : 'Cancelar plan'}
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-sm font-bold mb-1" style={{color: '#575757'}}>Sin plan activo</p>
                <p className="text-xs text-gray-400 mb-3">Adquiere un plan para ver contactos de operadores</p>
                <a href="/planes" className="w-full py-2.5 rounded-xl text-white text-xs font-bold text-center block"
                  style={{backgroundColor: '#9A2120'}}>
                  Ver planes
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tab Operadores */}
        {tab === 'operadores' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400">{operadoresDesbloqueados.length} operadores desbloqueados</p>
            {operadoresDesbloqueados.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 text-center">
                <p className="text-sm text-gray-400">No has desbloqueado ningún operador aún</p>
                <a href="/operadores" className="mt-3 w-full py-2.5 rounded-xl text-white text-xs font-bold text-center block"
                  style={{backgroundColor: '#9A2120'}}>
                  Ver operadores
                </a>
              </div>
            ) : (
              operadoresDesbloqueados.map((d, i) => {
                const op = d.operadores
                const foto = op?.foto_url || fotaPorTipo[op?.tipo_operador] || '/Operador_MAquinaria.png'
                return (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <img src={foto} alt="Operador" className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{color: '#575757'}}>{op?.nombre} {op?.apellido}</p>
                        <p className="text-xs text-gray-400">{op?.tipo_operador}</p>
                        <p className="text-xs text-gray-400">📍 {op?.ciudad}, {op?.estado}</p>
                        {op?.calificacion_promedio > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-xs text-yellow-500">★</span>
                            <span className="text-xs font-semibold">{op.calificacion_promedio}</span>
                            <span className="text-[10px] text-gray-400">({op.total_calificaciones})</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <a href={`/operadores/detalle?id=${d.operador_id}&volver=mi-cuenta`}
                          className="text-xs px-3 py-1.5 rounded-full font-semibold text-white"
                          style={{backgroundColor: '#9A2120'}}>
                          Ver
                        </a>
                        <CalificarBoton empresaId={empresa.id} operadorId={d.operador_id} />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Tab Solicitudes */}
        {tab === 'solicitudes' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{solicitudes.length} solicitudes</p>
              <a href="/solicitudes/nueva"
                className="text-xs px-3 py-1.5 rounded-full font-semibold text-white"
                style={{backgroundColor: '#9A2120'}}>
                + Nueva
              </a>
            </div>
            {solicitudes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 text-center">
                <p className="text-sm text-gray-400">No has publicado ninguna solicitud aún</p>
              </div>
            ) : (
              solicitudes.map((sol, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold" style={{color: '#9A2120'}}>#{sol.folio}</p>
                      <p className="text-sm font-bold" style={{color: '#575757'}}>{sol.tipo_maquinaria}</p>
                      <p className="text-xs text-gray-400">{sol.ciudad}, {sol.estado}</p>
                      <p className="text-xs text-gray-400">{sol.tipo_solicitud}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{backgroundColor: sol.estatus === 'activa' ? '#dcfce7' : '#fee2e2',
                              color: sol.estatus === 'activa' ? '#16a34a' : '#dc2626'}}>
                      {sol.estatus || 'pendiente'}
                    </span>
                  </div>
                  <a href={`/mi-cuenta/empresa/solicitud?id=${sol.id}`}
                    className="w-full py-2 rounded-xl text-white text-xs font-bold text-center block"
                    style={{backgroundColor: '#9A2120'}}>
                    Ver detalle y postulados
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Pagos */}
        {tab === 'pagos' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400">{pagos.length} transacciones</p>
            {pagos.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 text-center">
                <p className="text-sm text-gray-400">No hay pagos registrados</p>
              </div>
            ) : (
              pagos.map((pago, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold" style={{color: '#575757'}}>{pago.concepto}</p>
                      <p className="text-xs text-gray-400">
                        {pago.created_at ? new Date(pago.created_at).toLocaleDateString('es-MX') : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black" style={{color: '#9A2120'}}>
                        ${pago.monto?.toLocaleString('es-MX')} MXN
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{backgroundColor: '#dcfce7', color: '#16a34a'}}>
                        ✅ Pagado
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default function PerfilEmpresa() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-gray-400">Cargando...</div>}>
      <PerfilEmpresaContent />
    </Suspense>
  )
}