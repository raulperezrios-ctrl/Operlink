import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { nombre, correo } = await req.json()

    const transporter = nodemailer.createTransport({
      host: 'smtp.ionos.mx',
      port: 465,
      secure: true,
      auth: {
        user: 'contacto@operlink.mx',
        pass: 'Operlink2024',
      },
    })

    await transporter.sendMail({
      from: '"OperLink" <contacto@operlink.mx>',
      to: correo,
      subject: `¡Tu perfil fue verificado, ${nombre}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #575757;">

          <div style="padding: 25px 20px 0 20px; text-align: center;">
            <img src="https://www.operlink.mx/Logo_OperLink.png" alt="OperLink" style="height: 80px; object-fit: contain;" />
          </div>
          <div style="height: 4px; background-color: #9A2120; margin: 15px 0 0 0;"></div>

          <div style="padding: 30px 20px;">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>¡Excelentes noticias! Tu perfil en OperLink ha sido <strong>verificado</strong> por nuestro equipo.</p>

            <p>Esto significa que las empresas verán el sello <strong>✔ Verificado</strong> en tu perfil, lo que genera más confianza y aumenta tus posibilidades de ser contactado.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <p><strong>¿Qué significa estar verificado?</strong></p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>Perfil destacado</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Tu perfil aparece con sello de verificación en el catálogo</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>Mayor confianza</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Las empresas prefieren contactar operadores verificados</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <strong>Más oportunidades</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Aumentas tus posibilidades de recibir contactos de empresas</span>
                </td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <div style="text-align: center; margin: 25px 0;">
              <a href="https://www.operlink.mx/mi-cuenta/operador"
                style="background-color: #9A2120; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Ver mi perfil
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <p>
              Correo: <a href="mailto:contacto@operlink.mx" style="color: #9A2120;">contacto@operlink.mx</a><br/>
              Web: <a href="https://www.operlink.mx" style="color: #9A2120;">www.operlink.mx</a>
            </p>

            <p>Estamos para servirte,</p>
            <p style="margin-top: 15px;"><strong>Raul Perez</strong><br/>OperLink</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 10px; color: #9ca3af; text-align: center;">
              OperLink es una marca de Maquinaria Ligera Pinzsa SA de CV<br/>
              Si no creaste esta cuenta, ignora este correo.
            </p>
          </div>

        </div>
      `,
    })

    return NextResponse.json({ ok: true })

  } catch (error: any) {
    console.error('Error enviando correo verificado:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}