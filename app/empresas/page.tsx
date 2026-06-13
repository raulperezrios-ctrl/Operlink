'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { estadosMunicipios, estados } from '../lib/mexico'

const fotaPorTipo: Record<string, string> = {
  'Construcción': '/Operador_MAquinaria.png',
  'Almacén / Logística': '/Operador_Montacargas1.png',
  'Transporte': '/Operador_Tractocamion.png',
}

export default function Empresas() {
  const [destacados, setDestacados] = useState<any[]>([])
  const [estadoBusqueda, setEstadoBusqueda] = useState('Jalisco')
  const [municipioBusqueda, setMunicipioBusqueda] = useState('')
  const [maquinariaBusqueda, setMaquinariaBusqueda] = useState('')

  const municipios = estadosMunicipios[estadoBusqueda] || []

  useEffect(() => {
    const cargarDestacados = async () => {
      const segmentos = ['Construcción', 'Almacén / Logística', 'Transporte']
      const resultados: any[] = []

      for (const segmento of segmentos) {
        const { data } = await supabase
          .from('operadores')
          .select('*')
          .eq('tipo_operador', segmento)
          .eq('disponibilidad', 'disponible')
          .order('calificacion_promedio', { ascending: false })
          .limit(1)
        if (data && data.length > 0) resultados.push(data[0])
      }

      setDestacados(resultados)
    }
    cargarDestacados()
  }, [])

  const handleBuscar = () => {
    window.location.href = '/operadores'
  }

  return (
    <div className="bg-white pb-6" style={{fontFamily: 'sans-serif'}}>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{minHeight: '180px'}}>
        <img src="/Operador_MAquinaria.png" alt="Operador" className="absolute right-0 top-0 h-full object-cover" style={{width: '55%'}} />
        <div className="absolute inset-0" style={{background: 'linear-gradient(to right, white 45%, transparent 75%)'}}></div>
        <div className="relative z-10 px-5 py-8 max-w-[55%]">
          <h1 className="text-xl font-black leading-tight" style={{color: '#575757'}}>
            Encuentra operadores certificados y maquinaria especializada
          </h1>
          <p className="text-xs text-gray-500 mt-2">Conectamos empresas con operadores para construcción, logística e industria.</p>
        </div>
      </section>

      {/* Buscador */}
      <section className="px-4 -mt-2">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <h2 className="font-bold text-sm mb-3" style={{color: '#575757'}}>¿Qué operador o maquinaria necesitas?</h2>

          <div className="flex flex-col gap-2">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Maquinaria requerida</label>
              <select
                value={maquinariaBusqueda}
                onChange={(e) => setMaquinariaBusqueda(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs">
                <option value="">Selecciona maquinaria</option>
                <option>Excavadora</option>
                <option>Retroexcavadora</option>
                <option>Motoniveladora</option>
                <option>Compactadora</option>
                <option>Grúa</option>
                <option>Bulldozer</option>
                <option>Cargador Frontal</option>
                <option>Montacargas Hombre Sentado</option>
                <option>Montacargas Hombre Parado</option>
                <option>Reach Truck</option>
                <option>Transpaleta Eléctrica</option>
                <option>Tractocamión</option>
                <option>Camión de Volteo</option>
                <option>Pipa</option>
                <option>Rabón</option>
                <option>Tortón</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Estado</label>
                <select
                  value={estadoBusqueda}
                  onChange={(e) => { setEstadoBusqueda(e.target.value); setMunicipioBusqueda('') }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs">
                  {estados.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Municipio</label>
                <select
                  value={municipioBusqueda}
                  onChange={(e) => setMunicipioBusqueda(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs">
                  <option value="">Todos</option>
                  {municipios.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Tipo de solicitud</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs">
                <option>Selecciona tipo de solicitud</option>
                <option>Solo Operador</option>
                <option>Operador con Máquina</option>
              </select>
            </div>

            <button
              onClick={handleBuscar}
              className="w-full py-2 rounded-xl text-white text-sm font-bold mt-1 text-center block"
              style={{backgroundColor: '#9A2120'}}>
              🔍 Buscar operadores
            </button>
          </div>
        </div>
      </section>

      {/* Operadores destacados */}
      <section className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-sm" style={{color: '#575757'}}>Operadores destacados</h2>
          <a href="/operadores" className="text-xs font-semibold" style={{color: '#9A2120'}}>Ver todos →</a>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {destacados.length === 0 ? (
            // Placeholders mientras carga
            ['/Operador_MAquinaria.png', '/Operador_Montacargas1.png', '/Operador_Tractocamion.png'].map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                <div className="h-24 bg-gray-200" />
                <div className="p-2">
                  <div className="h-2 bg-gray-200 rounded mb-1" />
                  <div className="h-2 bg-gray-100 rounded" />
                </div>
              </div>
            ))
          ) : (
            destacados.map((op, i) => {
              const foto = fotaPorTipo[op.tipo_operador] || '/Operador_MAquinaria.png'
              return (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="relative h-24">
                    <img src={foto} alt={op.tipo_operador} className="w-full h-full object-cover object-top" />
                    <div className="absolute bottom-1 right-1 bg-black/70 rounded-full px-1.5 py-0.5 text-white text-[9px] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block"></span>
                      Disponible
                    </div>
                  </div>
                  <div className="p-2">
                    <span className="text-[10px] font-bold" style={{color: '#9A2120'}}>{op.tipo_operador}</span>
                    <p className="text-[10px] text-gray-500 mt-0.5">📍 {op.municipio || op.ciudad}</p>
                    <p className="text-[10px] text-gray-500">{op.experiencia_anos} años exp.</p>
                    {op.calificacion_promedio > 0 && (
                      <p className="text-[10px] text-yellow-500">★ {Number(op.calificacion_promedio).toFixed(1)}</p>
                    )}
                    <a href={`/operadores/detalle?id=${op.id}`}
                      className="mt-1.5 w-full border rounded-lg py-1 text-[10px] font-semibold text-center block"
                      style={{borderColor: '#9A2120', color: '#9A2120'}}>
                      Ver perfil
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

    </div>
  )
}