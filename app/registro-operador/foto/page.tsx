'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function RegistroFoto() {
  const router = useRouter()
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [operadorId, setOperadorId] = useState<string | null>(null)

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

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleGuardar = async () => {
    if (!foto || !userId || !operadorId) {
      setError('Por favor selecciona una foto')
      return
    }

    setLoading(true)
    setError('')

    try {
      const extension = foto.name.split('.').pop()
      const nombreArchivo = `${operadorId}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('fotos-operadores')
        .upload(nombreArchivo, foto, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('fotos-operadores')
        .getPublicUrl(nombreArchivo)

      await supabase
        .from('operadores')
        .update({ foto_url: urlData.publicUrl })
        .eq('id', operadorId)

      router.push('/registro-operador/listo')

    } catch (err: any) {
      setError('Error al subir la foto: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#152337'}}>Tu foto de perfil</h1>
        <p className="text-xs text-gray-500 mt-1">Agrega una foto para que las empresas puedan reconocerte</p>
        <div className="flex gap-2 mt-3">
          {['Datos', 'Maquinaria', 'Documentos', 'Foto'].map((paso, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-1.5 rounded-full mb-1" style={{backgroundColor: '#9A2120'}}></div>
              <span className="text-[9px]" style={{color: '#9A2120'}}>{paso}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">

          {/* Preview */}
          <div className="flex flex-col items-center gap-3">
            {preview ? (
              <img src={preview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4" style={{borderColor: '#9A2120'}} />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                <span className="text-4xl">📷</span>
              </div>
            )}
            <p className="text-xs text-gray-400 text-center">Usa una foto clara de tu rostro</p>
          </div>

          {/* Botón seleccionar foto */}
          <label className="w-full py-3 rounded-xl text-center text-sm font-bold border-2 cursor-pointer block"
            style={{borderColor: '#9A2120', color: '#9A2120'}}>
            {preview ? '📷 Cambiar foto' : '📷 Seleccionar foto'}
            <input type="file" accept="image/*" capture="user" onChange={handleFoto} className="hidden" />
          </label>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <div className="flex gap-2">
            <a href="/registro-operador/documentos"
              className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center"
              style={{borderColor: '#9A2120', color: '#9A2120'}}>
              ← Atrás
            </a>
            <button onClick={handleGuardar} disabled={loading || !foto}
              className="flex-1 rounded-xl py-3 text-xs font-bold text-white"
              style={{backgroundColor: '#9A2120', opacity: (loading || !foto) ? 0.7 : 1}}>
              {loading ? 'Subiendo...' : 'Guardar →'}
            </button>
          </div>

          {/* Saltar */}
          <a href="/registro-operador/listo"
            className="text-xs text-center text-gray-400 underline">
            Saltar por ahora
          </a>

        </div>
      </div>

    </div>
  )
}
