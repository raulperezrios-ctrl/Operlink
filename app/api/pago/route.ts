import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { planId, userId, nombre, correo, tarjeta, expMes, expAnio, cvc } = await req.json()

    // 1. Obtener el plan
    const { data: plan } = await supabase
      .from('planes')
      .select('*')
      .eq('id', planId)
      .single()

    if (!plan) return NextResponse.json({ error: 'Plan no encontrado' }, { status: 400 })

    // 2. Crear token de tarjeta en Conekta
    const tokenRes = await fetch('https://api.conekta.io/tokens', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.conekta-v2.1.0+json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CONEKTA_PRIVATE_KEY}`,
      },
      body: JSON.stringify({
        card: {
          number: tarjeta,
          name: nombre,
          exp_year: expAnio,
          exp_month: expMes,
          cvc: cvc,
        }
      })
    })

    const tokenData = await tokenRes.json()
    if (!tokenRes.ok) return NextResponse.json({ error: tokenData.details?.[0]?.message || 'Error al procesar tarjeta' }, { status: 400 })

    // 3. Crear orden en Conekta
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
          unit_price: plan.precio * 100, // Conekta usa centavos
          quantity: 1,
        }],
        charges: [{
          payment_method: {
            type: 'card',
            token_id: tokenData.id,
          }
        }]
      })
    })

    const ordenData = await ordenRes.json()
    if (!ordenRes.ok) return NextResponse.json({ error: ordenData.details?.[0]?.message || 'Error al procesar pago' }, { status: 400 })

    // 4. Activar membresía en Supabase
    const fechaFin = new Date()
    if (plan.duracion === 'mensual') fechaFin.setMonth(fechaFin.getMonth() + 1)
    if (plan.duracion === 'anual') fechaFin.setFullYear(fechaFin.getFullYear() + 1)

    // Actualizar empresa
    await supabase
      .from('empresas')
      .update({
        membresia_activa: true,
        contactos_disponibles: plan.contactos,
      })
      .eq('user_id', userId)

    // Registrar suscripción
    await supabase.from('suscripciones').insert({
      user_id: userId,
      plan_id: planId,
      tipo_usuario: 'empresa',
      estatus: 'activa',
      contactos_disponibles: plan.contactos,
      fecha_fin: plan.duracion === 'por_contacto' || plan.duracion === 'paquete' ? null : fechaFin.toISOString(),
      conekta_order_id: ordenData.id,
    })

    // Registrar pago
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