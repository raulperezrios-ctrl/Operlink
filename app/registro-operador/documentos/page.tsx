'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function RegistroDocumentos() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [operadorId, setOperadorId] = useState<string | null>(null)

  const [identificacion, setIdentificacion] = useState<File | null>(null)
  const [licencia, setLicencia] = useState<File | null>(null)
  const [certificaciones, setCertificaciones] = useState<File[]>([])

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id
      if (!uid) return
      setUserId(uid)

      const { data: op } = await supabase
        .from('operadores')
        .select('id')
        .eq('user_id', uid)
        .single()
      if (op) setOperadorId(op.id)
    }
    cargar()
  }, [])

  const handleGuardar = async () => {
    if (!userId || !operadorId) return
    setLoading(true)
    setError('')

    try {
      let identificacionUrl = null
      let licenciaUrl = null
      const certificacionesUrls: string[] = []

      // Subir identificación
      if (identificacion) {
        const ext = identificacion.name.split('.').pop()
        const nombre = `${operadorId}-ine.${ext}`
        await supabase.storage
          .from('identificaciones-operadores')
          .upload(nombre, identificacion, { upsert: true })
        identificacionUrl = nombre
      }

      // Subir licencia
      if (licencia) {
        const ext = licencia.name.split('.').pop()
        const nombre = `${operadorId}-licencia.${ext}`
        const { data: urlData } = await supabase.storage
          .from('certificaciones-operadores')
          .upload(nombre, licencia, { upsert: true })
        const { data: pub } = supabase.storage
          .from('certificaciones-operadores')
          .getPublicUrl(nombre)
        licenciaUrl = pub.publicUrl
      }

      // Subir certificaciones
      for (let i = 0; i < certificaciones.length; i++) {
        const cert = certificaciones[i]
        const ext = cert.name.split('.').pop()
        const nombre = `${operadorId}-cert-${i}.${ext}`
        await supabase.storage
          .from('certificaciones-operadores')
          .upload(nombre, cert, { upsert: true })
        const { data: pub } = supabase.storage
          .from('certificaciones-operadores')
          .getPublicUrl(nombre)
        certificacionesUrls.push(pub.publicUrl)
      }

      // Actualizar operador
      await supabase
        .from('operadores')
        .update({
          identificacion_url: identificacionUrl,
          licencia_url: licenciaUrl,
          certificaciones: certificacionesUrls.length > 0 ? certificacionesUrls : null,
        })
        .eq('id', operadorId)

      router.push('/registro-operador/foto')

    } catch (err: any) {
      setError('Error al subir documentos: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#152337'}}>Documentos</h1>
        <p className="text-xs text-gray-500 mt-1">Sube tus documentos para verificar tu perfil</p>
        <div className="flex gap-2 mt-3">
          {['Datos', 'Maquinaria', 'Documentos', 'Foto'].map((paso, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-1.5 rounded-full mb-1" style={{backgroundColor: i <= 2 ? '#9A2120' : '#e5e7eb'}}></div>
              <span className="text-[9px]" style={{color: i <= 2 ? '#9A2120' : '#9ca3af'}}>{paso}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">

          {/* Identificación oficial */}
          <div>
            <label className="text-sm font-bold block mb-1" style={{color: '#152337'}}>
              🪪 Identificación oficial
            </label>
            <p className="text-xs text-gray-400 mb-2">INE, pasaporte o cédula profesional</p>
            <label className="w-full py-3 rounded-xl text-center text-xs font-bold border-2 cursor-pointer block"
              style={{borderColor: identificacion ? '#9A2120' : '#e5e7eb', color: identificacion ? '#9A2120' : '#6b7280', backgroundColor: identificacion ? '#fff5f5' : 'white'}}>
              {identificacion ? `✅ ${identificacion.name}` : '📎 Seleccionar archivo'}
              <input type="file" accept="image/*,.pdf" onChange={(e) => setIdentificacion(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>

          {/* Licencia */}
          <div>
            <label className="text-sm font-bold block mb-1" style={{color: '#152337'}}>
              🚗 Licencia de conducir
            </label>
            <p className="text-xs text-gray-400 mb-2">Licencia de manejo vigente</p>
            <label className="w-full py-3 rounded-xl text-center text-xs font-bold border-2 cursor-pointer block"
              style={{borderColor: licencia ? '#9A2120' : '#e5e7eb', color: licencia ? '#9A2120' : '#6b7280', backgroundColor: licencia ? '#fff5f5' : 'white'}}>
              {licencia ? `✅ ${licencia.name}` : '📎 Seleccionar archivo'}
              <input type="file" accept="image/*,.pdf" onChange={(e) => setLicencia(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>

          {/* Certificaciones */}
          <div>
            <label className="text-sm font-bold block mb-1" style={{color: '#152337'}}>
              📜 Certificaciones (opcional)
            </label>
            <p className="text-xs text-gray-400 mb-2">Constancias, diplomas o certificados de operación</p>
            <label className="w-full py-3 rounded-xl text-center text-xs font-bold border-2 cursor-pointer block"
              style={{borderColor: certificaciones.length > 0 ? '#9A2120' : '#e5e7eb', color: certificaciones.length > 0 ? '#9A2120' : '#6b7280', backgroundColor: certificaciones.length > 0 ? '#fff5f5' : 'white'}}>
              {certificaciones.length > 0 ? `✅ ${certificaciones.length} archivo(s)` : '📎 Seleccionar archivos'}
              <input type="file" accept="image/*,.pdf" multiple
                onChange={(e) => setCertificaciones(Array.from(e.target.files || []))} className="hidden" />
            </label>
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <div className="flex gap-2 mt-2">
            <a href="/registro-operador/maquinaria"
              className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center"
              style={{borderColor: '#9A2120', color: '#9A2120'}}>
              ← Atrás
            </a>
            <button onClick={handleGuardar} disabled={loading}
              className="flex-1 rounded-xl py-3 text-xs font-bold text-white"
              style={{backgroundColor: '#9A2120', opacity: loading ? 0.7 : 1}}>
              {loading ? 'Subiendo...' : 'Continuar →'}
            </button>
          </div>

          <a href="/registro-operador/foto"
            className="text-xs text-center text-gray-400 underline">
            Saltar por ahora
          </a>

        </div>
      </div>

    </div>
  )
}