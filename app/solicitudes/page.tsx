export default function Solicitudes() {
  const solicitudes = [
    {folio: 'OPL-20260523-0001', maquina: 'Tractocamión', ciudad: 'Guadalajara, JAL', tipo: 'Maquina/Camión con Operador', estatus: 'Activa', prioridad: 'Alta', empresa: 'Construcciones del Pacífico'},
    {folio: 'OPL-20260523-0002', maquina: 'Montacargas', ciudad: 'Monterrey, NL', tipo: 'Solo Operador', estatus: 'Activa', prioridad: 'Media', empresa: 'Logística Express'},
    {folio: 'OPL-20260522-0003', maquina: 'Excavadora', ciudad: 'CDMX', tipo: 'Maquina/Camión con Operador', estatus: 'Activa', prioridad: 'Alta', empresa: 'Grupo Constructor MX'},
    {folio: 'OPL-20260521-0004', maquina: 'Camión de Volteo', ciudad: 'Puebla, PUE', tipo: 'Solo Operador', estatus: 'Cerrada', prioridad: 'Baja', empresa: 'Pavimentos del Sur'},
  ];

  return (
    <div className="bg-gray-50 pb-6">

      {/* Header de página */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-base font-black" style={{color: '#575757'}}>Solicitudes</h1>
          <p className="text-xs text-gray-400">{solicitudes.filter(s => s.estatus === 'Activa').length} activas</p>
        </div>
        <a href="/solicitudes/nueva" className="px-3 py-2 rounded-xl text-white text-xs font-bold" style={{backgroundColor: '#9A2120'}}>
          + Nueva
        </a>
      </div>

      {/* Filtros */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Todas', 'Activas', 'Cerradas'].map((filtro, i) => (
            <button key={i} className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold border"
              style={i === 0 ? {backgroundColor: '#9A2120', color: 'white', borderColor: '#9A2120'} : {backgroundColor: 'white', color: '#575757', borderColor: '#e5e7eb'}}>
              {filtro}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 mt-4 flex flex-col gap-3">
        {solicitudes.map((sol, i) => (
          <a href="/solicitudes/detalle" key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 block">
            
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-400 font-mono">{sol.folio}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: sol.estatus === 'Activa' ? '#dcfce7' : '#f3f4f6',
                  color: sol.estatus === 'Activa' ? '#16a34a' : '#6b7280'
                }}>
                {sol.estatus}
              </span>
            </div>

            <h2 className="text-sm font-black" style={{color: '#575757'}}>{sol.maquina}</h2>
            <p className="text-xs text-gray-500 mt-0.5">🏢 {sol.empresa}</p>
            <p className="text-xs text-gray-500">📍 {sol.ciudad}</p>
            <p className="text-xs text-gray-500">🔧 {sol.tipo}</p>

            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: sol.prioridad === 'Alta' ? '#fff1f2' : sol.prioridad === 'Media' ? '#fefce8' : '#f0fdf4',
                  color: sol.prioridad === 'Alta' ? '#9A2120' : sol.prioridad === 'Media' ? '#ca8a04' : '#16a34a'
                }}>
                Prioridad {sol.prioridad}
              </span>
              <span className="text-xs font-semibold" style={{color: '#9A2120'}}>Ver detalle →</span>
            </div>

          </a>
        ))}
      </div>

    </div>
  );
}