'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

function DetalleOperadorAdminContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [op, setOp] = useState<any>(null)
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
      const { data } = await supabase
        .from('operadores')
        .select('*')
        .eq('id', id)
        .single()
      setOp(data)
      setLoading(false)
    }
    cargar()
  }, [id])

  const handleVerificar = async () => {
    await supabase.from('operadores').update({ verificado: true }).eq('id', id)
    setOp({ ...op, verificado: true })
    setAccion('verificado')
  }

  const handleDesactivar = async () => {
    const nuevaDisp = op.disponibilidad === 'desactivado' ? 'disponible' : 'desactivado'
    await supabase.from('operadores').update({ disponibilidad: nuevaDisp }).eq('id', id)
    setOp({ ...op, disponibilidad: nuevaDisp })
    setAccion(nuevaDisp)
  }

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de eliminar este operador? Esta acción no se puede deshacer.')) return
    await supabase.from('operadores').delete().eq('id', id)
    await supabase.from('usuarios').delete().eq('id', op.user_id)
    window.location.href = '/admin/operadores'
  }

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!op) return <div className="text-center py-20 text-sm text-gray-400">Operador no encontrado</div>

  const fotaPorTipo: Record<string, string> = {
    'Construcción': '/Operador_MAquinaria.png',
    'Almacén / Logística': '/Operador_Montacargas1.png',
    'Transporte': '/Operador_Tractocamion.png',
  }
  const foto = op.foto_url || fotaPorTipo[op.tipo_operador] || '/Operador_MAquinaria.png'

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/admin/operadores" className="text-gray-400 text-lg">←</a>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Panel Admin</p>
          <h1 className="text-base font-black" style={{color: '#575757'}}>{op.nombre} {op.apellido}</h1>
        </div>
        {op.verificado && (
          <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{backgroundColor: '#dbeafe', color: '#1d4ed8'}}>✔ Verificado</span>
        )}
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">

        {accion && (
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-green-700">✅ Acción realizada: {accion}</p>
          </div>
        )}

        {/* Foto */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
          <img src={foto} alt="Operador" className="w-20 h-20 rounded-full object-cover border-2" style={{borderColor: '#9A2120'}} />
          <div>
            <p className="text-base font-black" style={{color: '#575757'}}>{op.nombre} {op.apellido}</p>
            <p className="text-xs text-gray-400">{op.tipo_operador}</p>
            <p className="text-xs text-gray-400">📍 {op.ciudad}, {op.estado}</p>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block"
              style={{
                backgroundColor: op.disponibilidad === 'disponible' ? '#dcfce7' : '#fee2e2',
                color: op.disponibilidad === 'disponible' ? '#16a34a' : '#dc2626'
              }}>
              {op.disponibilidad === 'desactivado' ? '🚫 Desactivado' : op.disponibilidad === 'disponible' ? '✅ Disponible' : '❌ No disponible'}
            </span>
          </div>
        </div>

        {/* Datos */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Datos personales</h2>
          <div className="flex flex-col gap-2">
            {[
              {label: 'Teléfono', value: op.telefono},
              {label: 'Correo', value: op.correo},
              {label: 'Experiencia', value: `${op.experiencia_anos} años`},
              {label: 'Fecha registro', value: op.fecha_registro ? new Date(op.fecha_registro).toLocaleDateString('es-MX') : 'N/D'},
            ].map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-xs font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maquinaria */}
        {op.maquinaria?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-sm font-bold mb-2" style={{color: '#575757'}}>Maquinaria</h2>
            <div className="flex flex-wrap gap-2">
              {op.maquinaria.map((m: string, i: number) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full border" style={{borderColor: '#9A2120', color: '#9A2120'}}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Documentos */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Documentos</h2>
          <div className="flex flex-col gap-2">
            {op.licencia_url ? (
              <a href={op.licencia_url} target="_blank"
                className="text-xs px-3 py-2 rounded-xl border flex items-center gap-2"
                style={{borderColor: '#9A2120', color: '#9A2120'}}>
                🚗 Ver licencia de conducir
              </a>
            ) : (
              <p className="text-xs text-gray-400">❌ Sin licencia subida</p>
            )}
            {op.certificaciones?.length > 0 ? (
              op.certificaciones.map((cert: string, i: number) => (
                <a key={i} href={cert} target="_blank"
                  className="text-xs px-3 py-2 rounded-xl border flex items-center gap-2"
                  style={{borderColor: '#9A2120', color: '#9A2120'}}>
                  📜 Ver certificación {i + 1}
                </a>
              ))
            ) : (
              <p className="text-xs text-gray-400">❌ Sin certificaciones</p>
            )}
          </div>
        </div>

        {/* Experiencia */}
        {op.experiencia_texto && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-sm font-bold mb-2" style={{color: '#575757'}}>Experiencia</h2>
            <p className="text-xs text-gray-600 leading-relaxed">{op.experiencia_texto}</p>
          </div>
        )}

        {/* Acciones admin */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>⚙️ Acciones</h2>
          <div className="flex flex-col gap-2">

            {!op.verificado && (
              <button onClick={handleVerificar}
                className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
                style={{backgroundColor: '#1d4ed8'}}>
                ✔ Verificar operador
              </button>
            )}

            <button onClick={handleDesactivar}
              className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
              style={{backgroundColor: op.disponibilidad === 'desactivado' ? '#16a34a' : '#ca8a04'}}>
              {op.disponibilidad === 'desactivado' ? '✅ Activar operador' : '⚠️ Desactivar operador'}
            </button>

            <button onClick={handleEliminar}
              className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
              style={{backgroundColor: '#dc2626'}}>
              🗑️ Eliminar operador
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default function DetalleOperadorAdmin() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-gray-400">Cargando...</div>}>
      <DetalleOperadorAdminContent />
    </Suspense>
  )
}