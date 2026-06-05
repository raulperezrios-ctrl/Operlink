'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

function PerfilOperadorContent() {
  const searchParams = useSearchParams()
  const [operador, setOperador] = useState<any>(null)
  const [postulaciones, setPostulaciones] = useState<any[]>([])
  const [suscripcion, setSuscripcion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(searchParams.get('tab') || 'perfil')
  const [userId, setUserId] = useState<string | null>(null)

  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [editandoExperiencia, setEditandoExperiencia] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [formPerfil, setFormPerfil] = useState<any>({})
  const [textoExperiencia, setTextoExperiencia] = useState('')

  const [subiendo, setSubiendo] = useState(false)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [licenciaFile, setLicenciaFile] = useState<File | null>(null)
  const [certFiles, setCertFiles] = useState<File[]>([])

  useEffect(() => {
    const cargar = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id
      if (!uid) {
        window.location.href = '/login'
        return
      }
      setUserId(uid)

      const { data: op } = await supabase
        .from('operadores')
        .select('*')
        .eq('user_id', uid)
        .single()
      setOperador(op)
      if (op) {
        setFormPerfil({
          nombre: op.nombre || '',
          apellido: op.apellido || '',
          telefono: op.telefono || '',
          ciudad: op.ciudad || '',
          estado: op.estado || '',
          experiencia_anos: op.experiencia_anos || '',
          descripcion: op.descripcion || '',
          disponibilidad: op.disponibilidad || 'disponible',
        })
        setTextoExperiencia(op.experiencia_texto || '')
        if (op.foto_url) setFotoPreview(op.foto_url)
      }

      const { data: posts } = await supabase
        .from('aplicaciones')
        .select('*, solicitudes(id, folio, tipo_maquinaria, ciudad, estado, estatus, sueldo_pago, duracion, empresa_id, empresas(nombre_empresa))')
        .eq('operador_id', op?.id)
        .order('fecha', { ascending: false })
      setPostulaciones(posts || [])

      const { data: sus } = await supabase
        .from('suscripciones')
        .select('*, planes(nombre, precio, duracion)')
        .eq('user_id', uid)
        .eq('estatus', 'activa')
        .order('fecha_inicio', { ascending: false })
        .limit(1)
        .single()
      setSuscripcion(sus)

      setLoading(false)
    }
    cargar()
  }, [])

  const handleCancelarPostulacion = async (aplicacionId: string) => {
    await supabase
      .from('aplicaciones')
      .delete()
      .eq('id', aplicacionId)
    setPostulaciones(postulaciones.filter(p => p.id !== aplicacionId))
  }

  const handleGuardarPerfil = async () => {
    if (!operador) return
    setGuardando(true)
    await supabase.from('operadores').update(formPerfil).eq('id', operador.id)
    setOperador({ ...operador, ...formPerfil })
    setEditandoPerfil(false)
    setGuardando(false)
  }

  const handleGuardarExperiencia = async () => {
    if (!operador) return
    setGuardando(true)
    await supabase.from('operadores').update({ experiencia_texto: textoExperiencia }).eq('id', operador.id)
    setOperador({ ...operador, experiencia_texto: textoExperiencia })
    setEditandoExperiencia(false)
    setGuardando(false)
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  const handleSubirFoto = async () => {
    if (!fotoFile || !operador) return
    setSubiendo(true)
    const ext = fotoFile.name.split('.').pop()
    const nombre = `${operador.id}.${ext}`
    await supabase.storage.from('fotos-operadores').upload(nombre, fotoFile, { upsert: true })
    const { data: urlData } = supabase.storage.from('fotos-operadores').getPublicUrl(nombre)
    await supabase.from('operadores').update({ foto_url: urlData.publicUrl }).eq('id', operador.id)
    setOperador({ ...operador, foto_url: urlData.publicUrl })
    setSubiendo(false)
  }

  const handleSubirDocumentos = async () => {
    if (!operador) return
    setSubiendo(true)
    let licenciaUrl = operador.licencia_url
    let certUrls: string[] = operador.certificaciones || []

    if (licenciaFile) {
      const ext = licenciaFile.name.split('.').pop()
      const nombre = `${operador.id}-licencia.${ext}`
      await supabase.storage.from('certificaciones-operadores').upload(nombre, licenciaFile, { upsert: true })
      const { data: pub } = supabase.storage.from('certificaciones-operadores').getPublicUrl(nombre)
      licenciaUrl = pub.publicUrl
    }

    for (let i = 0; i < certFiles.length; i++) {
      const cert = certFiles[i]
      const ext = cert.name.split('.').pop()
      const nombre = `${operador.id}-cert-${Date.now()}-${i}.${ext}`
      await supabase.storage.from('certificaciones-operadores').upload(nombre, cert, { upsert: true })
      const { data: pub } = supabase.storage.from('certificaciones-operadores').getPublicUrl(nombre)
      certUrls.push(pub.publicUrl)
    }

    await supabase.from('operadores').update({ licencia_url: licenciaUrl, certificaciones: certUrls }).eq('id', operador.id)
    setOperador({ ...operador, licencia_url: licenciaUrl, certificaciones: certUrls })
    setLicenciaFile(null)
    setCertFiles([])
    setSubiendo(false)
  }

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Cargando...</div>
  if (!operador) return <div className="text-center py-20 text-sm text-gray-400">No se encontró el perfil</div>

  const tabs = [
    { id: 'perfil', label: '👷 Perfil' },
    { id: 'foto', label: '📷 Foto' },
    { id: 'maquinaria', label: '🔧 Maquinaria' },
    { id: 'documentos', label: '📄 Documentos' },
    { id: 'experiencia', label: '💼 Experiencia' },
    { id: 'postulaciones', label: '📋 Postulaciones' },
    { id: 'plan', label: '💳 Plan' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Mi cuenta</p>
            <h1 className="text-base font-black" style={{color: '#575757'}}>{operador.nombre} {operador.apellido}</h1>
          </div>
          <button onClick={handleCerrarSesion}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{
                backgroundColor: tab === t.id ? '#9A2120' : 'transparent',
                color: tab === t.id ? 'white' : '#575757'
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">

        {/* Tab Perfil */}
        {tab === 'perfil' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold" style={{color: '#575757'}}>Datos personales</h2>
                <button onClick={() => setEditandoPerfil(!editandoPerfil)}
                  className="text-xs px-3 py-1 rounded-full border"
                  style={{borderColor: '#9A2120', color: '#9A2120'}}>
                  {editandoPerfil ? 'Cancelar' : '✏️ Editar'}
                </button>
              </div>
              {editandoPerfil ? (
                <div className="flex flex-col gap-2">
                  {[
                    {label: 'Nombre', name: 'nombre'},
                    {label: 'Apellido', name: 'apellido'},
                    {label: 'Teléfono', name: 'telefono'},
                    {label: 'Ciudad', name: 'ciudad'},
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>{field.label}</label>
                      <input value={formPerfil[field.name] || ''} onChange={(e) => setFormPerfil({...formPerfil, [field.name]: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Años de experiencia</label>
                    <input type="number" value={formPerfil.experiencia_anos || ''} onChange={(e) => setFormPerfil({...formPerfil, experiencia_anos: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Disponibilidad</label>
                    <select value={formPerfil.disponibilidad} onChange={(e) => setFormPerfil({...formPerfil, disponibilidad: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                      <option value="disponible">Disponible</option>
                      <option value="no_disponible">No disponible</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Descripción breve</label>
                    <textarea value={formPerfil.descripcion || ''} onChange={(e) => setFormPerfil({...formPerfil, descripcion: e.target.value})}
                      rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" />
                  </div>
                  <button onClick={handleGuardarPerfil} disabled={guardando}
                    className="w-full py-2.5 rounded-xl text-white text-xs font-bold mt-2"
                    style={{backgroundColor: '#9A2120', opacity: guardando ? 0.7 : 1}}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {[
                    {label: 'Nombre', value: `${operador.nombre} ${operador.apellido}`},
                    {label: 'Teléfono', value: operador.telefono},
                    {label: 'Ciudad', value: `${operador.ciudad}, ${operador.estado}`},
                    {label: 'Tipo', value: operador.tipo_operador},
                    {label: 'Experiencia', value: `${operador.experiencia_anos} años`},
                    {label: 'Disponibilidad', value: operador.disponibilidad === 'disponible' ? '✅ Disponible' : '❌ No disponible'},
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-xs text-gray-400">{item.label}</span>
                      <span className="text-xs font-semibold">{item.value}</span>
                    </div>
                  ))}
                  {operador.descripcion && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">Descripción</p>
                      <p className="text-xs text-gray-600">{operador.descripcion}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Foto */}
        {tab === 'foto' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex flex-col items-center gap-4">
              <h2 className="text-sm font-bold self-start" style={{color: '#575757'}}>Foto de perfil</h2>
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto" className="w-32 h-32 rounded-full object-cover border-4" style={{borderColor: '#9A2120'}} />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                  <span className="text-4xl">📷</span>
                </div>
              )}
              <label className="w-full py-2.5 rounded-xl text-center text-xs font-bold border-2 cursor-pointer block"
                style={{borderColor: '#9A2120', color: '#9A2120'}}>
                {fotoFile ? '📷 Cambiar foto' : '📷 Seleccionar foto'}
                <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
              </label>
              {fotoFile && (
                <button onClick={handleSubirFoto} disabled={subiendo}
                  className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
                  style={{backgroundColor: '#9A2120', opacity: subiendo ? 0.7 : 1}}>
                  {subiendo ? 'Subiendo...' : 'Guardar foto'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Maquinaria */}
        {tab === 'maquinaria' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Maquinaria que operas</h2>
              {operador.maquinaria?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {operador.maquinaria.map((m: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full border"
                      style={{borderColor: '#9A2120', color: '#9A2120'}}>
                      {m}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No has agregado maquinaria aún</p>
              )}
              <a href="/mi-cuenta/operador/maquinaria"
                className="mt-4 w-full py-2.5 rounded-xl text-white text-xs font-bold text-center block"
                style={{backgroundColor: '#9A2120'}}>
                ✏️ Actualizar maquinaria
              </a>
            </div>
          </div>
        )}

        {/* Tab Documentos */}
        {tab === 'documentos' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Documentos</h2>
              {operador.licencia_url && (
                <div className="mb-3 p-2 bg-green-50 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-green-700">✅ Licencia subida</span>
                  <a href={operador.licencia_url} target="_blank" className="text-xs text-green-700 underline">Ver</a>
                </div>
              )}
              {operador.certificaciones?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold mb-2" style={{color: '#575757'}}>Certificaciones ({operador.certificaciones.length})</p>
                  {operador.certificaciones.map((cert: string, i: number) => (
                    <div key={i} className="p-2 bg-green-50 rounded-xl flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-green-700">✅ Certificación {i + 1}</span>
                      <a href={cert} target="_blank" className="text-xs text-green-700 underline">Ver</a>
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-3">
                <label className="text-xs font-bold block mb-1" style={{color: '#575757'}}>
                  🚗 {operador.licencia_url ? 'Reemplazar licencia' : 'Subir licencia'}
                </label>
                <label className="w-full py-2.5 rounded-xl text-center text-xs font-bold border-2 cursor-pointer block"
                  style={{borderColor: licenciaFile ? '#9A2120' : '#e5e7eb', color: licenciaFile ? '#9A2120' : '#6b7280'}}>
                  {licenciaFile ? `✅ ${licenciaFile.name}` : '📎 Seleccionar archivo'}
                  <input type="file" accept="image/*,.pdf" onChange={(e) => setLicenciaFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              </div>
              <div className="mb-3">
                <label className="text-xs font-bold block mb-1" style={{color: '#575757'}}>📜 Agregar certificaciones</label>
                <label className="w-full py-2.5 rounded-xl text-center text-xs font-bold border-2 cursor-pointer block"
                  style={{borderColor: certFiles.length > 0 ? '#9A2120' : '#e5e7eb', color: certFiles.length > 0 ? '#9A2120' : '#6b7280'}}>
                  {certFiles.length > 0 ? `✅ ${certFiles.length} archivo(s)` : '📎 Seleccionar archivos'}
                  <input type="file" accept="image/*,.pdf" multiple onChange={(e) => setCertFiles(Array.from(e.target.files || []))} className="hidden" />
                </label>
              </div>
              {(licenciaFile || certFiles.length > 0) && (
                <button onClick={handleSubirDocumentos} disabled={subiendo}
                  className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
                  style={{backgroundColor: '#9A2120', opacity: subiendo ? 0.7 : 1}}>
                  {subiendo ? 'Subiendo...' : 'Guardar documentos'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Experiencia */}
        {tab === 'experiencia' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold" style={{color: '#575757'}}>Mi experiencia</h2>
                <button onClick={() => setEditandoExperiencia(!editandoExperiencia)}
                  className="text-xs px-3 py-1 rounded-full border"
                  style={{borderColor: '#9A2120', color: '#9A2120'}}>
                  {editandoExperiencia ? 'Cancelar' : '✏️ Editar'}
                </button>
              </div>
              {editandoExperiencia ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-400">Describe tu experiencia laboral — empresas donde trabajaste, proyectos, logros. En tus propias palabras.</p>
                  <textarea value={textoExperiencia} onChange={(e) => setTextoExperiencia(e.target.value)}
                    rows={8} placeholder="Ejemplo: Trabajé 3 años en Construcciones del Norte operando excavadora Caterpillar 320..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" />
                  <button onClick={handleGuardarExperiencia} disabled={guardando}
                    className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
                    style={{backgroundColor: '#9A2120', opacity: guardando ? 0.7 : 1}}>
                    {guardando ? 'Guardando...' : 'Guardar experiencia'}
                  </button>
                </div>
              ) : (
                operador.experiencia_texto ? (
                  <p className="text-xs text-gray-600 leading-relaxed">{operador.experiencia_texto}</p>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-400 mb-3">Aún no has agregado tu experiencia</p>
                    <button onClick={() => setEditandoExperiencia(true)}
                      className="text-xs px-4 py-2 rounded-xl text-white font-bold"
                      style={{backgroundColor: '#9A2120'}}>
                      + Agregar experiencia
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Tab Postulaciones */}
        {tab === 'postulaciones' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{postulaciones.length} postulaciones</p>
              <a href="/solicitudes"
                className="text-xs px-3 py-1.5 rounded-full font-semibold text-white"
                style={{backgroundColor: '#9A2120'}}>
                + Ver oportunidades
              </a>
            </div>

            {postulaciones.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 text-center">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm text-gray-400 mb-3">No te has postulado a ninguna solicitud aún</p>
                <a href="/solicitudes"
                  className="text-xs px-4 py-2 rounded-xl text-white font-bold inline-block"
                  style={{backgroundColor: '#9A2120'}}>
                  Ver oportunidades
                </a>
              </div>
            ) : (
              postulaciones.map((post, i) => {
                const sol = post.solicitudes
                const empresa = sol?.empresas
                const tieneplan = !!suscripcion

                return (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                    {/* Estatus */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold" style={{color: '#9A2120'}}>#{sol?.folio}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: post.estatus === 'aceptado' ? '#dcfce7' : post.estatus === 'rechazado' ? '#fee2e2' : '#fef9c3',
                          color: post.estatus === 'aceptado' ? '#16a34a' : post.estatus === 'rechazado' ? '#dc2626' : '#ca8a04'
                        }}>
                        {post.estatus === 'aceptado' ? '✅ Aceptado' : post.estatus === 'rechazado' ? '❌ Rechazado' : '⏳ Pendiente'}
                      </span>
                    </div>

                    {/* Info solicitud */}
                    <p className="text-sm font-bold" style={{color: '#575757'}}>{sol?.tipo_maquinaria}</p>
                    <p className="text-xs text-gray-400">📍 {sol?.ciudad}, {sol?.estado}</p>
                    <p className="text-xs text-gray-400">⏱ {sol?.duracion}</p>
                    {sol?.sueldo_pago && (
                      <p className="text-xs font-bold mt-1" style={{color: '#9A2120'}}>
                        💰 ${sol?.sueldo_pago?.toLocaleString('es-MX')} MXN
                      </p>
                    )}

                    {/* Empresa — bloqueada o visible según plan */}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      {tieneplan ? (
                        <p className="text-xs font-semibold" style={{color: '#575757'}}>
                          🏢 {empresa?.nombre_empresa || 'Empresa'}
                        </p>
                      ) : (
                        <div className="rounded-xl p-2 flex items-center justify-between"
                          style={{backgroundColor: '#fff5f5', border: '1px dashed #9A2120'}}>
                          <div>
                            <p className="text-xs font-bold" style={{color: '#9A2120'}}>🔒 Empresa bloqueada</p>
                            <p className="text-[10px] text-gray-400">Activa un plan para ver quién te contrataría</p>
                          </div>
                          <a href="/planes"
                            className="text-[10px] px-2 py-1 rounded-full text-white font-bold"
                            style={{backgroundColor: '#9A2120'}}>
                            Ver planes
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Cancelar postulación */}
                    {post.estatus === 'pendiente' && (
                      <button
                        onClick={() => handleCancelarPostulacion(post.id)}
                        className="mt-2 w-full py-1.5 rounded-xl text-xs font-bold border-2"
                        style={{borderColor: '#e5e7eb', color: '#6b7280'}}>
                        Cancelar postulación
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Tab Plan */}
        {tab === 'plan' && (
          <div className="flex flex-col gap-3">
            {suscripcion ? (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                <h2 className="text-sm font-bold mb-3" style={{color: '#575757'}}>Plan activo</h2>
                <p className="text-base font-black" style={{color: '#9A2120'}}>{suscripcion.planes?.nombre}</p>
                <p className="text-xs text-gray-400">${suscripcion.planes?.precio?.toLocaleString('es-MX')} MXN</p>
                {suscripcion.fecha_fin && (
                  <p className="text-xs text-gray-400 mt-1">
                    Vence: {new Date(suscripcion.fecha_fin).toLocaleDateString('es-MX')}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm font-bold mb-1" style={{color: '#575757'}}>Sin plan activo</p>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  Con un plan puedes ver qué empresas buscan operadores como tú y contactarlas directamente.
                </p>
                <a href="/planes"
                  className="w-full py-2.5 rounded-xl text-white text-xs font-bold text-center block"
                  style={{backgroundColor: '#9A2120'}}>
                  Ver planes desde $99 MXN
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default function PerfilOperador() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-gray-400">Cargando...</div>}>
      <PerfilOperadorContent />
    </Suspense>
  )
}