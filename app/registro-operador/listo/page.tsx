'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function RegistroListo() {
  const [operador, setOperador] = useState<any>(null)

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) return

      const { data } = await supabase
        .from('operadores')
        .select('*')
        .eq('user_id', userId)
        .single()
      setOperador(data)
    }
    cargar()
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-6" />
      </div>

      {/* Contenido */}
      <div className="px-4 py-8 flex flex-col items-center text-center">

        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-xl font-black mb-2" style={{color: '#575757'}}>
          ¡Tu perfil está activo!
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Ya apareces en el catálogo de OperLink. Las empresas pueden encontrarte y contactarte.
        </p>

        {/* Info del perfil */}
        {operador && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 w-full mb-6 text-left">
            <p className="text-xs text-gray-400 mb-1">Tu perfil</p>
            <p className="text-base font-black" style={{color: '#575757'}}>{operador.nombre} {operador.apellido}</p>
            <p className="text-xs text-gray-500">{operador.tipo_operador} — {operador.ciudad}, {operador.estado}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{backgroundColor: '#dcfce7', color: '#16a34a'}}>
                ✅ Activo
              </span>
              <span className="text-xs text-gray-400">{operador.experiencia_anos} años de experiencia</span>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="w-full flex flex-col gap-3">

          <a href="/solicitudes"
            className="w-full py-3 rounded-xl text-white font-bold text-sm text-center block"
            style={{backgroundColor: '#9A2120'}}>
            🏢 Ver empresas que buscan operadores
          </a>

          <div className="bg-white rounded-2xl shadow-sm p-4 border-2 w-full text-left" style={{borderColor: '#9A2120'}}>
            <p className="text-xs font-black mb-1" style={{color: '#9A2120'}}>⭐ Destaca tu perfil</p>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Con un plan OperLink puedes ver qué empresas están buscando operadores como tú y contactarlas directamente.
            </p>
            <a href="/planes"
              className="w-full py-2.5 rounded-xl font-bold text-sm text-center block"
              style={{backgroundColor: '#9A2120', color: 'white'}}>
              Ver planes desde $99 MXN
            </a>
          </div>

          <a href="/operadores"
            className="text-xs text-center text-gray-400 underline mt-2">
            Ver catálogo de operadores
          </a>

        </div>
      </div>
    </div>
  )
}