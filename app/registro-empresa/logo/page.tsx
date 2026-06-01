export default function RegistroLogo() {
  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#152337'}}>Logo de tu empresa</h1>
        <p className="text-xs text-gray-500 mt-1">Opcional — puedes agregarlo después</p>

        {/* Progreso */}
        <div className="flex gap-2 mt-3">
          {['Datos', 'Logo'].map((paso, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-1.5 rounded-full mb-1" style={{backgroundColor: '#9A2120'}}></div>
              <span className="text-[9px]" style={{color: '#9A2120'}}>{paso}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">

          {/* Vista previa */}
          <div className="flex flex-col items-center py-4">
            <div className="h-24 w-24 rounded-2xl border-4 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 mb-3">
              <span className="text-4xl font-black" style={{color: '#9A2120'}}>CP</span>
            </div>
            <p className="text-xs text-gray-400">Vista previa de tu logo</p>
          </div>

          {/* Botón subir */}
          <button className="w-full border-2 border-dashed rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2" style={{borderColor: '#9A2120', color: '#9A2120'}}>
            <span className="text-xl">🖼️</span>
            Subir logo (opcional)
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            Formatos aceptados: JPG, PNG — Máx. 2MB
          </p>

          {/* Info */}
          <div className="bg-blue-50 rounded-xl px-3 py-2 flex gap-2">
            <span className="text-lg">ℹ️</span>
            <p className="text-[11px] text-blue-700">Si no subes un logo, usaremos las iniciales de tu empresa como identificador visual.</p>
          </div>

          {/* Botones */}
          <div className="flex gap-2 mt-2">
            <a href="/registro-empresa" className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center" style={{borderColor: '#9A2120', color: '#9A2120'}}>
              ← Atrás
            </a>
            <a href="/registro-empresa/listo" className="flex-1 rounded-xl py-3 text-xs font-bold text-white text-center" style={{backgroundColor: '#9A2120'}}>
              Finalizar ✅
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}