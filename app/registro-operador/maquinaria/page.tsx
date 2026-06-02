'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

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

export default function RegistroMaquinaria() {
  const router = useRouter()
  const [seleccionadas, setSeleccionadas] = useState<string[]>([])
  const [tieneEquipo, setTieneEquipo] = useState('no')
  const [tipoOperador, setTipoOperador] = useState('Construcción')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarTipo = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) return

      const { data } = await supabase
        .from('operadores')
        .select('tipo_operador')
        .eq('user_id', userId)
        .single()

      if (data?.tipo_operador) setTipoOperador(data.tipo_operador)
    }
    cargarTipo()
  }, [])

  const lista = maquinariasPorTipo[tipoOperador] || maquinariasPorTipo['Construcción']

  const toggleMaquinaria = (m: string) => {
    if (seleccionadas.includes(m)) {
      setSeleccionadas(seleccionadas.filter(s => s !== m))
    } else {
      setSeleccionadas([...seleccionadas, m])
    }
  }

  const handleContinuar = async () => {
    if (seleccionadas.length === 0) {
      setError('Selecciona al menos una maquinaria')
      return
    }
    setLoading(true)
    setError('')

    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id

    if (!userId) {
      setError('No se encontró la sesión. Intenta de nuevo.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('operadores')
      .update({ maquinaria: seleccionadas })
      .eq('user_id', userId)

    if (updateError) {
      setError('Error al guardar: ' + updateError.message)
      setLoading(false)
      return
    }

    router.push('/registro-operador/documentos')
    setLoading(false)
  }

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#575757'}}>Maquinaria que operas</h1>
        <p className="text-xs text-gray-500 mt-1">Selecciona todo el equipo que sabes operar</p>
        <div className="flex gap-2 mt-3">
          {['Datos', 'Maquinaria', 'Documentos', 'Foto'].map((paso, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-1.5 rounded-full mb-1" style={{backgroundColor: i <= 1 ? '#9A2120' : '#e5e7eb'}}></div>
              <span className="text-[9px]" style={{color: i <= 1 ? '#9A2120' : '#9ca3af'}}>{paso}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">

          {/* Tipo seleccionado */}
          <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
            <span className="text-xl">{emojisPorTipo[tipoOperador] || '🏗️'}</span>
            <div>
              <p className="text-xs font-bold" style={{color: '#9A2120'}}>{tipoOperador}</p>
              <p className="text-[10px] text-gray-400">Selecciona tu maquinaria específica</p>
            </div>
          </div>

          {/* Selección de maquinaria */}
          <div>
            <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>
              ¿Qué maquinaria sabes operar? *
              <span className="text-[10px] font-normal text-gray-400 ml-1">({seleccionadas.length} seleccionadas)</span>
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {lista.map((m, i) => (
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

          {/* Tiene equipo propio */}
          <div>
            <h2 className="text-sm font-bold mb-2" style={{color: '#575757'}}>¿Tienes tu propio equipo?</h2>
            <div className="flex gap-2">
              <button onClick={() => setTieneEquipo('si')} className="flex-1 border-2 rounded-xl py-2 text-xs font-bold"
                style={{backgroundColor: tieneEquipo === 'si' ? '#9A2120' : 'white', color: tieneEquipo === 'si' ? 'white' : '#575757', borderColor: tieneEquipo === 'si' ? '#9A2120' : '#e5e7eb'}}>
                ✅ Sí tengo equipo
              </button>
              <button onClick={() => setTieneEquipo('no')} className="flex-1 border-2 rounded-xl py-2 text-xs font-bold"
                style={{backgroundColor: tieneEquipo === 'no' ? '#9A2120' : 'white', color: tieneEquipo === 'no' ? 'white' : '#575757', borderColor: tieneEquipo === 'no' ? '#9A2120' : '#e5e7eb'}}>
                Solo soy operador
              </button>
            </div>
          </div>

          {tieneEquipo === 'si' && (
            <div className="border border-gray-100 rounded-xl p-3 bg-gray-50">
              <h3 className="text-xs font-bold mb-2" style={{color: '#575757'}}>Detalles de tu equipo</h3>
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="Marca (Ej. Caterpillar, John Deere)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                <input type="text" placeholder="Modelo (Ej. 416F)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                <input type="number" placeholder="Año del equipo" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Tarifa por hora (MXN)</label>
                  <input type="number" placeholder="$ por hora" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          {/* Botones */}
          <div className="flex gap-2 mt-2">
            <a href="/registro-operador" className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center" style={{borderColor: '#9A2120', color: '#9A2120'}}>
              ← Atrás
            </a>
            <button onClick={handleContinuar} disabled={loading}
              className="flex-1 rounded-xl py-3 text-xs font-bold text-white text-center"
              style={{backgroundColor: '#9A2120', opacity: loading ? 0.7 : 1}}>
              {loading ? 'Guardando...' : 'Continuar →'}
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}