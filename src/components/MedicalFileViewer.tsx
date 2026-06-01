import React from 'react';
import { Player } from '../types';
import { FileText, ShieldAlert, CheckCircle, Award, Printer, Download, X } from 'lucide-react';

interface MedicalFileViewerProps {
  player: Player;
  onClose: () => void;
}

export default function MedicalFileViewer({ player, onClose }: MedicalFileViewerProps) {
  const isApproved = player.fichaMedicaUrl !== null;

  return (
    <div id="medical-viewer-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2ECC71]/30 bg-[#05472A] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="font-sans font-semibold text-base uppercase tracking-wider">Ficha Médica UAR</h3>
              <p className="font-mono text-[9px] uppercase tracking-wider text-emerald-250">ID del Atleta: #{player.id.toUpperCase()}</p>
            </div>
          </div>
          <button 
            id={`close-medical-${player.id}`}
            onClick={onClose}
            className="rounded-lg p-1.5 text-emerald-300 hover:bg-emerald-950/60 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content - Document Simulator */}
        <div className="max-h-[75vh] overflow-y-auto bg-slate-50 p-6">
          {isApproved ? (
            <div className="relative border-2 border-slate-350 bg-white p-8 shadow-inner font-serif text-slate-800">
              
              {/* Document Stamp Seal */}
              <div className="absolute right-6 top-6 flex flex-col items-center justify-center rounded-full border-4 border-emerald-600 p-2 text-center text-emerald-600 opacity-80" style={{ transform: 'rotate(12deg)' }}>
                <CheckCircle className="h-8 w-8 text-emerald-650" />
                <span className="font-sans font-extrabold text-[10px] tracking-widest uppercase">UAR APTO</span>
                <span className="font-mono text-[8px]">{player.fichaMedicaFecha}</span>
              </div>

              {/* UAR Header Simulation */}
              <div className="mb-8 text-center border-b-2 border-slate-900 pb-4">
                <div className="flex justify-center mb-2">
                  <div className="flex items-center gap-1 rounded bg-slate-950 px-3 py-1.5 text-white font-sans font-bold text-xs tracking-wider border border-slate-900">
                    <Award className="h-4 w-4 text-emerald-400" />
                    UAR FEDERADO
                  </div>
                </div>
                <h4 className="font-sans font-bold text-xl tracking-tight text-slate-900 uppercase">Unión Argentina de Rugby</h4>
                <p className="font-sans text-xs tracking-wider text-slate-500 font-medium">FICHA MÉDICA ÚNICA DE CONCENTRACIÓN Y APTO COMPETITIVO</p>
                <p className="font-serif italic text-[11px] text-slate-400 mt-1">Válido para la temporada nacional 2026/2027</p>
              </div>

              {/* Patient/Player Details */}
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                  <div>
                    <span className="block font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Apellido y Nombres</span>
                    <strong className="text-base font-sans text-slate-800 font-bold">{player.apellido}, {player.nombre}</strong>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Documento Nacional de Identidad</span>
                    <strong className="font-mono text-slate-800">{player.documento}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-3">
                  <div>
                    <span className="block font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fecha Nacimiento</span>
                    <span className="font-sans text-slate-750">{player.fecha_nacimiento}</span>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Categoría</span>
                    <span className="font-bold font-sans text-[#2ECC71]">{player.categoria}</span>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fecha de Emisión</span>
                    <span className="font-mono text-slate-750">{player.fichaMedicaFecha}</span>
                  </div>
                </div>

                {/* Medical evaluations template text representation */}
                <div className="space-y-3 pt-2">
                  <h5 className="font-sans font-bold text-xs uppercase text-slate-700 tracking-wider">Exámenes Requeridos & Aptitud Cardiovascular</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div className="flex items-center gap-2 rounded bg-slate-50 p-1.5 border border-slate-100">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Electrocardiograma: <strong>NORMAL</strong></span>
                    </div>
                    <div className="flex items-center gap-2 rounded bg-slate-50 p-1.5 border border-slate-100">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Ergometría Graduada: <strong>APTO</strong></span>
                    </div>
                    <div className="flex items-center gap-2 rounded bg-slate-50 p-1.5 border border-slate-100">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Hemograma y Química: <strong>COMPLETO</strong></span>
                    </div>
                    <div className="flex items-center gap-2 rounded bg-slate-50 p-1.5 border border-slate-100">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Evaluación Odontológica: <strong>SATISFACTORIA</strong></span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 text-xs font-sans">
                  <p className="font-bold text-green-800 mb-1">DECLARACIÓN DE APTITUD DEPORTIVA</p>
                  <p className="text-slate-600 leading-relaxed font-light">
                    Certifico que he examinado exhaustivamente al atleta mencionado arriba y no se hallan contraindicaciones clínicas diagnósticas para la práctica de Rugby recreativo y competitivo a nivel nacional de alto rendimiento físico.
                  </p>
                </div>

                {/* Footer seal mockup */}
                <div className="flex items-end justify-between pt-6 mt-4 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400">
                    <p>Archivo origen: {player.fichaMedicaNombre}</p>
                    <p>Cargado por manager asignado</p>
                    <p>Firma digital del club oficializada</p>
                  </div>
                  <div className="text-center font-sans border-t border-slate-400 px-6 pt-1 w-44">
                    <div className="font-serif italic text-[#2ECC71] leading-3 text-xs mb-1">Dr. Ramiro S. Soria</div>
                    <div className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Médico Cardiólogo - MN: 115243</div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-amber-50 p-3 text-amber-600">
                <ShieldAlert className="h-10 w-10 text-amber-500" />
              </div>
              <h4 className="font-sans font-bold text-slate-800 text-lg">Ficha Médica Faltante u Omisa</h4>
              <p className="mt-2 max-w-md font-sans text-sm text-slate-500">
                El jugador <strong>{player.nombre} {player.apellido}</strong> no cuenta todavía con su Ficha Médica de la UAR debidamente firmada y cargada al sistema.
              </p>
              <div className="mt-4 rounded bg-amber-100 text-amber-800 text-xs px-3 py-1.5 font-sans font-medium">
                Sujeto a inhabilitación provisional para entrenamientos de choque y competencia oficial.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-slate-100 px-6 py-4">
          <p className="font-sans text-[11px] text-slate-500">
            {isApproved ? 'Ficha validada por Departamento Médico' : 'Requiere acción del Manager'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 font-sans text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cerrar Vista
            </button>
            {isApproved && (
              <>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Imprimir
                </button>
                <button
                  onClick={() => alert(`Descargando ${player.fichaMedicaNombre}... (Simulación de descarga)`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-1.5 font-sans text-xs font-bold text-white hover:bg-green-800 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Descargar
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
