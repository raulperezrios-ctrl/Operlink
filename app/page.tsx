export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100" style={{fontFamily: 'sans-serif'}}>
      
      {/* Fondo superior */}
      <div className="relative bg-white px-6 pt-8 pb-6 text-center">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/Logo_OperLink.png" alt="OperLink" className="h-12 object-contain" />
        </div>

        {/* Línea roja */}
        <div className="w-12 h-1 mx-auto mb-4 rounded" style={{backgroundColor: '#9A2120'}}></div>

        {/* Título */}
        <h1 className="text-3xl font-black mb-2" style={{color: '#152337'}}>
          Conectamos talento<br />con oportunidades
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          La plataforma que conecta operadores<br />con empresas que los necesitan.
        </p>
        <p className="font-bold text-sm mb-6" style={{color: '#9A2120'}}>
          ¿Cómo quieres comenzar?
        </p>

        {/* Cards lado a lado */}
        <div className="flex gap-3 max-w-sm mx-auto">
          
          {/* Soy Operador */}
          <a href="/registro-operador" className="flex-1 rounded-2xl overflow-hidden shadow-lg" style={{backgroundColor: '#9A2120'}}>
            <div className="relative h-48 overflow-hidden">
              <img src="/Operador_MAquinaria.png" alt="Operador" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 40%, #9A2120 100%)'}}></div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#9A2120'}}>
                <span className="text-white text-xl">👷</span>
              </div>
            </div>
            <div className="p-3 text-white text-center">
              <h2 className="font-bold text-base">Soy operador</h2>
              <p className="text-xs opacity-80 mt-1">Encuentra trabajos, mejora tus oportunidades y crece profesionalmente.</p>
              <div className="mt-3 mx-auto h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">→</div>
            </div>
          </a>

          {/* Soy Empresa */}
          <a href="/empresas" className="flex-1 rounded-2xl overflow-hidden shadow-lg" style={{backgroundColor: '#152337'}}>
            <div className="relative h-48 overflow-hidden">
              <img src="/Operador_Tractocamion.png" alt="Empresa" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 40%, #152337 100%)'}}></div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#152337'}}>
                <span className="text-white text-xl">🏢</span>
              </div>
            </div>
            <div className="p-3 text-white text-center">
              <h2 className="font-bold text-base">Soy empresa</h2>
              <p className="text-xs opacity-80 mt-1">Encuentra operadores calificados de forma rápida, segura y confiable.</p>
              <div className="mt-3 mx-auto h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">→</div>
            </div>
          </a>

        </div>
      </div>

      {/* Footer con íconos */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow p-4">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl mb-1">✅</div>
            <p className="font-bold text-xs" style={{color: '#152337'}}>Confiable</p>
            <p className="text-xs text-gray-400">Perfiles verificados y seguros</p>
          </div>
          <div>
            <div className="text-2xl mb-1">⚡</div>
            <p className="font-bold text-xs" style={{color: '#152337'}}>Rápido</p>
            <p className="text-xs text-gray-400">Encuentra lo que necesitas en minutos</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🎯</div>
            <p className="font-bold text-xs" style={{color: '#152337'}}>Eficiente</p>
            <p className="text-xs text-gray-400">Conectamos talento con oportunidades</p>
          </div>
        </div>
      </div>

    </div>
  );
}