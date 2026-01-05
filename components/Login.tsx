
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de autenticação simples conforme pedido
    if (username === 'admin' && password === 'admin') {
      onLogin({ username: 'admin', name: 'Administrador' });
    } else {
      setError('Credenciais inválidas. Tente admin / admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
            <i className="fas fa-lock text-indigo-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">OrçaMaster Pro</h2>
          <p className="text-slate-500">Acesse o sistema de orçamentos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Usuário</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Seu usuário"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <i className="fas fa-key"></i>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Sua senha"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
