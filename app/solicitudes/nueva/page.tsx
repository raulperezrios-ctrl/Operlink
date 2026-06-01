export default function NuevaSolicitud() {
  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#152337'}}>Nueva Solicitud</h1>
        <p className="text-xs text-gray-500 mt-1">Publica lo que necesitas y encuentra al operador ideal</p>
      </div>

      {/* Formulario */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">

          <h2 className="text-sm font-bold" style={{color: '#152337'}}>Detalles de la solicitud</h2>

          {/* Tipo de maquinaria */}
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Maquinaria o equipo requerido *</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option>Selecciona maquinaria</option>
              <option>Excavadora</option>
              <option>Retroexcavadora</option>
              <option>Motoniveladora</option>
              <option>Montacargas</option>
              <option>Tractocamión</option>
              <option>Camión de Volteo</option>
              <option>Pipa</option>
              <option>Grúa</option>
              <option>Bulldozer</option>
              <option>Cargador Frontal</option>
            </select>
          </div>

          {/* Tipo de solicitud */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{color: '#152337'}}>Tipo de solicitud *</label>
            <div className="flex flex-col gap-2">
              {[
                {emoji: '👷', label: 'Solo Operador', desc: 'Necesito un operador para mi propio equipo'},
                {emoji: '🚜', label: 'Máquina con Operador', desc: 'Necesito equipo y operador incluido'},
              ].map((tipo, i) => (
                <button key={i} className="flex items-center gap-3 border-2 rounded-xl p-3 text-left"
                  style={{borderColor: i === 0 ? '#9A2120' : '#e5e7eb', backgroundColor: i === 0 ? '#fff5f5' : 'white'}}>
                  <span className="text-2xl">{tipo.emoji}</span>
                  <div>
                    <p className="text-xs font-bold" style={{color: i === 0 ? '#9A2120' : '#152337'}}>{tipo.label}</p>
                    <p className="text-[10px] text-gray-400">{tipo.desc}</p>
                  </div>
                  {i === 0 && <span className="ml-auto text-xs font-bold" style={{color: '#9A2120'}}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Ciudad */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Ciudad *</label>
              <input type="text" placeholder="Ciudad" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Estado *</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
                <option>Jalisco</option>
                <option>Nuevo León</option>
                <option>CDMX</option>
                <option>Puebla</option>
                <option>Guanajuato</option>
                <option>Sonora</option>
                <option>Chihuahua</option>
                <option>Veracruz</option>
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Fecha inicio *</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Duración</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
                <option>1 día</option>
                <option>1 semana</option>
                <option>1 mes</option>
                <option>3 meses</option>
                <option>6 meses</option>
                <option>Indefinido</option>
              </select>
            </div>
          </div>

          {/* Presupuesto */}
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Presupuesto / Pago (MXN)</label>
            <input type="number" placeholder="$ por hora, día o mes" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color: '#152337'}}>Descripción del trabajo *</label>
            <textarea placeholder="Describe el trabajo, requisitos especiales, condiciones..." rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
          </div>

          {/* Prioridad */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{color: '#152337'}}>Prioridad</label>
            <div className="flex gap-2">
              <button className="flex-1 border-2 rounded-xl py-2 text-xs font-bold" style={{borderColor: '#e5e7eb', color: '#152337'}}>Baja</button>
              <button className="flex-1 border-2 rounded-xl py-2 text-xs font-bold text-white" style={{backgroundColor: '#ca8a04', borderColor: '#ca8a04'}}>Media</button>
              <button className="flex-1 border-2 rounded-xl py-2 text-xs font-bold" style={{borderColor: '#e5e7eb', color: '#152337'}}>Alta</button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 mt-2">
            <a href="/solicitudes" className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center" style={{borderColor: '#9A2120', color: '#9A2120'}}>
              Cancelar
            </a>
            <a href="/solicitudes" className="flex-1 rounded-xl py-3 text-xs font-bold text-white text-center" style={{backgroundColor: '#9A2120'}}>
              Publicar solicitud
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}