export default function Empresas() {
  return (
    <div className="bg-white pb-6" style={{fontFamily: 'sans-serif'}}>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{minHeight: '180px'}}>
        <img src="/Operador_MAquinaria.png" alt="Operador" className="absolute right-0 top-0 h-full object-cover" style={{width: '55%'}} />
        <div className="absolute inset-0" style={{background: 'linear-gradient(to right, white 45%, transparent 75%)'}}></div>
        <div className="relative z-10 px-5 py-8 max-w-[55%]">
          <h1 className="text-xl font-black leading-tight" style={{color: '#575757'}}>
            Encuentra operadores certificados y maquinaria especializada
          </h1>
          <p className="text-xs text-gray-500 mt-2">Conectamos empresas con operadores para construcción, logística e industria.</p>
        </div>
      </section>

      {/* Buscador */}
      <section className="px-4 -mt-2">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <h2 className="font-bold text-sm mb-3" style={{color: '#575757'}}>¿Qué operador o maquinaria necesitas?</h2>
          
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Maquinaria requerida</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs">
                <option>Selecciona maquinaria</option>
                <option>Excavadora</option>
                <option>Retroexcavadora</option>
                <option>Motoniveladora</option>
                <option>Montacargas</option>
                <option>Tractocamión</option>
                <option>Camión / Volteo</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Ciudad</label>
                <input type="text" placeholder="Ingresa ciudad" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Fecha inicio</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{color: '#575757'}}>Tipo de solicitud</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs">
                <option>Selecciona tipo de solicitud</option>
                <option>Solo Operador</option>
                <option>Máquina/Camión con Operador</option>
              </select>
            </div>

            <a href="/operadores" className="w-full py-2 rounded-xl text-white text-sm font-bold mt-1 text-center block" style={{backgroundColor: '#9A2120'}}>
              🔍 Buscar operadores
            </a>
          </div>
        </div>
      </section>

      {/* Operadores destacados */}
      <section className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-sm" style={{color: '#575757'}}>Operadores destacados</h2>
          <a href="/operadores" className="text-xs font-semibold" style={{color: '#9A2120'}}>Ver todos →</a>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            {img: '/Operador_MAquinaria.png', maquina: 'Retroexcavadora', ciudad: 'Guadalajara, JAL', exp: '8 años'},
            {img: '/Operador_Montacargas1.png', maquina: 'Montacargas', ciudad: 'Monterrey, NL', exp: '3.5 años'},
            {img: '/Operador_Tractocamion.png', maquina: 'Tractocamión', ciudad: 'San Luis Potosí', exp: '6 años'},
          ].map((op, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative h-24">
                <img src={op.img} alt={op.maquina} className="w-full h-full object-cover object-top" />
                <div className="absolute bottom-1 right-1 bg-black/70 rounded-full px-1.5 py-0.5 text-white text-[9px] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block"></span>
                  Disponible
                </div>
              </div>
              <div className="p-2">
                <span className="text-[10px] font-bold" style={{color: '#9A2120'}}>{op.maquina}</span>
                <p className="text-[11px] font-semibold mt-0.5">Operador disponible</p>
                <p className="text-[10px] text-gray-500">📍 {op.ciudad}</p>
                <p className="text-[10px] text-gray-500">📅 {op.exp} exp.</p>
                <a href="/operadores/detalle" className="mt-1.5 w-full border rounded-lg py-1 text-[10px] font-semibold text-center block" style={{borderColor: '#9A2120', color: '#9A2120'}}>
                  Ver perfil
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}