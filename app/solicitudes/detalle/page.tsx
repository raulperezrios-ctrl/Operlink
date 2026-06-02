export default function DetalleSolicitud() {
  return (
    <div className="bg-gray-50 pb-6">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-gray-400 font-mono">OPL-20260523-0001</span>
            <h1 className="text-lg font-black" style={{color: '#575757'}}>Tractocamión</h1>
            <p className="text-xs text-gray-500">Construcciones del Pacífico</p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
            Activa
          </span>
        </div>
      </div>

      {/* Info principal */}
      <div className="px-4 py-4 bg-white mt-2 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          {[
            {label: 'Ciudad', value: 'Guadalajara, JAL', emoji: '📍'},
            {label: 'Tipo', value: 'Máquina con Operador', emoji: '🔧'},
            {label: 'Fecha inicio', value: '01 Jun 2026', emoji: '📅'},
            {label: 'Duración', value: '3 meses', emoji: '⏱️'},
            {label: 'Presupuesto', value: '$850 / día', emoji: '💰'},
            {label: 'Prioridad', value: 'Alta', emoji: '🔴'},
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400">{item.emoji} {item.label}</p>
              <p className="text-xs font-bold mt-0.5" style={{color: '#575757'}}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div className="px-4 py-4 bg-white mt-2 border-b border-gray-100">
        <h2 className="text-sm font-bold mb-2" style={{color: '#575757'}}>Descripción del trabajo</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Se requiere tractocamión con operador para traslado de materiales de construcción entre Guadalajara y Zapopan. 
          Trabajo de lunes a sábado, horario de 7am a 5pm. Experiencia mínima de 3 años en manejo de tractocamión. 
          Documentación en regla requerida.
        </p>
      </div>

      {/* Operadores que aplicaron */}
      <div className="px-4 py-4 bg-white mt-2 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold" style={{color: '#575757'}}>Operadores que aplicaron</h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{backgroundColor: '#9A2120'}}>3</span>
        </div>

        <div className="flex flex-col gap-2">
          {[
            {img: '/Operador_Tractocamion.png', ciudad: 'Guadalajara, JAL', exp: '6 años', estatus: 'Pendiente'},
            {img: '/Operador_MAquinaria.png', ciudad: 'Zapopan, JAL', exp: '8 años', estatus: 'Revisado'},
            {img: '/Operador_Montacargas1.png', ciudad: 'Tlaquepaque, JAL', exp: '4 años', estatus: 'Pendiente'},
          ].map((op, i) => (
            <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
              <img src={op.img} alt="Operador" className="h-12 w-12 rounded-full object-cover object-top" />
              <div className="flex-1">
                <p className="text-xs font-bold" style={{color: '#575757'}}>Operador disponible</p>
                <p className="text-[10px] text-gray-400">📍 {op.ciudad} • {op.exp} exp.</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{backgroundColor: op.estatus === 'Pendiente' ? '#fef9c3' : '#dcfce7', color: op.estatus === 'Pendiente' ? '#ca8a04' : '#16a34a'}}>
                  {op.estatus}
                </span>
                <a href="/operadores/detalle" className="text-[10px] font-bold" style={{color: '#9A2120'}}>Ver perfil</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="px-4 mt-4 flex flex-col gap-2">
        <button className="w-full py-3 rounded-xl text-white font-bold text-sm" style={{backgroundColor: '#9A2120'}}>
          Cerrar solicitud
        </button>
        <a href="/solicitudes" className="w-full py-3 rounded-xl font-bold text-sm text-center border-2" style={{borderColor: '#9A2120', color: '#9A2120'}}>
          ← Volver a solicitudes
        </a>
      </div>

    </div>
  );
}