
import React, { useMemo, useState, useEffect } from 'react';
import { getOcupacoes, getConflitos } from '../services/dataService';
import { DIAS_SEMANA, MASTER_ROOM_LIST, MESES } from '../constants';
import { Clock, User, MapPin, Search, Layers, Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Ocupacao } from '../types';

const RoomMap: React.FC = () => {
  const [allData, setAllData] = useState<Ocupacao[]>([]);
  const [selectedDia, setSelectedDia] = useState<string>(DIAS_SEMANA[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Novos estados para filtro de Mês e Semana
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedWeek, setSelectedWeek] = useState<number>(1); // 1 a 5

  useEffect(() => {
    setAllData(getOcupacoes());
  }, []);

  // Lógica para verificar se uma ocupação está ativa no mês e semana selecionados
  const isOcupacaoAtivaNoPeriodo = (oc: Ocupacao) => {
    const ocStart = new Date(oc.dataInicio);
    const ocEnd = new Date(oc.dataFim);
    
    // Define o início e fim do mês selecionado
    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

    // Filtro por semana (aproximado: Semana 1 = dias 1-7, etc)
    const weekStart = new Date(selectedYear, selectedMonth, (selectedWeek - 1) * 7 + 1);
    const weekEnd = new Date(selectedYear, selectedMonth, selectedWeek * 7);
    
    // Verifica sobreposição de intervalos: (StartA <= EndB) and (EndA >= StartB)
    const overlapsMonth = ocStart <= monthEnd && ocEnd >= monthStart;
    const overlapsWeek = ocStart <= weekEnd && ocEnd >= weekStart;

    return overlapsMonth && overlapsWeek;
  };

  const conflitos = useMemo(() => {
    // Apenas conflitos que ocorrem no período selecionado
    const dataNoPeriodo = allData.filter(isOcupacaoAtivaNoPeriodo);
    return getConflitos(dataNoPeriodo);
  }, [allData, selectedMonth, selectedWeek, selectedYear]);

  const filteredRooms = useMemo(() => {
    return MASTER_ROOM_LIST.filter(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const roomGroups = useMemo(() => {
    return {
      '1º Pavimento': filteredRooms.filter(r => r.startsWith('Sala 1')),
      '2º Pavimento': filteredRooms.filter(r => r.startsWith('Sala 2')),
      '3º Pavimento': filteredRooms.filter(r => r.startsWith('Sala 3'))
    };
  }, [filteredRooms]);

  const hasConflictInRoom = (sala: string, dia: string) => {
    return conflitos.some(c => c.sala === sala && c.diaSemana === dia);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--/--';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      {/* Cabeçalho de Filtros Avançados */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-senac space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-[#1d1d1b] tracking-tighter">Mapa de <span className="text-[#004a8e]">Ocupação</span></h2>
            <p className="text-gray-500 font-medium text-sm">Controle de espaços por período e turno.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Localizar sala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-senac-blue/20 rounded-2xl text-xs font-bold outline-none w-full sm:w-64 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Seletores de Tempo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
              <Calendar className="w-3 h-3 mr-2 text-senac-blue" /> Selecionar Mês
            </label>
            <div className="flex items-center gap-2">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full bg-gray-50 p-3.5 rounded-2xl text-xs font-black outline-none border border-transparent focus:border-senac-blue/20 appearance-none"
              >
                {MESES.map((mes, idx) => <option key={mes} value={idx}>{mes.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
              <Filter className="w-3 h-3 mr-2 text-senac-orange" /> Semana do Mês
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all border ${
                    selectedWeek === w 
                    ? 'bg-senac-orange border-senac-orange text-white shadow-lg shadow-orange-500/20' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-senac-orange/30'
                  }`}
                >
                  S{w}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
              <ChevronRight className="w-3 h-3 mr-2 text-senac-blue" /> Dia da Semana
            </label>
            <div className="bg-gray-50 p-1.5 rounded-2xl flex border border-gray-100 overflow-x-auto">
              {DIAS_SEMANA.map(dia => (
                <button
                  key={dia}
                  onClick={() => setSelectedDia(dia)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedDia === dia 
                      ? 'bg-senac-blue text-white shadow-lg shadow-blue-900/20' 
                      : 'text-gray-400 hover:text-senac-blue'
                  }`}
                >
                  {dia.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Salas */}
      {(Object.entries(roomGroups) as [string, string[]][]).map(([groupName, rooms]) => rooms.length > 0 && (
        <div key={groupName} className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <Layers className="w-5 h-5 text-senac-orange" />
            <h3 className="text-[11px] font-black text-[#004a8e] uppercase tracking-[0.4em]">{groupName}</h3>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {rooms.map(sala => {
              const ocupacoesSala = allData.filter(o => 
                o.sala === sala && 
                o.diaSemana === selectedDia && 
                isOcupacaoAtivaNoPeriodo(o)
              );
              const conflict = hasConflictInRoom(sala, selectedDia);
              const isOccupied = ocupacoesSala.length > 0;

              return (
                <div 
                  key={sala} 
                  className={`relative group rounded-[2.5rem] border transition-all duration-300 ${
                    conflict 
                      ? 'bg-red-50 border-red-200 ring-4 ring-red-50' 
                      : isOccupied 
                        ? 'bg-white border-gray-100 hover:shadow-2xl hover:-translate-y-2' 
                        : 'bg-gray-50/30 border-dashed border-gray-200 opacity-60'
                  }`}
                >
                  <div className={`p-6 flex justify-between items-center rounded-t-[2.5rem] ${
                    conflict ? 'bg-red-500' : isOccupied ? 'bg-[#004a8e]' : 'bg-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isOccupied || conflict ? 'text-white' : 'text-gray-400'}`} />
                      <span className={`text-sm font-black italic ${isOccupied || conflict ? 'text-white' : 'text-gray-500'}`}>{sala}</span>
                    </div>
                    {conflict && (
                      <div className="bg-white text-red-600 px-2.5 py-1 rounded-full text-[7px] font-black animate-pulse">
                        CONFLITO
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-5">
                    {!isOccupied ? (
                      <div className="py-6 text-center">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Sala Livre</p>
                      </div>
                    ) : (
                      ocupacoesSala.sort((a,b) => a.horarioInicio.localeCompare(b.horarioInicio)).map((oc, idx) => (
                        <div key={idx} className="space-y-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-senac-orange uppercase tracking-widest">{oc.turno}</span>
                            <div className="flex items-center text-gray-400 text-[9px] font-bold">
                              <Clock className="w-2.5 h-2.5 mr-1" />
                              {oc.horarioInicio}
                            </div>
                          </div>
                          <h4 className="text-[10px] font-black text-gray-800 leading-snug uppercase line-clamp-2">{oc.curso}</h4>
                          
                          <div className="flex flex-col gap-2 pt-1">
                            <div className="flex items-center text-[9px] text-gray-500 font-bold">
                              <User className="w-3 h-3 mr-2 text-senac-blue shrink-0" />
                              <span className="truncate">{oc.instrutor}</span>
                            </div>
                            <div className="flex items-center text-[9px] text-gray-400 font-bold bg-gray-50 p-1.5 rounded-lg">
                              <Calendar className="w-3 h-3 mr-2 text-senac-orange shrink-0" />
                              <span>{formatDate(oc.dataInicio)} - {formatDate(oc.dataFim)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomMap;
