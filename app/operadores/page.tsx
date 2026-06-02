'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const fotaPorTipo: Record<string, string> = {
  'Construcción': '/Operador_MAquinaria.png',
  'Almacén / Logística': '/Operador_Montacargas1.png',
  'Transporte': '/Operador_Tractocamion.png',
}

export default function Operadores() {
  const [operadores, setOperadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const [sesion, setSesion] = useState<any>(null)
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)
  const [empresa, setEmpresa] = useState<any>(null)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('operadores')
        .select('*')
        .eq('disponibilidad', 'disponible')
      if (data) setOperadores(data)

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

        if (usuario?.tipo === 'empresa') {
          const { data: emp } = await supabase
            .from('empresas')
            .select('id, membresia_activa, contactos_disponibles')
            .eq('user_id', userId)
            .single()
          setEmpresa(emp)
        }
      }

      setLoading(false)
    }
    cargar()
  }, [])

  const operadoresFiltrados = filtro === 'Todos'
    ? operadores
    : operadores.filter(op => op.tipo_operador === filtro)

  const handleDesbloquear = async (operadorId: string) => {
    if (!sesion) {
      window.location.href = '/login'
      return
    }
    if (tipoUsuario !== 'empresa') {
      window.location.href = '/login'
      return
    }
    if (!empresa?.membresia_activa) {
      window.location.href = '/planes'
      return
    }

    // Verificar si ya desbloqueó este operador
    const { data: previo } = await supabase
      .from('contactos_desbloqueados')
      .select('id')
      .eq('empresa_id', empresa.id)
      .eq('operador_id', operadorId)
      .maybeSingle()

    if (previo) {
      // Ya lo desbloqueó — ir directo al detalle
      window.location.href = `/operadores/detalle?id=${operadorId}`
      return
    }

    // Verificar contactos disponibles
    if (empresa.contactos_disponibles <= 0 && empresa.contactos_disponibles !== 9999) {
      window.location.href = '/planes'
      return
    }

    // Desbloquear
    await supabase
      .from('contactos_desbloqueados')
      .insert({ empresa_id: empresa.id, operador_id: operadorId })

    if (empresa.contactos_disponibles < 9999) {
      await supabase
        .from('empresas')
        .update({ contactos_disponibles: empresa.contactos_disponibles - 1 })
        .eq('id', empresa.id)
    }

    window.location.href = `/operadores/detalle?id=${operadorId}`
  }

  return (
    <div className="bg-gray-50 pb-6">

      {/* Filtros */}
      <section className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Todos', 'Construcción', 'Transporte', 'Almacén / Logística'].map((f, i) => (
            <button key={i} onClick={() => setFiltro(f)}
              className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold border"
              style={filtro === f ? {backgroundColor: '#9A2120', color: 'white', borderColor: '#9A2120'} : {backgroundColor: 'white', color: '#152337', borderColor: '#e5e7eb'}}>
              {f}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <input type="text" placeholder="🔍 Buscar por ciudad o maquinaria..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs" />
          <button className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold" style={{color: '#152337'}}>
            Filtros
          </button>
        </div>
      </section>

      {/* Lista de operadores */}
      <section className="px-4 mt-4">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">Cargando operadores...</p>
          </div>
        ) : operadoresFiltrados.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No hay operadores disponibles.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">{operadoresFiltrados.length} operadores disponibles</p>
            <div className="flex flex-col gap-4">
              {operadoresFiltrados.map((op) => {
                const foto = fotaPorTipo[op.tipo_operador] || '/Operador_MAquinaria.png'
                const maquinarias: string[] = op.maquinaria || []

                return (
                  <div key={op.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    
                    {/* Foto */}
                    <div className="relative h-40">
                      <img src={foto} alt="Operador" className="w-full h-full object-cover object-top" />
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded-full px-2 py-0.5 text-white text-[9px] flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block"></span>
                        Disponible
                      </div>
                      <div className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{backgroundColor: '#9A2120'}}>
                        {op.tipo_operador}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold" style={{color: '#152337'}}>
                          {op.ciudad}, {op.estado}
                        </p>
                        <p className="text-[10px] text-gray-400">{op.experiencia_anos} años exp.</p>
                      </div>

                      {/* Maquinaria */}
                      {maquinarias.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {maquinarias.slice(0, 3).map((m, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border" style={{borderColor: '#9A2120', color: '#9A2120'}}>
                              {m}
                            </span>
                          ))}
                          {maquinarias.length > 3 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              +{maquinarias.length - 3} más
                            </span>
                          )}
                        </div>
                      )}

                      {/* Botón */}
                      <button
                        onClick={() => handleDesbloquear(op.id)}
                        className="w-full py-2 rounded-xl text-white text-xs font-bold mt-1"
                        style={{backgroundColor: '#9A2120'}}>
                        🔓 Desbloquear contacto
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>

    </div>
  )
}