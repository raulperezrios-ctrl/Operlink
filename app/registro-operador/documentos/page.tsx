'use client'

export default function RegistroDocumentos() {
  return (
    <div className="bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black" style={{color: '#152337'}}>Documentos y certificaciones</h1>
        <p className="text-xs text-gray-500 mt-1">Sube tus documentos para verificar tu perfil</p>

        {/* Progreso */}
        <div className="flex gap-2 mt-3">
          {['Datos', 'Maquinaria', 'Documentos', 'Foto'].map((paso, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-1.5 rounded-full mb-1" style={{backgroundColor: i <= 2 ? '#9A2120' : '#e5e7eb'}}></div>
              <span className="text-[9px]" style={{color: i <= 2 ? '#9A2120' : '#9ca3af'}}>{paso}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">

          {/* Info */}
          <div className="bg-blue-50 rounded-xl px-3 py-2 flex gap-2">
            <span className="text-lg">ℹ️</span>
            <p className="text-[11px] text-blue-700">Los documentos verificados aumentan tu visibilidad y confianza ante las empresas.</p>
          </div>

          {/* Documentos */}
          {[
            {label: 'Identificación oficial *', desc: 'INE, pasaporte o cédula profesional', requerido: true},
            {label: 'Licencia de manejo', desc: 'Tipo A, B, C o E según corresponda', requerido: false},
            {label: 'Certificación de operador', desc: 'Si cuentas con alguna certificación', requerido: false},
            {label: 'Comprobante de domicilio', desc: 'No mayor a 3 meses', requerido: false},
          ].map((doc, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-bold" style={{color: '#152337'}}>{doc.label}</p>
                  <p className="text-[10px] text-gray-400">{doc.desc}</p>
                </div>
                {doc.requerido && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{backgroundColor: '#9A2120'}}>Requerido</span>
                )}
              </div>
              <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-xs text-gray-400 flex items-center justify-center gap-2">
                <span className="text-lg">📎</span>
                <span>Toca para subir archivo</span>
              </button>
            </div>
          ))}

          {/* Nota */}
          <p className="text-[10px] text-gray-400 text-center">
            Formatos aceptados: JPG, PNG, PDF — Máx. 5MB por archivo
          </p>

          {/* Botones */}
          <div className="flex gap-2 mt-2">
            <a href="/registro-operador/maquinaria" className="flex-1 border-2 rounded-xl py-3 text-xs font-bold text-center" style={{borderColor: '#9A2120', color: '#9A2120'}}>
              ← Atrás
            </a>
            <a href="/registro-operador/foto" className="flex-1 rounded-xl py-3 text-xs font-bold text-white text-center" style={{backgroundColor: '#9A2120'}}>
              Continuar →
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}