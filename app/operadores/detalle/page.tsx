'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const fotaPorTipo: Record<string, string> = {
  'Construcción': '/Operador_MAquinaria.png',
  'Almacén / Logística': '/Operador_Montacargas1.png',
  'Transporte': '/Operador_Tractocamion.png',
}

function DetalleOperadorAdminContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [op, setOp] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      if (!id) return
      const { data: operador } = await supabase
        .from('operadores').select('*').eq('id', id).single()
      setOp(operador)
      setLoading(false)
    }
    cargar()
  }, [id])

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!op) return <div className="text-center py-20 text-sm text-gray-400">Operador no encontrado</div>

  const foto = op.foto_url || fotaPorTipo[op.tipo_operador] || '/Operador_MAquinaria.png'
  const maquinarias: string[] = op.maquinaria || []

  const disponibilidadInfo = () => {
    if (op.disponibilidad === 'disponible') return { color: 'bg-green-400', texto: 'Disponible' }
    if (op.fecha_disponibilidad) return {
      color: 'bg-yellow-400',
      texto: `Disponible desde ${new Date(op.fecha_disponibilidad).toLocaleDateString('es-MX')}`
    }
    return { color: 'bg-red-400', texto: 'No disponible' }
  }

  const disp = disponibilidadInfo()

  const mensajeWhatsApp = op.telefono
    ? `https://wa.me/52${op.telefono.replace(/\s/g, '')}?text=Hola%20${op.nombre}%2C%20te%20contactamos%20desde%20OperLink.`
    : null

  return (
    <div className="bg-gray-50 pb-6">

      {/* Header admin */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <a href="/admin/operadores" className="text-gray-400 text-lg">←</a>
        <h1 className="text-base font-black" style={{color: '#575757'}}>Detalle Operador</h1>
        <span className="ml-auto text-xs px-2 py-1 rounded-full font-bold text-white" style={{backgroundColor: '#9A2120'}}>Admin</span>
      </div>

      {/* Foto principal */}
      <section className="relative overflow-hidden bg-gray-100">
        <img src={foto} alt="Operador" className="w-full object-contain max-h-80" />
        <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)'}}></div>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{backgroundColor: '#9A2120'}}>{op.tipo_operador}</span>
          <div className="flex items-center gap-2 mt-2">
            <span className={`h-2 w-2 rounded-full inline-block ${disp.color}`}></span>
            <span className="text-xs">{disp.texto}</span>
          </div>
        </div>
      </section>

      {/* Info básica */}
      <section className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-lg font-black" style={{color: '#575757'}}>
            {op.nombre} {op.apellido}
          </h1>
          {op.verificado && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{backgroundColor: '#dbeafe', color: '#1d4ed8'}}>✔ Verificado</span>
          )}
        </div>
        <p className="text-xs text-gray-500">📍 {op.ciudad}, {op.estado}</p>
        <div className="flex gap-4 mt-3">
          <div className="text-center">
            <p className="text-xl font-black" style={{color: '#9A2120'}}>{op.experiencia_anos || '0'}</p>
            <p className="text-[10px] text-gray-500">Años de experiencia</p>
          </div>
          <div className="text-center">
            {op.calificacion_promedio > 0 ? (
              <>
                <p className="text-xl font-black" style={{color: '#9A2120'}}>⭐ {Number(op.calificacion_promedio).toFixed(1)}</p>
                <p className="text-[10px] text-gray-500">{op.total_calificaciones} reseña(s)</p>
              </>
            ) : (
              <>
                <p className="text-xl font-black text-gray-300">⭐ N/A</p>
                <p className="text-[10px] text-gray-400">Sin calificaciones</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contacto — admin ve todo */}
      <section className="px-4 py-4 bg-white mt-2 border-b border-gray-100">
        <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>📞 Información de contacto</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Teléfono</span>
            <a href={`tel:${op.telefono}`} className="text-xs font-bold" style={{color: '#9A2120'}}>{op.telefono}</a>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Correo</span>
            <a href={`mailto:${op.correo}`} className="text-xs font-bold" style={{color: '#9A2120'}}>{op.correo}</a>
          </div>
          {mensajeWhatsApp && (
            <a href={mensajeWhatsApp} target="_blank"
              className="mt-2 w-full py-2.5 rounded-xl text-white text-xs font-bold text-center block"
              style={{backgroundColor: '#25D366'}}>
              💬 Contactar por WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Maquinaria */}
      <section className="px-4 py-4 bg-white mt-2 border-b border-gray-100">
        <h2 className="text-sm font-bold mb-2" style={{color: '#575757'}}>Maquinaria que opera</h2>
        {maquinarias.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {maquinarias.map((m, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full border" style={{borderColor: '#9A2120', color: '#9A2120'}}>
                {m}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No especificada</p>
        )}
      </section>

      {/* Descripción */}
      {op.descripcion && (
        <section className="px-4 py-4 bg-white mt-2 border-b border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#575757'}}>Acerca del operador</h2>
          <p className="text-xs text-gray-500 leading-relaxed">{op.descripcion}</p>
        </section>
      )}

      {/* Documentos */}
      <section className="px-4 py-4 bg-white mt-2 border-b border-gray-100">
        <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>📄 Documentos</h2>
        <div className="flex flex-col gap-2">
          {op.licencia_url ? (
            <a href={op.licencia_url} target="_blank"
              className="text-xs px-3 py-2 rounded-xl border flex items-center gap-2"
              style={{borderColor: '#9A2120', color: '#9A2120'}}>
              🚗 Ver licencia de conducir
            </a>
          ) : (
            <div className="text-xs px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-2 text-gray-400">
              🚗 Sin licencia subida aún
            </div>
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
            <div className="text-xs px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-2 text-gray-400">
              📜 Sin certificaciones subidas aún
            </div>
          )}
        </div>
      </section>

      {/* Datos adicionales admin */}
      <section className="px-4 py-4 bg-white mt-2">
        <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>📋 Datos adicionales</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">ID</span>
            <span className="text-xs font-mono text-gray-500">{op.id?.slice(0,8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Municipio</span>
            <span className="text-xs font-semibold">{op.municipio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Verificado</span>
            <span className="text-xs font-semibold">{op.verificado ? '✅ Sí' : '❌ No'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Disponibilidad</span>
            <span className="text-xs font-semibold">{op.disponibilidad}</span>
          </div>
        </div>
      </section>

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