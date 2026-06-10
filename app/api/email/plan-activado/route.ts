import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { nombre, correo, plan, contactos } = await req.json()

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
      subject: `¡Tu plan ${plan} está activo, ${nombre}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #575757;">

          <div style="padding: 25px 20px 0 20px; text-align: center;">
            <img src="https://www.operlink.mx/Logo_OperLink.png" alt="OperLink" style="height: 80px; object-fit: contain;" />
          </div>
          <div style="height: 4px; background-color: #9A2120; margin: 15px 0 0 0;"></div>

          <div style="padding: 30px 20px;">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>¡Tu pago fue procesado exitosamente! Tu plan <strong>${plan}</strong> ya está activo y puedes comenzar a contactar operadores de inmediato.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <p><strong>Resumen de tu plan</strong></p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>Plan contratado</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">${plan}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>Contactos disponibles</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">${contactos} contactos para desbloquear</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>¿Cómo desbloquear un contacto?</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Busca el operador que necesitas, entra a su perfil y haz clic en "Ver contacto"</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <strong>¿Necesitas ayuda?</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Escríbenos a contacto@operlink.mx y con gusto te orientamos</span>
                </td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <div style="text-align: center; margin: 25px 0;">
              <a href="https://www.operlink.mx/empresas"
                style="background-color: #9A2120; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Ver operadores
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
    console.error('Error enviando correo plan activado:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}