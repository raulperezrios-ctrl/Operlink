'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    operadores: 0,
    empresas: 0,
    solicitudes: 0,
    usuarios: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [op, em, sol, us] = await Promise.all([
        supabase.from('operadores').select('id', { count: 'exact', head: true }),
        supabase.from('empresas').select('id', { count: 'exact', head: true }),
        supabase.from('solicitudes').select('id', { count: 'exact', head: true }),
        supabase.from('usuarios').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        operadores: op.count || 0,
        empresas: em.count || 0,
        solicitudes: sol.count || 0,
        usuarios: us.count || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const menu = [
    { href: '/admin/operadores', emoji: '👷', label: 'Operadores', count: stats.operadores },
    { href: '/admin/empresas', emoji: '🏢', label: 'Empresas', count: stats.empresas },
    { href: '/admin/solicitudes', emoji: '📋', label: 'Solicitudes', count: stats.solicitudes },
    { href: '/admin/pagos', emoji: '💳', label: 'Pagos', count: 0 },
    { href: '/admin/usuarios', emoji: '👥', label: 'Usuarios', count: stats.usuarios },
  ]

  return (
    <div className="bg-gray-50 min-h-screen pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <img src="/Logo_OperLink.png" alt="OperLink" className="h-6" />
      </div>

      {/* Bienvenida */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-base font-black" style={{color: '#152337'}}>Panel de administración</h1>
        <p className="text-xs text-gray-400 mt-0.5">Gestiona todo desde aquí</p>
      </div>

      {/* Cards */}
      <div className="px-4 grid grid-cols-2 gap-2">
        {menu.map((item, i) => (
          <Link href={item.href} key={i}>
            <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 active:scale-95 transition-transform">
              <span className="text-xl">{item.emoji}</span>
              <p className="text-2xl font-black mt-1" style={{color: '#9A2120'}}>
                {loading ? '...' : item.count}
              </p>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-xs font-semibold mt-1" style={{color: '#152337'}}>Ver todos →</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}