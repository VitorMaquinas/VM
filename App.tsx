
import React, { useState, useEffect } from 'react';
import { User, Budget } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BudgetForm from './components/BudgetForm';
import PrintView from './components/PrintView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [view, setView] = useState<'dashboard' | 'form' | 'print'>('dashboard');
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  useEffect(() => {
    const storedBudgets = localStorage.getItem('budgets');
    if (storedBudgets) {
      setBudgets(JSON.parse(storedBudgets));
    }
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleImport = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  const saveBudget = (budget: Budget) => {
    let newBudgets: Budget[];
    const exists = budgets.find(b => b.id === budget.id);
    if (exists) {
      newBudgets = budgets.map(b => b.id === budget.id ? budget : b);
    } else {
      newBudgets = [budget, ...budgets];
    }
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
    setView('dashboard');
  };

  const deleteBudget = (id: string) => {
    const newBudgets = budgets.filter(b => b.id !== id);
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (view === 'print' && selectedBudget) {
    return <PrintView budget={selectedBudget} onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-lg no-print">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-file-invoice-dollar text-2xl"></i>
            <h1 className="text-xl font-bold">OrçaMaster Pro</h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="hidden md:inline">Olá, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <Dashboard 
            budgets={budgets} 
            onCreate={() => {
              setSelectedBudget(null);
              setView('form');
            }}
            onEdit={(b) => {
              setSelectedBudget(b);
              setView('form');
            }}
            onPrint={(b) => {
              setSelectedBudget(b);
              setView('print');
            }}
            onDelete={deleteBudget}
            onImport={handleImport}
          />
        )}
        
        {view === 'form' && (
          <BudgetForm 
            budget={selectedBudget} 
            onSave={saveBudget} 
            onCancel={() => setView('dashboard')} 
          />
        )}
      </main>

      <footer className="bg-white border-t py-4 no-print text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} OrçaMaster Pro - Gerenciador de Orçamentos
      </footer>
    </div>
  );
};

export default App;
