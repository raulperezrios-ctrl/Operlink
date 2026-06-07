export default function AvisoPrivacidad() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <a href="/" className="text-gray-400 text-sm">← Volver</a>
        <h1 className="text-lg font-black mt-2" style={{color: '#575757'}}>Aviso de Privacidad</h1>
        <p className="text-xs text-gray-400">Última actualización: Junio 2026</p>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6 max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-600 leading-relaxed">
            En cumplimiento con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento, <strong>Maquinaria Ligera Pinzsa SA de CV</strong>, con RFC <strong>MLP190123MW8</strong>, con domicilio en Calle José Antonio Torres 3337, Colonia Loma Bonita Ejidal, Zapopan, Jalisco, C.P. 45085, es responsable del tratamiento de sus datos personales a través de la plataforma <strong>OperLink</strong> (www.operlink.mx), marca comercial de Maquinaria Ligera Pinzsa SA de CV.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>¿Qué datos personales recopilamos?</h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">Recopilamos los siguientes datos personales:</p>
          <ul className="text-xs text-gray-600 flex flex-col gap-1">
            <li>• Nombre completo</li>
            <li>• Correo electrónico</li>
            <li>• Número de teléfono</li>
            <li>• Domicilio o ubicación</li>
            <li>• Información profesional (experiencia, maquinaria, certificaciones)</li>
            <li>• Información de empresa (razón social, industria, RFC)</li>
            <li>• Datos de pago (procesados de forma segura por Conekta)</li>
            <li>• Fotografías y documentos de identificación</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>¿Para qué usamos sus datos?</h2>
          <ul className="text-xs text-gray-600 flex flex-col gap-1">
            <li>• Crear y gestionar su cuenta en OperLink</li>
            <li>• Conectar operadores con empresas que requieren sus servicios</li>
            <li>• Procesar pagos y suscripciones</li>
            <li>• Verificar identidad y documentos de operadores</li>
            <li>• Enviar notificaciones relacionadas con el servicio</li>
            <li>• Mejorar la plataforma y experiencia del usuario</li>
            <li>• Cumplir con obligaciones legales y fiscales</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>¿Con quién compartimos sus datos?</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            OperLink comparte datos de contacto de operadores únicamente con empresas que hayan adquirido un plan activo y desbloqueado dicho contacto. No vendemos ni transferimos datos a terceros con fines comerciales. Los datos de pago son procesados por <strong>Conekta</strong> bajo sus propios estándares de seguridad.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>¿Cómo protegemos sus datos?</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Contamos con medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción, uso, acceso o divulgación no autorizados. Utilizamos Supabase como plataforma de base de datos con encriptación y acceso controlado.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>Derechos ARCO</h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer estos derechos contáctenos:
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">📧 <strong>contacto@operlink.mx</strong></p>
            <p className="text-xs text-gray-600">📞 <strong>33 3458 8117</strong></p>
            <p className="text-xs text-gray-600">📍 Calle José Antonio Torres 3337, Col. Loma Bonita Ejidal, Zapopan, Jalisco, C.P. 45085</p>
          </div>
          <p className="text-xs text-gray-400 mt-3">Su solicitud será atendida en un plazo máximo de 20 días hábiles.</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>Cambios al Aviso de Privacidad</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Maquinaria Ligera Pinzsa SA de CV se reserva el derecho de modificar este aviso en cualquier momento. Cualquier cambio será notificado a través de www.operlink.mx.
          </p>
        </div>

      </div>
    </div>
  )
}