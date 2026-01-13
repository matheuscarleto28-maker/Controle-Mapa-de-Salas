
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  DoorOpen, 
  AlertTriangle, 
  Plus,
  ArrowRight,
  Search,
  Clock,
  X,
  Calendar,
  LayoutGrid,
  TrendingUp,
  Map as MapIcon,
  Download,
  Upload,
  Database,
  ChevronRight
} from 'lucide-react';
import { getOcupacoes, getConflitos, saveOcupacao, overwriteOcupacoes } from '../services/dataService';
import { MASTER_ROOM_LIST, DIAS_SEMANA, TURNOS } from '../constants';
import { Ocupacao, Turno, DiaSemana } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [allData, setAllData] = useState<Ocupacao[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<Ocupacao>>({
    sala: MASTER_ROOM_LIST[0],
    diaSemana: DIAS_SEMANA[0],
    turno: TURNOS[0] as Turno,
    unidade: 'Senac Uberaba'
  });

  useEffect(() => {
    setAllData(getOcupacoes());
  }, []);

  const conflitos = useMemo(() => getConflitos(allData), [allData]);
  const totalSalas = MASTER_ROOM_LIST.length;
  const salasOcupadas = useMemo(() => new Set(allData.map(i => i.sala)).size, [allData]);
  const salasLivres = totalSalas - salasOcupadas;

  const filteredData = useMemo(() => {
    if (!searchTerm) return allData.slice(0, 6);
    return allData.filter(oc => 
      oc.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oc.instrutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oc.sala.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allData, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Ocupacao = {
      ...formData,
      id: Date.now().toString(),
      unidade: 'Senac Uberaba'
    } as Ocupacao;

    const updated = saveOcupacao(newEntry);
    setAllData(updated);
    setIsModalOpen(false);
    alert('Lançamento realizado com sucesso!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup_salas_senac.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const updated = overwriteOcupacoes(json);
        setAllData(updated);
        alert('Base de dados atualizada!');
      } catch (error) {
        alert('Erro ao processar o arquivo. Verifique se o formato está correto.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      {/* Header Portal Style */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-senac-lightBlue rounded-full text-[10px] font-black text-senac-blue uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Sistema de Gestão de Espaços
          </div>
          <h1 className="text-5xl font-black text-senac-dark tracking-tighter italic">
            Portal <span className="text-senac-blue">Uberaba</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-md">Controle centralizado de salas, laboratórios e auditórios da unidade.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-senac-orange text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Lançamento
          </button>
          <button 
            onClick={() => navigate('/mapa')}
            className="bg-senac-blue text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center shadow-xl shadow-blue-900/20 hover:scale-105 transition-all"
          >
            <MapIcon className="w-4 h-4 mr-2" /> Abrir Mapa
          </button>
        </div>
      </div>

      {/* Hero Search Area */}
      <div className="relative group">
        <div className="absolute inset-0 bg-senac-blue/5 rounded-[3rem] -rotate-1 group-hover:rotate-0 transition-transform"></div>
        <div className="relative bg-white border-2 border-gray-100 p-8 md:p-12 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-xl font-black text-senac-dark uppercase tracking-tight">O que você deseja localizar?</h3>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
              <input 
                type="text" 
                placeholder="Busque por curso, professor ou número da sala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-none p-6 pl-16 rounded-[2rem] outline-none focus:ring-4 ring-senac-blue/5 font-bold text-gray-700 transition-all shadow-inner"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
             <div className="bg-senac-lightBlue p-6 rounded-[2rem] text-center">
                <div className="text-3xl font-black text-senac-blue">{salasLivres}</div>
                <div className="text-[9px] font-black text-senac-blue/60 uppercase tracking-widest mt-1">Salas Livres</div>
             </div>
             <div className="bg-orange-50 p-6 rounded-[2rem] text-center">
                <div className="text-3xl font-black text-senac-orange">{conflitos.length}</div>
                <div className="text-[9px] font-black text-senac-orange/60 uppercase tracking-widest mt-1">Conflitos</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Recent Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-senac-dark uppercase tracking-widest flex items-center">
              <Clock className="w-5 h-5 mr-3 text-senac-blue" />
              Atividade Recente
            </h2>
            <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-senac-blue">Ver histórico</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {filteredData.map((oc) => (
              <div key={oc.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-senac-blue/20 hover:shadow-2xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="px-4 py-1.5 bg-senac-dark text-white rounded-xl text-[10px] font-black uppercase italic">
                    {oc.sala}
                  </div>
                  <div className="text-[10px] font-bold text-gray-300 group-hover:text-senac-orange transition-colors">
                    {oc.turno}
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-6 h-10 line-clamp-2 uppercase leading-snug">{oc.curso}</h4>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-senac-blue" />
                    <span className="text-[10px] font-black text-gray-500 uppercase">{oc.instrutor.split(' ')[0]}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-senac-blue group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
            {allData.length === 0 && (
              <div className="col-span-2 py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">Nenhuma ocupação registrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Tools */}
        <div className="space-y-8">
          <h2 className="text-lg font-black text-senac-dark uppercase tracking-widest px-2">Administração</h2>
          
          <div className="bg-senac-dark p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl text-senac-orange">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight leading-none">Base de Dados</h4>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Sincronização Manual</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Para compartilhar seus lançamentos com a equipe, exporte o arquivo e peça para o colega importar no computador dele.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={handleExport}
                  className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Exportar Dados</span>
                  <Download className="w-4 h-4 text-senac-orange" />
                </button>

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Importar Dados</span>
                  <Upload className="w-4 h-4 text-senac-blue" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">v1.0 Uberaba</span>
                <span className="text-[8px] font-black text-senac-orange uppercase tracking-widest italic">Senac Minas</span>
              </div>
            </div>
          </div>

          <div className="bg-senac-lightBlue p-8 rounded-[2.5rem] border border-senac-blue/5">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-senac-blue" />
              <h4 className="text-[10px] font-black text-senac-blue uppercase tracking-widest">Dica de Gestão</h4>
            </div>
            <p className="text-[11px] text-senac-blue/70 font-bold leading-relaxed">
              Mantenha o backup atualizado semanalmente para evitar perda de dados no navegador.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Lançamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-senac-dark/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-2xl relative border border-gray-100">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-10 right-10 p-3 bg-gray-50 text-gray-400 hover:text-senac-dark rounded-full transition-all hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-12 md:p-20">
              <div className="mb-12">
                <h2 className="text-4xl font-black text-senac-dark italic tracking-tighter">Novo <span className="text-senac-blue">Registro</span></h2>
                <p className="text-gray-400 font-medium mt-2">Os dados serão salvos no banco local da unidade.</p>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Espaço Físico</label>
                    <select required value={formData.sala} onChange={e => setFormData({...formData, sala: e.target.value})} className="w-full bg-gray-50 p-5 rounded-[1.5rem] border-none font-bold text-sm outline-none focus:ring-4 ring-senac-blue/5 appearance-none">
                      {MASTER_ROOM_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Curso / Evento</label>
                    <input required type="text" placeholder="Ex: Técnico em Estética" value={formData.curso || ''} onChange={e => setFormData({...formData, curso: e.target.value})} className="w-full bg-gray-50 p-5 rounded-[1.5rem] border-none font-bold text-sm outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Turma</label>
                      <input required type="text" placeholder="TADM01" value={formData.turma || ''} onChange={e => setFormData({...formData, turma: e.target.value})} className="w-full bg-gray-50 p-5 rounded-[1.5rem] border-none font-bold text-sm outline-none" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Turno</label>
                      <select required value={formData.turno} onChange={e => setFormData({...formData, turno: e.target.value as Turno})} className="w-full bg-gray-50 p-5 rounded-[1.5rem] border-none font-bold text-sm outline-none">
                        {TURNOS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Docente</label>
                    <input required type="text" placeholder="Nome do Professor" value={formData.instrutor || ''} onChange={e => setFormData({...formData, instrutor: e.target.value})} className="w-full bg-gray-50 p-5 rounded-[1.5rem] border-none font-bold text-sm outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Início</label>
                      <input required type="time" value={formData.horarioInicio || ''} onChange={e => setFormData({...formData, horarioInicio: e.target.value})} className="w-full bg-gray-50 p-5 rounded-[1.5rem] border-none font-bold text-sm" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Fim</label>
                      <input required type="time" value={formData.horarioFim || ''} onChange={e => setFormData({...formData, horarioFim: e.target.value})} className="w-full bg-gray-50 p-5 rounded-[1.5rem] border-none font-bold text-sm" />
                    </div>
                  </div>
                  <div className="space-y-6 pt-4">
                    <button type="submit" className="w-full bg-senac-orange text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                      Finalizar Lançamento <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
