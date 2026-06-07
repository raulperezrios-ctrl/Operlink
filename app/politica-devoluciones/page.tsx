export default function PoliticaDevoluciones() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <a href="/" className="text-gray-400 text-sm">← Volver</a>
        <h1 className="text-lg font-black mt-2" style={{color: '#575757'}}>Política de Devoluciones y Cancelaciones</h1>
        <p className="text-xs text-gray-400">Última actualización: Junio 2026</p>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6 max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-600 leading-relaxed">
            La presente política establece las condiciones bajo las cuales <strong>OperLink</strong>, marca comercial de <strong>Maquinaria Ligera Pinzsa SA de CV</strong>, RFC <strong>MLP190123MW8</strong>, gestiona las solicitudes de devolución, cancelación y reembolso de sus servicios digitales.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>1. Naturaleza del servicio</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            OperLink es una plataforma digital de servicios. Al adquirir un plan de membresía o paquete de contactos, el usuario accede de forma inmediata a los beneficios del servicio contratado. Por la naturaleza digital e inmediata del servicio, las devoluciones están sujetas a las condiciones descritas a continuación.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>2. Cancelaciones</h2>
          <ul className="text-xs text-gray-600 flex flex-col gap-2">
            <li>• Los planes de membresía pueden cancelarse en cualquier momento desde la cuenta del usuario.</li>
            <li>• Al cancelar, el usuario conserva acceso al servicio hasta el fin del período pagado.</li>
            <li>• Los contactos de operadores ya desbloqueados permanecen accesibles de forma permanente, independientemente de la cancelación del plan.</li>
            <li>• No se realizan cargos adicionales tras la cancelación.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>3. Devoluciones y reembolsos</h2>
          <ul className="text-xs text-gray-600 flex flex-col gap-2">
            <li>• Se aceptan solicitudes de reembolso dentro de las <strong>primeras 24 horas</strong> posteriores a la compra, siempre que no se hayan desbloqueado contactos de operadores.</li>
            <li>• Si se han desbloqueado uno o más contactos de operadores, no procede el reembolso total. Se evaluará un reembolso parcial proporcional a los contactos no utilizados.</li>
            <li>• No se realizan reembolsos por planes vencidos o expirados.</li>
            <li>• No se realizan reembolsos por paquetes de contactos una vez utilizados.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>4. Proceso para solicitar un reembolso</h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">Para solicitar un reembolso el usuario debe:</p>
          <ul className="text-xs text-gray-600 flex flex-col gap-1">
            <li>1. Enviar un correo a <strong>pagos@operlink.mx</strong> dentro de las primeras 24 horas de la compra.</li>
            <li>2. Incluir su nombre completo, correo registrado y número de transacción.</li>
            <li>3. Describir el motivo de la solicitud.</li>
          </ul>
          <p className="text-xs text-gray-400 mt-3">La solicitud será revisada en un plazo máximo de 5 días hábiles.</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>5. Errores en el cobro</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Si se realizó un cobro incorrecto o duplicado, OperLink realizará el reembolso total sin condiciones dentro de los 5 días hábiles siguientes a la confirmación del error. Para reportar un cobro incorrecto contáctenos a <strong>pagos@operlink.mx</strong> o al <strong>33 3458 8117</strong>.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>6. Contracargos</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Antes de iniciar un contracargo con su banco, le solicitamos contactarnos directamente. La mayoría de los casos se resuelven de forma rápida y amigable. Los contracargos injustificados pueden resultar en la suspensión de la cuenta.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold mb-2" style={{color: '#9A2120'}}>7. Contacto</h2>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">📧 <strong>pagos@operlink.mx</strong></p>
            <p className="text-xs text-gray-600">📞 <strong>33 3458 8117</strong></p>
            <p className="text-xs text-gray-600">📍 Calle José Antonio Torres 3337, Col. Loma Bonita Ejidal, Zapopan, Jalisco, C.P. 45085</p>
          </div>
        </div>

      </div>
    </div>
  )
}