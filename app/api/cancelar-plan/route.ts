import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { conektaCustomerId, suscripcionId, userId } = await req.json()

    // 1. Cancelar suscripción en Conekta
    if (conektaCustomerId) {
      await fetch(`https://api.conekta.io/customers/${conektaCustomerId}/subscription`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/vnd.conekta-v2.1.0+json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CONEKTA_PRIVATE_KEY}`,
        },
      })
    }

    // 2. Marcar suscripción como cancelada en Supabase
    await supabase
      .from('suscripciones')
      .update({ estatus: 'cancelada' })
      .eq('id', suscripcionId)

    // 3. Marcar membresía como cancelada en empresa (pero mantener acceso hasta fecha fin)
    await supabase
      .from('empresas')
      .update({ membresia_activa: false })
      .eq('user_id', userId)

    return NextResponse.json({ ok: true })

  } catch (error: any) {
    console.error('Error cancelando plan:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}