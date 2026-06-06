'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

function DetalleEmpresaAdminContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [emp, setEmp] = useState<any>(null)
  const [suscripcion, setSuscripcion] = useState<any>(null)
  const [pagos, setPagos] = useState<any[]>([])
  const [operadoresDesbloqueados, setOperadoresDesbloqueados] = useState<number>(0)
  const [solicitudes, setSolicitudes] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [accion, setAccion] = useState('')

  useEffect(() => {
    const verificarAdmin = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) { window.location.href = '/login'; return }
      const { data: usuario } = await supabase.from('usuarios').select('tipo').eq('id', userId).single()
      if (usuario?.tipo !== 'admin') { window.location.href = '/'; return }
    }
    verificarAdmin()

    const cargar = async () => {
      if (!id) return

      const { data: empresa } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', id)
        .single()
      setEmp(empresa)

      if (empresa) {
        // Suscripción activa
        const { data: sus } = await supabase
          .from('suscripciones')
          .select('*, planes(nombre, precio, duracion)')
          .eq('user_id', empresa.user_id)
          .eq('estatus', 'activa')
          .order('fecha_inicio', { ascending: false })
          .limit(1)
          .single()
        setSuscripcion(sus)

        // Pagos
        const { data: pag } = await supabase
          .from('pagos')
          .select('*')
          .eq('comprador_id', empresa.user_id)
          .order('id', { ascending: false })
        setPagos(pag || [])

        // Contactos desbloqueados
        const { count: desb } = await supabase
          .from('contactos_desbloqueados')
          .select('id', { count: 'exact', head: true })
          .eq('empresa_id', id)
        setOperadoresDesbloqueados(desb || 0)

        // Solicitudes
        const { count: sol } = await supabase
          .from('solicitudes')
          .select('id', { count: 'exact', head: true })
          .eq('empresa_id', id)
        setSolicitudes(sol || 0)
      }

      setLoading(false)
    }
    cargar()
  }, [id])

  const handleDesactivarMembresia = async () => {
    await supabase
      .from('empresas')
      .update({ membresia_activa: false, contactos_disponibles: 0 })
      .eq('id', id)
    setEmp({ ...emp, membresia_activa: false, contactos_disponibles: 0 })
    setAccion('Membresía desactivada')
  }

  const handleActivarMembresia = async () => {
    await supabase
      .from('empresas')
      .update({ membresia_activa: true, contactos_disponibles: 9999 })
      .eq('id', id)
    setEmp({ ...emp, membresia_activa: true, contactos_disponibles: 9999 })
    setAccion('Membresía activada')
  }

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) return
    await supabase.from('empresas').delete().eq('id', id)
    await supabase.from('usuarios').delete().eq('id', emp.user_id)
    window.location.href = '/admin/empresas'
  }

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!emp) return <div className="text-center py-20 text-sm text-gray-400">Empresa no encontrada</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/admin/empresas" className="text-gray-400 text-lg">←</a>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Panel Admin</p>
          <h1 className="text-base font-black" style={{color: '#575757'}}>{emp.nombre_empresa}</h1>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
          style={{
            backgroundColor: emp.membresia_activa ? '#dcfce7' : '#fef9c3',
            color: emp.membresia_activa ? '#16a34a' : '#ca8a04'
          }}>
          {emp.membresia_activa ? '💳 Con membresía' : '⏳ Sin membresía'}
        </span>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">

        {accion && (
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-green-700">✅ {accion}</p>
          </div>
        )}

        {/* Resumen rápido */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xl font-black" style={{color: '#9A2120'}}>{operadoresDesbloqueados}</p>
            <p className="text-[10px] text-gray-400">Contactos usados</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xl font-black" style={{color: '#9A2120'}}>
              {emp.contactos_disponibles === 9999 ? '∞' : emp.contactos_disponibles}
            </p>
            <p className="text-[10px] text-gray-400">Disponibles</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xl font-black" style={{color: '#9A2120'}}>{solicitudes}</p>
            <p className="text-[10px] text-gray-400">Solicitudes</p>
          </div>
        </div>

        {/* Datos de la empresa */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Datos de la empresa</h2>
          <div className="flex flex-col gap-2">
            {[
              {label: 'Empresa', value: emp.nombre_empresa},
              {label: 'Contacto', value: emp.nombre_contacto},
              {label: 'Teléfono', value: emp.telefono},
              {label: 'Correo', value: emp.correo},
              {label: 'Ciudad', value: `${emp.ciudad}, ${emp.estado}`},
              {label: 'Industria', value: emp.industria},
              {label: 'Sitio web', value: emp.sitio_web || 'N/D'},
            ].map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-xs font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan activo */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Plan activo</h2>
          {suscripcion ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Plan</span>
                <span className="text-xs font-bold" style={{color: '#9A2120'}}>{suscripcion.planes?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Precio</span>
                <span className="text-xs font-semibold">${suscripcion.planes?.precio?.toLocaleString('es-MX')} MXN</span>
              </div>
              {suscripcion.fecha_fin && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Vence</span>
                  <span className="text-xs font-semibold">{new Date(suscripcion.fecha_fin).toLocaleDateString('es-MX')}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Sin plan activo</p>
          )}
        </div>

        {/* Historial de pagos */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Historial de pagos ({pagos.length})</h2>
          {pagos.length === 0 ? (
            <p className="text-xs text-gray-400">Sin pagos registrados</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pagos.map((pago, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50">
                  <div>
                    <p className="text-xs font-semibold" style={{color: '#575757'}}>{pago.concepto}</p>
                    <p className="text-[10px] text-gray-400">
                      {pago.created_at ? new Date(pago.created_at).toLocaleDateString('es-MX') : ''}
                    </p>
                  </div>
                  <p className="text-xs font-black" style={{color: '#9A2120'}}>
                    ${pago.monto?.toLocaleString('es-MX')} MXN
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones admin */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>⚙️ Acciones</h2>
          <div className="flex flex-col gap-2">
            {emp.membresia_activa ? (
              <button onClick={handleDesactivarMembresia}
                className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
                style={{backgroundColor: '#ca8a04'}}>
                ⏸ Desactivar membresía
              </button>
            ) : (
              <button onClick={handleActivarMembresia}
                className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
                style={{backgroundColor: '#16a34a'}}>
                ✅ Activar membresía manual
              </button>
            )}
            <button onClick={handleEliminar}
              className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
              style={{backgroundColor: '#dc2626'}}>
              🗑️ Eliminar empresa
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function DetalleEmpresaAdmin() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-gray-400">Cargando...</div>}>
      <DetalleEmpresaAdminContent />
    </Suspense>
  )
}