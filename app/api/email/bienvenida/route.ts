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
      subject: `¡Bienvenido a OperLink, ${nombre}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #575757;">

          <div style="padding: 25px 20px 0 20px; text-align: center;">
            <img src="https://www.operlink.mx/Logo_OperLink.png" alt="OperLink" style="height: 80px; object-fit: contain;" />
          </div>
          <div style="height: 4px; background-color: #9A2120; margin: 15px 0 0 0;"></div>

          <div style="padding: 30px 20px;">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>¡Bienvenido a OperLink! Nos da mucho gusto que seas parte de nuestra comunidad de operadores de maquinaria en México.</p>

            <p>Tu perfil ya está registrado y próximamente las empresas podrán encontrarte en nuestro catálogo.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <p><strong>Completa tu perfil para mejores resultados</strong></p>
            <p>Nuestra recomendación es que llenes la mayor cantidad de información posible en tu perfil — esto ayuda a las empresas a tomar una mejor decisión al momento de elegir un operador.</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>Foto de perfil</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Los operadores con foto reciben hasta 3x más contactos</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>Maquinaria que operas</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Especifica qué equipos sabes operar</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>Licencia de conducir</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Genera más confianza con las empresas</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                  <strong>Certificaciones</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Demuestra tu nivel profesional y destaca entre otros operadores</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <strong>Experiencia laboral</strong><br/>
                  <span style="font-size: 13px; color: #6b7280;">Cuéntanos dónde has trabajado y qué proyectos has realizado</span>
                </td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <div style="text-align: center; margin: 25px 0;">
              <a href="https://www.operlink.mx/mi-cuenta/operador"
                style="background-color: #9A2120; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Completar mi perfil
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <p>
              Correo: <a href="mailto:contacto@operlink.mx" style="color: #9A2120;">contacto@operlink.mx</a><br/>
              Web: <a href="https://www.operlink.mx" style="color: #9A2120;">www.operlink.mx</a>
            </p>

            <p>Estamos para servirte,</p><p style="margin-top: 15px;"><strong>Raul Perez</strong><br/>OperLink</p>

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
    console.error('Error enviando correo:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}