export default function RegistroListo() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">

      {/* Ícono de éxito */}
      <div className="h-24 w-24 rounded-full flex items-center justify-center mb-6 shadow-lg" style={{backgroundColor: '#9A2120'}}>
        <span className="text-5xl">✅</span>
      </div>

      {/* Título */}
      <h1 className="text-2xl font-black mb-2" style={{color: '#152337'}}>
        ¡Perfil creado con éxito!
      </h1>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Tu perfil está en revisión. En menos de 24 horas estará visible para las empresas en OperLink.
      </p>

      {/* Pasos siguientes */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-4 mb-6 text-left">
        <p className="text-xs font-bold mb-3" style={{color: '#152337'}}>¿Qué sigue?</p>
        {[
          {emoji: '🔍', texto: 'Revisamos tu perfil y documentos'},
          {emoji: '✅', texto: 'Te notificamos cuando estés verificado'},
          {emoji: '📱', texto: 'Las empresas podrán encontrarte y contactarte'},
          {emoji: '💰', texto: 'Recibes oportunidades de trabajo'},
        ].map((paso, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <span className="text-xl">{paso.emoji}</span>
            <p className="text-xs text-gray-600">{paso.texto}</p>
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <a href="/operadores" className="w-full py-3 rounded-xl text-white font-bold text-sm text-center" style={{backgroundColor: '#9A2120'}}>
          Ver catálogo de operadores
        </a>
        <a href="/" className="w-full py-3 rounded-xl font-bold text-sm text-center border-2" style={{borderColor: '#9A2120', color: '#9A2120'}}>
          Ir al inicio
        </a>
      </div>

    </div>
  );
}