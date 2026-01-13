
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Maximize, Minimize, Lock, Tv } from 'lucide-react';
import { getConflitos, getOcupacoes } from '../services/dataService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsPublic(params.get('view') === 'public');
    const data = getOcupacoes();
    setConflictCount(getConflitos(data).length);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const menuItems = [
    { path: '/', label: 'HOME', icon: LayoutDashboard },
    { path: '/mapa', label: 'MAPA', icon: Map },
    { path: '/conflitos', label: 'CONFLITOS', icon: Tv, isConflict: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      <header className={`sticky top-0 z-[100] transition-all duration-500 ${
        scrolled ? 'bg-white/70 backdrop-blur-2xl shadow-xl py-3' : 'bg-white py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to={isPublic ? "/?view=public" : "/"} className="flex flex-col group transition-transform hover:scale-105">
              <span className="text-3xl font-black text-senac-blue italic leading-none">Senac</span>
              <div className="flex items-center mt-1">
                <span className="h-[2px] w-4 bg-senac-orange mr-1"></span>
                <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Uberaba</span>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  to={`${item.path}${isPublic ? '?view=public' : ''}`} 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${
                    isActive ? 'bg-white text-senac-blue shadow-md' : 'text-gray-400 hover:text-senac-blue'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                  {item.isConflict && conflictCount > 0 && (
                    <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{conflictCount}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleFullscreen} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-senac-lightBlue transition-all">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            {!isPublic && (
              <Link to="/login" className="p-3 bg-senac-blue text-white rounded-xl shadow-lg shadow-blue-900/20 hover:bg-senac-dark transition-all">
                <Lock className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {children}
      </main>

      <footer className="bg-senac-dark text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="text-4xl font-black italic">Senac <span className="text-senac-orange">Uberaba</span></span>
            <div className="flex flex-col md:items-end text-center md:text-right gap-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                Sistema Integrado de Gestão de Espaços <br/> CNC | Fecomércio MG | Sesc
              </p>
              <p className="text-[9px] font-bold text-senac-orange uppercase">Ambiente de Gestão Unificado</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
