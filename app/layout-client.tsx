'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<any>(null)
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const cargar = async () => {
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

        if (usuario?.tipo === 'operador') {
          const { data: op } = await supabase
            .from('operadores')
            .select('nombre')
            .eq('user_id', userId)
            .single()
          setNombreUsuario(op?.nombre || null)
        } else if (usuario?.tipo === 'empresa') {
          const { data: emp } = await supabase
            .from('empresas')
            .select('nombre_contacto')
            .eq('user_id', userId)
            .single()
          setNombreUsuario(emp?.nombre_contacto?.split(' ')[0] || null)
        } else if (usuario?.tipo === 'admin') {
          setNombreUsuario('Admin')
        }
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

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <a href="/">
          <img src="/Logo_OperLink.png" alt="OperLink" className="h-8 object-contain" />
        </a>
        <div className="flex items-center gap-2">
          {sesion && nombreUsuario && (
            <a href={cuentaUrl()}
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{backgroundColor: '#fff5f5', color: '#9A2120'}}>
              👤 {nombreUsuario}
            </a>
          )}
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
          {/* Fondo oscuro */}
          <div className="flex-1 bg-black/40" onClick={() => setMenuAbierto(false)} />

          {/* Panel */}
          <div className="w-72 bg-white h-full shadow-xl flex flex-col">
            <div className="px-4 py-5 border-b border-gray-100 flex items-center justify-between">
              <img src="/Logo_OperLink.png" alt="OperLink" className="h-7" />
              <button onClick={() => setMenuAbierto(false)} className="text-gray-400 text-lg">✕</button>
            </div>

            <div className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
              {!sesion ? (
                <>
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

                  <div className="border-t border-gray-100 my-2" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Únete a OperLink</p>
                  <a href="/registro-operador" onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{backgroundColor: '#9A2120'}}>
                    👷 Soy Operador
                  </a>
                  <a href="/registro-empresa" onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold border-2 mt-1"
                    style={{borderColor: '#9A2120', color: '#9A2120'}}>
                    🏢 Soy Empresa
                  </a>

                  <div className="border-t border-gray-100 my-2" />
                  <a href="/login" onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    🔑 Iniciar sesión
                  </a>
                </>
              ) : tipoUsuario === 'operador' ? (
                <>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Mi cuenta</p>
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
              ) : tipoUsuario === 'empresa' ? (
                <>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Mi cuenta</p>
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
              ) : tipoUsuario === 'admin' ? (
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
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Navbar inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-end z-10">
        <a href="/" className="flex flex-col items-center text-gray-400 text-[10px] gap-0.5">
          <span className="text-xl">🏠</span>
          <span>Inicio</span>
        </a>
        <a href="/operadores" className="flex flex-col items-center text-gray-400 text-[10px] gap-0.5">
          <span className="text-xl">👷</span>
          <span>Operadores</span>
        </a>
        <a href="/empresas" className="flex flex-col items-center text-[10px] gap-0.5">
          <div className="h-12 w-12 rounded-full flex items-center justify-center -mt-5 shadow-lg text-white text-xl" style={{backgroundColor: '#9A2120'}}>🔍</div>
          <span style={{color: '#9A2120'}}>Buscar</span>
        </a>
        <a href="/solicitudes" className="flex flex-col items-center text-gray-400 text-[10px] gap-0.5">
          <span className="text-xl">📋</span>
          <span>Solicitudes</span>
        </a>
        <a href={cuentaUrl()} className="flex flex-col items-center text-[10px] gap-0.5"
          style={{color: sesion ? '#9A2120' : '#9ca3af'}}>
          <span className="text-xl">{sesion ? '👤' : '👤'}</span>
          <span>{sesion ? (nombreUsuario || 'Cuenta') : 'Cuenta'}</span>
        </a>
      </nav>
    </>
  )
}