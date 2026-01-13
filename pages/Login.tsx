
import React, { useState } from 'react';
import { LogIn, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) setError(true);
  };

  return (
    <div className="min-h-screen bg-[#e9ecf0] flex flex-col items-center justify-center p-4">
      {/* Banner Revertido */}
      <div className="bg-white w-full max-w-md rounded-t-3xl p-8 border-b border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="text-3xl font-black text-[#004a8e] italic leading-none">Senac</span>
          <div className="flex items-center mt-1">
            <span className="h-[2px] w-4 bg-[#f39200] mr-1"></span>
            <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Uberaba</span>
          </div>
        </div>
        <div className="text-right border-l border-gray-200 pl-4 hidden sm:block">
          <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight tracking-tighter">CNC | Fecomércio MG</p>
          <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight tracking-tighter">Sindicatos | Sesc</p>
        </div>
      </div>

      <div className="bg-white w-full max-w-md p-10 rounded-b-3xl shadow-xl space-y-8 animate-fadeIn">
        <div className="text-center">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Gestão de Espaços</h2>
          <p className="text-sm text-gray-500 font-medium">Faça login para acessar o painel de Uberaba</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-senac-blue/30 focus:bg-white p-4 pl-12 rounded-2xl outline-none transition-all font-bold text-sm"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-senac-blue/30 focus:bg-white p-4 pl-12 rounded-2xl outline-none transition-all font-bold text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-xs font-bold animate-pulse">
              <AlertCircle className="w-4 h-4" />
              Credenciais inválidas. Tente novamente.
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#004a8e] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 hover:bg-[#003566] transition-all flex items-center justify-center gap-2"
          >
            Acessar Sistema <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            Acesso exclusivo para colaboradores <br/> Senac Uberaba
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
