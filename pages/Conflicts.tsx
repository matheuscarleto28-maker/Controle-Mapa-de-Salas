
import React, { useMemo, useState, useEffect } from 'react';
import { getOcupacoes, getConflitos } from '../services/dataService';
import { AlertTriangle, Clock, MapPin, User, GraduationCap, Calendar } from 'lucide-react';
import { Ocupacao } from '../types';

const Conflicts: React.FC = () => {
  const [allData, setAllData] = useState<Ocupacao[]>([]);

  useEffect(() => {
    setAllData(getOcupacoes());
  }, []);

  const conflitos = useMemo(() => getConflitos(allData), [allData]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--/--/--';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-red-50 border border-red-100 p-8 rounded-3xl">
        <h2 className="text-2xl font-black text-red-700 flex items-center uppercase tracking-tight">
          <AlertTriangle className="w-8 h-8 mr-3" />
          Central de Erros e Conflitos
        </h2>
        <p className="text-red-600 font-medium mt-2">
          Detectamos {conflitos.length} irregularidades de horários que precisam de correção imediata na planilha.
        </p>
      </div>

      {conflitos.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 rounded-3xl text-center shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Tudo limpo!</h3>
          <p className="text-gray-500 mt-2">Não há conflitos de salas ou horários registrados no momento.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {conflitos.map((c, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm font-black text-gray-700 uppercase tracking-widest">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    {c.sala}
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="text-sm font-bold text-gray-500">
                    {c.diaSemana}
                  </div>
                </div>
                <span className="text-[10px] font-black bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  SOBREPOSIÇÃO DETECTADA
                </span>
              </div>
              
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {c.ocupacoesEnvolvidas.map((oc, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-100">
                    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <GraduationCap className="text-senac-blue w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 uppercase text-xs truncate">{oc.curso}</h4>
                      <p className="text-[10px] text-gray-500 font-black mt-1">{oc.turma}</p>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                        <div className="flex items-center text-[10px] font-black text-red-600 bg-red-100 px-2 py-1 rounded uppercase tracking-tighter">
                          <Clock className="w-3 h-3 mr-1" />
                          {oc.horarioInicio} - {oc.horarioFim}
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-gray-600">
                          <User className="w-3 h-3 mr-1 text-senac-blue" />
                          {oc.instrutor}
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-gray-500">
                          <Calendar className="w-3 h-3 mr-1 text-senac-orange" />
                          {formatDate(oc.dataInicio)} até {formatDate(oc.dataFim)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Conflicts;
