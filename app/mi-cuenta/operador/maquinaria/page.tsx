'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

const maquinariasPorTipo: Record<string, string[]> = {
  'Construcción': [
    'Excavadora', 'Retroexcavadora', 'Motoniveladora', 'Compactadora',
    'Grúa', 'Bulldozer', 'Cargador Frontal', 'Vibrocompactador'
  ],
  'Almacén / Logística': [
    'Montacargas Hombre Sentado', 'Montacargas Hombre Parado',
    'Reach Truck', 'Reach Stacker', 'Transpaleta Eléctrica',
    'Grúa Horquilla', 'Apilador', 'Orden Picker'
  ],
  'Transporte': [
    'Tractocamión', 'Camión de Volteo', 'Pipa', 'Rabón',
    'Tortón', 'Camión Redilas', 'Camioneta de Carga', 'Reach Stacker'
  ],
}

const emojisPorTipo: Record<string, string> = {
  'Construcción': '🏗️',
  'Almacén / Logística': '📦',
  'Transporte': '🚛',
}

export default function EditarMaquinaria() {
  const router = useRouter()
  const [seleccionadas, setSeleccionadas] = useState<string[]>([])
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>([])
  const [operadorId, setOperadorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) {
        window.location.href = '/login'
        return
      }

      const { data: op } = await supabase
        .from('operadores')
        .select('id, tipo_operador, tipos_operador, maquinaria')
        .eq('user_id', userId)
        .single()

      if (op) {
        setOperadorId(op.id)
        // Usar tipos_operador si existe, sino usar tipo_operador como array
        const tipos = op.tipos_operador?.length > 0 
          ? op.tipos_operador 
          : op.tipo_operador ? [op.tipo_operador] : ['Construcción']
        setTiposSeleccionados(tipos)
        setSeleccionadas(op.maquinaria || [])
      }
      setLoading(false)
    }
    cargar()
  }, [])

  const toggleTipo = (tipo: string) => {
    if (tiposSeleccionados.includes(tipo)) {
      if (tiposSeleccionados.length === 1) return // mínimo 1 tipo
      setTiposSeleccionados(tiposSeleccionados.filter(t => t !== tipo))
      // Quitar maquinaria de ese tipo
      const maqDelTipo = maquinariasPorTipo[tipo] || []
      setSeleccionadas(seleccionadas.filter(m => !maqDelTipo.includes(m)))
    } else {
      setTiposSeleccionados([...tiposSeleccionados, tipo])
    }
  }

  const toggleMaquinaria = (m: string) => {
    if (seleccionadas.includes(m)) {
      setSeleccionadas(seleccionadas.filter(s => s !== m))
    } else {
      setSeleccionadas([...seleccionadas, m])
    }
  }

  const handleGuardar = async () => {
    if (seleccionadas.length === 0) {
      setError('Selecciona al menos una maquinaria')
      return
    }
    if (!operadorId) return

    setGuardando(true)
    setError('')

    await supabase
      .from('operadores')
      .update({
        maquinaria: seleccionadas,
        tipos_operador: tiposSeleccionados,
        tipo_operador: tiposSeleccionados[0], // mantener el principal
      })
      .eq('id', operadorId)

    router.push('/mi-cuenta/operador?tab=maquinaria')
  }

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>

  // Lista de maquinaria de todos los tipos seleccionados
  const listaCompleta = tiposSeleccionados.flatMap(t => maquinariasPorTipo[t] || [])

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <a href="/mi-cuenta/operador?tab=maquinaria" className="text-gray-400 text-lg">←</a>
        <div>
          <h1 className="text-lg font-black" style={{color: '#575757'}}>Editar maquinaria</h1>
          <p className="text-xs text-gray-500">Selecciona los tipos y equipos que sabes operar</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">

          {/* Selección de tipos */}
          <div>
            <h2 className="text-sm font-bold mb-2" style={{color: '#575757'}}>
              ¿En qué segmentos trabajas?
            </h2>
            <div className="flex flex-col gap-2">
              {Object.keys(maquinariasPorTipo).map((tipo) => (
                <button key={tipo} onClick={() => toggleTipo(tipo)}
                  className="flex items-center gap-3 border-2 rounded-xl p-3 text-left w-full"
                  style={{
                    borderColor: tiposSeleccionados.includes(tipo) ? '#9A2120' : '#e5e7eb',
                    backgroundColor: tiposSeleccionados.includes(tipo) ? '#fff5f5' : 'white'
                  }}>
                  <span className="text-xl">{emojisPorTipo[tipo]}</span>
                  <p className="text-xs font-bold flex-1" style={{color: tiposSeleccionados.includes(tipo) ? '#9A2120' : '#575757'}}>
                    {tipo}
                  </p>
                  {tiposSeleccionados.includes(tipo) && (
                    <span className="text-xs font-bold" style={{color: '#9A2120'}}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selección de maquinaria */}
          <div>
            <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>
              ¿Qué maquinaria sabes operar?
              <span className="text-[10px] font-normal text-gray-400 ml-1">({seleccionadas.length} seleccionadas)</span>
            </h2>

            {tiposSeleccionados.map((tipo) => (
              <div key={tipo} className="mb-4">
                <p className="text-xs font-bold mb-2 flex items-center gap-1" style={{color: '#9A2120'}}>
                  {emojisPorTipo[tipo]} {tipo}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(maquinariasPorTipo[tipo] || []).map((m, i) => (
                    <button key={i} onClick={() => toggleMaquinaria(m)}
                      className="border-2 rounded-xl py-2.5 px-3 text-xs font-semibold text-left"
                      style={{
                        borderColor: seleccionadas.includes(m) ? '#9A2120' : '#e5e7eb',
                        color: seleccionadas.includes(m) ? '#9A2120' : '#575757',
                        backgroundColor: seleccionadas.includes(m) ? '#fff5f5' : 'white'
                      }}>
                      {seleccionadas.includes(m) ? '✅ ' : ''}{m}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <div className="flex gap-2 mt-2">
            <a href="/mi-cuenta/operador?tab=maquinaria"
              className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center"
              style={{borderColor: '#9A2120', color: '#9A2120'}}>
              Cancelar
            </a>
            <button onClick={handleGuardar} disabled={guardando}
              className="flex-1 rounded-xl py-3 text-xs font-bold text-white"
              style={{backgroundColor: '#9A2120', opacity: guardando ? 0.7 : 1}}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}