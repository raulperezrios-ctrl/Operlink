import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { planId, userId, nombre, correo, tokenId } = await req.json()

    // 1. Obtener el plan
    const { data: plan } = await supabase
      .from('planes')
      .select('*')
      .eq('id', planId)
      .single()

    if (!plan) return NextResponse.json({ error: 'Plan no encontrado' }, { status: 400 })

    // 2. Crear orden en Conekta con el token
    const ordenRes = await fetch('https://api.conekta.io/orders', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.conekta-v2.1.0+json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CONEKTA_PRIVATE_KEY}`,
      },
      body: JSON.stringify({
        currency: 'MXN',
        customer_info: {
          name: nombre,
          email: correo,
        },
        line_items: [{
          name: plan.nombre,
          unit_price: plan.precio * 100,
          quantity: 1,
        }],
        charges: [{
          payment_method: {
            type: 'card',
            token_id: tokenId,
          }
        }]
      })
    })

    const ordenData = await ordenRes.json()
    if (!ordenRes.ok) return NextResponse.json({ error: ordenData.details?.[0]?.message || 'Error al procesar pago' }, { status: 400 })

    // 3. Activar membresía en Supabase
    const fechaFin = new Date()
    if (plan.duracion === 'mensual') fechaFin.setMonth(fechaFin.getMonth() + 1)
    if (plan.duracion === 'anual') fechaFin.setFullYear(fechaFin.getFullYear() + 1)

    await supabase
      .from('empresas')
      .update({
        membresia_activa: true,
        contactos_disponibles: plan.contactos,
      })
      .eq('user_id', userId)

    await supabase.from('suscripciones').insert({
      user_id: userId,
      plan_id: planId,
      tipo_usuario: 'empresa',
      estatus: 'activa',
      contactos_disponibles: plan.contactos,
      fecha_fin: plan.duracion === 'por_contacto' || plan.duracion === 'paquete' ? null : fechaFin.toISOString(),
      conekta_order_id: ordenData.id,
    })

    await supabase.from('pagos').insert({
      comprador_id: userId,
      comprador_tipo: 'empresa',
      concepto: plan.nombre,
      monto: plan.precio,
      stripe_id: ordenData.id,
      estatus: 'completado',
    })

    return NextResponse.json({ success: true, orden: ordenData.id })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}