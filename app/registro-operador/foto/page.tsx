'use client'

export default function RegistroFoto() {
  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#152337'}}>Tu foto de perfil</h1>
        <p className="text-xs text-gray-500 mt-1">Una buena foto aumenta tus oportunidades de ser contratado</p>

        {/* Progreso */}
        <div className="flex gap-2 mt-3">
          {['Datos', 'Maquinaria', 'Documentos', 'Foto'].map((paso, i) => (
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
            <div className="h-32 w-32 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 mb-3">
              <span className="text-5xl">👷</span>
            </div>
            <p className="text-xs text-gray-400">Tu foto aparecerá aquí</p>
          </div>

          {/* Botones de subida */}
          <button className="w-full border-2 border-dashed rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2" style={{borderColor: '#9A2120', color: '#9A2120'}}>
            <span className="text-xl">📷</span>
            Tomar foto con cámara
          </button>

          <button className="w-full border-2 border-dashed rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2" style={{borderColor: '#e5e7eb', color: '#152337'}}>
            <span className="text-xl">🖼️</span>
            Subir desde galería
          </button>

          {/* Consejos */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-bold mb-2" style={{color: '#152337'}}>💡 Consejos para una buena foto:</p>
            <ul className="flex flex-col gap-1">
              {[
                'Usa buena iluminación natural',
                'Fondo limpio y ordenado',
                'Viste ropa de trabajo o uniforme',
                'Mira directo a la cámara',
                'Si puedes, aparece con tu equipo',
              ].map((tip, i) => (
                <li key={i} className="text-[11px] text-gray-500 flex items-start gap-1">
                  <span style={{color: '#9A2120'}}>✓</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-2 mt-2">
            <a href="/registro-operador/documentos" className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center" style={{borderColor: '#9A2120', color: '#9A2120'}}>
              ← Atrás
            </a>
            <a href="/registro-operador/listo" className="flex-1 rounded-xl py-3 text-xs font-bold text-white text-center" style={{backgroundColor: '#9A2120'}}>
              Finalizar ✅
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}