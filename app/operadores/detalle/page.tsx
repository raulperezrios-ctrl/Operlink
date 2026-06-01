'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const fotosAleatorias = [
  '/Operador_MAquinaria.png',
  '/Operador_Montacargas1.png',
  '/Operador_Tractocamion.png',
  '/Operador_Montacargas2.png',
]

function DetalleOperadorContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [op, setOp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sesion, setSesion] = useState<any>(null)
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)
  const [membresiaActiva, setMembresiaActiva] = useState(false)
  const [contactosDisponibles, setContactosDisponibles] = useState(0)

  useEffect(() => {
    const cargar = async () => {
      if (!id) return

      const { data } = await supabase
        .from('operadores')
        .select('*')
        .eq('id', id)
        .single()
      setOp(data)

      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id

      if (userId) {
        setSesion(sessionData.session)

        const { data: usuario } = await supabase
          .from('usuarios')
          .select('tipo')
          .eq('id', userId)
          .single()
        setTipoUsuario(usuario?.tipo || null)

        if (usuario?.tipo === 'empresa') {
          const { data: empresa } = await supabase
            .from('empresas')
            .select('membresia_activa, contactos_disponibles')
            .eq('user_id', userId)
            .single()
          setMembresiaActiva(empresa?.membresia_activa || false)
          setContactosDisponibles(empresa?.contactos_disponibles || 0)
        }
      }

      setLoading(false)
    }
    cargar()
  }, [id])

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!op) return <div className="text-center py-20 text-sm text-gray-400">Operador no encontrado</div>

  const foto = fotosAleatorias[Math.floor(Math.random() * fotosAleatorias.length)]
  const iniciales = `${op.nombre?.charAt(0) || ''}. ${op.apellido?.charAt(0) || ''}.`
  const maquinarias: string[] = op.maquinaria || []
  const esEmpresa = tipoUsuario === 'empresa'
  const puedeVerContacto = esEmpresa && membresiaActiva

  return (
    <div className="bg-gray-50 pb-6">

      {/* Foto principal */}
      <section className="relative h-64 overflow-hidden">
        <img src={foto} alt="Operador" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)'}}></div>
        <a href="/operadores" className="absolute top-4 left-4 bg-black/40 rounded-full px-3 py-1 text-white text-xs">← Volver</a>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{backgroundColor: '#9A2120'}}>{op.tipo_operador}</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-2 w-2 rounded-full bg-green-400 inline-block"></span>
            <span className="text-xs">{op.disponibilidad}</span>
          </div>
        </div>
      </section>

      {/* Info básica */}
      <section className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-lg font-black" style={{color: '#152337'}}>
            {puedeVerContacto ? `${op.nombre} ${op.apellido}` : iniciales}
          </h1>
          {op.verificado && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{backgroundColor: '#dbeafe', color: '#1d4ed8'}}>✔ Verificado</span>
          )}
        </div>
        <p className="text-xs text-gray-500">📍 {op.ciudad}, {op.estado}</p>

        <div className="flex gap-4 mt-3">
          <div className="text-center">
            <p className="text-xl font-black" style={{color: '#9A2120'}}>{op.experiencia_anos || '0'}</p>
            <p className="text-[10px] text-gray-500">Años exp.</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black" style={{color: '#9A2120'}}>⭐ {op.calificacion > 0 ? op.calificacion : 'N/A'}</p>
            <p className="text-[10px] text-gray-500">Calificación</p>
          </div>
        </div>
      </section>

      {/* Maquinaria */}
      <section className="px-4 py-4 bg-white mt-2 border-b border-gray-100">
        <h2 className="text-sm font-bold mb-2" style={{color: '#152337'}}>Maquinaria que opera</h2>
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
          <h2 className="text-sm font-bold mb-2" style={{color: '#152337'}}>Acerca del operador</h2>
          <p className="text-xs text-gray-500 leading-relaxed">{op.descripcion}</p>
        </section>
      )}

      {/* Contacto */}
      <section className="px-4 py-4 mt-2">
        {puedeVerContacto ? (
          // Empresa con membresía activa — ver contacto completo
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-sm font-bold mb-3" style={{color: '#152337'}}>📞 Información de contacto</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Teléfono:</span>
                <a href={`tel:${op.telefono}`} className="text-sm font-bold" style={{color: '#9A2120'}}>{op.telefono}</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Correo:</span>
                <a href={`mailto:${op.correo}`} className="text-sm font-bold" style={{color: '#9A2120'}}>{op.correo}</a>
              </div>
            </div>
          </div>
        ) : esEmpresa && !membresiaActiva ? (
          // Empresa sin membresía — invitar a comprar plan
          <div className="rounded-2xl border-2 border-dashed p-6 text-center" style={{borderColor: '#9A2120'}}>
            <div className="text-3xl mb-2">🔒</div>
            <h2 className="font-black text-base" style={{color: '#152337'}}>Activa tu plan</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Para ver el contacto completo de este operador necesitas activar un plan OperLink.
            </p>
            <a href="/planes" className="mt-4 w-full py-3 rounded-xl text-white font-bold text-sm text-center block" style={{backgroundColor: '#9A2120'}}>
              Ver planes
            </a>
          </div>
        ) : (
          // No autenticado
          <div className="rounded-2xl border-2 border-dashed p-6 text-center" style={{borderColor: '#9A2120'}}>
            <div className="text-3xl mb-2">🔒</div>
            <h2 className="font-black text-base" style={{color: '#152337'}}>Contacto protegido</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Desbloquea el nombre completo y contacto de este operador siendo parte de OperLink.
            </p>
            <a href="/login" className="mt-4 w-full py-3 rounded-xl text-white font-bold text-sm text-center block" style={{backgroundColor: '#9A2120'}}>
              Iniciar sesión como empresa
            </a>
          </div>
        )}
      </section>

    </div>
  )
}

export default function DetalleOperador() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-gray-400">Cargando...</div>}>
      <DetalleOperadorContent />
    </Suspense>
  )
}