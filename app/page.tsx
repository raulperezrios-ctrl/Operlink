export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100" style={{fontFamily: 'sans-serif'}}>

      {/* Hero */}
      <div className="relative bg-white px-6 pt-1 pb-2 text-center">
        <div className="flex justify-center mb-4">
          <img src="/Logo_OperLink.png" alt="OperLink" className="h-12 object-contain" />
        </div>
        <div className="w-12 h-1 mx-auto mb-4 rounded" style={{backgroundColor: '#9A2120'}}></div>
        <h1 className="text-3xl font-black mb-2" style={{color: '#575757'}}>
          Conectamos talento<br />con oportunidades
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          La plataforma que conecta operadores<br />con empresas que los necesitan.
        </p>
        <p className="font-bold text-sm mb-6" style={{color: '#9A2120'}}>
          ¿Cómo quieres comenzar?
        </p>

        {/* Cards */}
        <div className="flex gap-3 max-w-sm mx-auto">
          <a href="/registro-operador" className="flex-1 rounded-2xl overflow-hidden shadow-lg" style={{backgroundColor: '#9A2120'}}>
            <div className="relative h-48 overflow-hidden">
              <img src="/Los_operadores.png" alt="Operador" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 40%, #9A2120 100%)'}}></div>
            </div>
            <div className="p-3 text-white text-center">
              <h2 className="font-bold text-base">Soy operador</h2>
              <p className="text-xs opacity-80 mt-1">Encuentra trabajos, mejora tus oportunidades y crece profesionalmente.</p>
              <div className="mt-3 mx-auto h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">→</div>
            </div>
          </a>
          <a href="/empresas" className="flex-1 rounded-2xl overflow-hidden shadow-lg" style={{backgroundColor: '#575757'}}>
            <div className="relative h-48 overflow-hidden">
              <img src="/Imagen_Empresa.png" alt="Empresa" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 40%, #575757 100%)'}}></div>
            </div>
            <div className="p-3 text-white text-center">
              <h2 className="font-bold text-base">Soy empresa</h2>
              <p className="text-xs opacity-80 mt-1">Encuentra operadores calificados de forma rápida, segura y confiable.</p>
              <div className="mt-3 mx-auto h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">→</div>
            </div>
          </a>
        </div>
      </div>

      {/* Por qué OperLink */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow p-4">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl mb-1">✅</div>
            <p className="font-bold text-xs" style={{color: '#575757'}}>Confiable</p>
            <p className="text-xs text-gray-400">Perfiles verificados y seguros</p>
          </div>
          <div>
            <div className="text-2xl mb-1">⚡</div>
            <p className="font-bold text-xs" style={{color: '#575757'}}>Rápido</p>
            <p className="text-xs text-gray-400">Encuentra lo que necesitas en minutos</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🎯</div>
            <p className="font-bold text-xs" style={{color: '#575757'}}>Eficiente</p>
            <p className="text-xs text-gray-400">Conectamos talento con oportunidades</p>
          </div>
        </div>
      </div>

      {/* Cómo funciona */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow p-4">
        <h2 className="text-sm font-black mb-4 text-center" style={{color: '#575757'}}>¿Cómo funciona?</h2>
        <div className="flex flex-col gap-3">
          {[
            { num: '1', titulo: 'Crea tu perfil', desc: 'Regístrate gratis como operador o empresa en menos de 5 minutos.', color: '#9A2120' },
            { num: '2', titulo: 'Conecta', desc: 'Las empresas encuentran operadores por tipo de maquinaria, ubicación y experiencia.', color: '#9A2120' },
            { num: '3', titulo: 'Trabaja', desc: 'Desbloquea contactos y contrata directamente sin intermediarios.', color: '#9A2120' },
          ].map((paso, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                style={{backgroundColor: paso.color}}>
                {paso.num}
              </div>
              <div>
                <p className="text-sm font-bold" style={{color: '#575757'}}>{paso.titulo}</p>
                <p className="text-xs text-gray-400 mt-0.5">{paso.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparativa */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow p-4">
        <h2 className="text-sm font-black mb-1 text-center" style={{color: '#575757'}}>¿Por qué no Indeed u OCC?</h2>
        <p className="text-xs text-gray-400 text-center mb-4">OperLink está hecho para maquinaria pesada e industria</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-2 text-gray-400 font-semibold">Característica</th>
                <th className="py-2 font-black text-center" style={{color: '#9A2120'}}>OperLink</th>
                <th className="py-2 font-semibold text-center text-gray-400">Indeed/OCC</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Especializado en maquinaria', operlink: '✅', otros: '❌' },
                { feature: 'Perfil por tipo de equipo', operlink: '✅', otros: '❌' },
                { feature: 'Contacto directo', operlink: '✅', otros: '❌' },
                { feature: 'Verificación de operadores', operlink: '✅', otros: '❌' },
                { feature: 'Planes accesibles MX', operlink: '✅', otros: '❌' },
                { feature: 'Calificaciones reales', operlink: '✅', otros: '⚠️' },
                { feature: 'Solicitudes por proyecto', operlink: '✅', otros: '❌' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-2 rounded-l-lg text-gray-600">{row.feature}</td>
                  <td className="py-2 text-center font-bold">{row.operlink}</td>
                  <td className="py-2 text-center">{row.otros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Planes resumen */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow p-4">
        <h2 className="text-sm font-black mb-1 text-center" style={{color: '#575757'}}>Planes para empresas</h2>
        <p className="text-xs text-gray-400 text-center mb-4">Sin contratos. Sin letra chica.</p>
        <div className="flex flex-col gap-3">
          {[
            { nombre: 'Starter', precio: '$499', desc: 'Hasta 5 contactos de operadores', popular: false },
            { nombre: 'Pro', precio: '$999', desc: 'Hasta 20 contactos + solicitudes ilimitadas', popular: true },
            { nombre: 'Enterprise', precio: '$1,999', desc: 'Contactos ilimitados + soporte prioritario', popular: false },
          ].map((plan, i) => (
            <div key={i} className="border-2 rounded-xl p-3 relative"
              style={{borderColor: plan.popular ? '#9A2120' : '#e5e7eb', backgroundColor: plan.popular ? '#fff5f5' : 'white'}}>
              {plan.popular && (
                <span className="absolute -top-2.5 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{backgroundColor: '#9A2120'}}>
                  Más popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black" style={{color: plan.popular ? '#9A2120' : '#575757'}}>{plan.nombre}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{plan.desc}</p>
                </div>
                <p className="text-base font-black" style={{color: '#9A2120'}}>{plan.precio}<span className="text-[10px] font-normal text-gray-400">/mes</span></p>
              </div>
            </div>
          ))}
        </div>
        <a href="/planes"
          className="mt-4 w-full py-2.5 rounded-xl text-white text-sm font-bold text-center block"
          style={{backgroundColor: '#9A2120'}}>
          Ver todos los planes
        </a>
      </div>

      {/* CTA Final */}
      <div className="mx-4 mt-4 mb-6 rounded-2xl p-6 text-center text-white"
        style={{backgroundColor: '#9A2120'}}>
        <h2 className="text-lg font-black mb-2">¿Listo para empezar?</h2>
        <p className="text-xs opacity-80 mb-4">Únete a cientos de operadores y empresas que ya usan OperLink en México.</p>
        <div className="flex gap-2">
          <a href="/registro-operador"
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center bg-white"
            style={{color: '#9A2120'}}>
            Soy Operador
          </a>
          <a href="/registro-empresa"
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center border-2 border-white text-white">
            Soy Empresa
          </a>
        </div>
      </div>

    </div>
  )
}