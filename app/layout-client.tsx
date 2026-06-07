'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<any>(null)
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const session = sessionData.session
        const userId = session?.user?.id
        setSesion(session)

        if (userId) {
          const { data: usuario } = await supabase
            .from('usuarios')
            .select('tipo')
            .eq('id', userId)
            .single()

          const tipo = usuario?.tipo || null
          setTipoUsuario(tipo)

          if (tipo === 'operador') {
            const { data: op } = await supabase
              .from('operadores')
              .select('nombre')
              .eq('user_id', userId)
              .single()
            setNombreUsuario(op?.nombre || null)
          } else if (tipo === 'empresa') {
            const { data: emp } = await supabase
              .from('empresas')
              .select('nombre_contacto')
              .eq('user_id', userId)
              .single()
            setNombreUsuario(emp?.nombre_contacto?.split(' ')[0] || null)
          } else if (tipo === 'admin') {
            setNombreUsuario('Admin')
          }
        }
      } catch (e) {
        console.error('Error cargando sesión:', e)
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [])

  const cuentaUrl = () => {
    if (!sesion) return '/login'
    if (tipoUsuario === 'operador') return '/mi-cuenta/operador'
    if (tipoUsuario === 'empresa') return '/mi-cuenta/empresa'
    if (tipoUsuario === 'admin') return '/admin'
    return '/login'
  }

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const menuContenido = () => {
    if (cargando) return (
      <div className="flex items-center justify-center py-10">
        <p className="text-xs text-gray-400">Cargando...</p>
      </div>
    )

    if (!sesion) return (
      <>
        {/* Iniciar sesión — botón principal */}
        <a href="/login" onClick={() => setMenuAbierto(false)}
          className="w-full py-3 rounded-xl text-white text-sm font-bold text-center block mb-4"
          style={{backgroundColor: '#9A2120'}}>
          Iniciar sesión
        </a>

        {/* Navegación */}
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Navegación</p>
        <a href="/" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          🏠 Inicio
        </a>
        <a href="/operadores" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          👷 Ver operadores
        </a>
        <a href="/solicitudes" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          📋 Solicitudes
        </a>
        <a href="/planes" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          💳 Planes
        </a>

        {/* Únete */}
        <div className="border-t border-gray-100 my-3" />
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Únete a OperLink</p>
        <a href="/registro-operador" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          👷 Soy Operador
        </a>
        <a href="/registro-empresa" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          🏢 Soy Empresa
        </a>
      </>
    )

    if (tipoUsuario === 'operador') return (
      <>
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Mi cuenta — Operador</p>
        <a href="/mi-cuenta/operador" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          👷 Mi perfil
        </a>
        <a href="/solicitudes" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          📋 Oportunidades
        </a>
        <a href="/planes?tipo=operador" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          💳 Planes
        </a>
        <div className="border-t border-gray-100 my-2" />
        <button onClick={handleCerrarSesion}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 w-full text-left">
          🚪 Cerrar sesión
        </button>
      </>
    )

    if (tipoUsuario === 'empresa') return (
      <>
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Mi cuenta — Empresa</p>
        <a href="/mi-cuenta/empresa" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          🏢 Mi perfil
        </a>
        <a href="/operadores" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          👷 Buscar operadores
        </a>
        <a href="/mi-cuenta/empresa?tab=solicitudes" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          📋 Mis solicitudes
        </a>
        <a href="/planes" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          💳 Planes
        </a>
        <div className="border-t border-gray-100 my-2" />
        <button onClick={handleCerrarSesion}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 w-full text-left">
          🚪 Cerrar sesión
        </button>
      </>
    )

    if (tipoUsuario === 'admin') return (
      <>
        <a href="/admin" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          ⚙️ Panel Admin
        </a>
        <div className="border-t border-gray-100 my-2" />
        <button onClick={handleCerrarSesion}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 w-full text-left">
          🚪 Cerrar sesión
        </button>
      </>
    )

    return (
      <>
        <button onClick={handleCerrarSesion}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 w-full text-left">
          🚪 Cerrar sesión
        </button>
      </>
    )
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <a href="/">
          <img src="/Logo_OperLink.png" alt="OperLink" className="h-8 object-contain" />
        </a>
        <div className="flex items-center gap-2">
          {!cargando && sesion && nombreUsuario ? (
            <a href={cuentaUrl()}
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{backgroundColor: '#fff5f5', color: '#9A2120'}}>
              👤 {nombreUsuario}
            </a>
          ) : !cargando && !sesion ? (
            <a href="/login"
              className="text-xs font-semibold px-3 py-1 rounded-full border"
              style={{borderColor: '#9A2120', color: '#9A2120'}}>
              Iniciar sesión
            </a>
          ) : null}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-700">
            {menuAbierto ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Menú hamburguesa */}
      {menuAbierto && (
        <div className="fixed inset-0 z-30 flex">
          <div className="flex-1 bg-black/40" onClick={() => setMenuAbierto(false)} />
          <div className="w-72 bg-white h-full shadow-xl flex flex-col">
            <div className="px-4 py-5 border-b border-gray-100 flex items-center justify-between">
              <img src="/Logo_OperLink.png" alt="OperLink" className="h-7" />
              <button onClick={() => setMenuAbierto(false)} className="text-gray-400 text-lg">✕</button>
            </div>
            <div className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
              {menuContenido()}
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      {/* Navbar inferior — 3 botones */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10"
        style={{boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'}}>
        <div className="flex items-end justify-around px-8 py-2">

          {/* Inicio */}
          <a href="/" className="flex flex-col items-center gap-1 py-1 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium text-gray-400">Inicio</span>
          </a>

          {/* Buscar — botón central destacado */}
          <a href="/empresas" className="flex flex-col items-center gap-1 -mt-5">
            <div className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
              style={{backgroundColor: '#9A2120'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold" style={{color: '#9A2120'}}>Buscar</span>
          </a>

          {/* Cuenta */}
          <a href={cuentaUrl()} className="flex flex-col items-center gap-1 py-1 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke={!cargando && sesion ? '#9A2120' : '#9ca3af'} strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium"
              style={{color: !cargando && sesion ? '#9A2120' : '#9ca3af'}}>
              {!cargando && sesion && nombreUsuario ? nombreUsuario : 'Cuenta'}
            </span>
          </a>

        </div>
      </nav>
    </>
  )
}