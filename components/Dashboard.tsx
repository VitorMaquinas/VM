
import React, { useRef } from 'react';
import { Budget } from '../types';

interface DashboardProps {
  budgets: Budget[];
  onCreate: () => void;
  onEdit: (b: Budget) => void;
  onPrint: (b: Budget) => void;
  onDelete: (id: string) => void;
  onImport: (data: Budget[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ budgets, onCreate, onEdit, onPrint, onDelete, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(budgets, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backup_orcamentos_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          if (window.confirm(`Deseja importar ${json.length} orçamentos? Isso substituirá os dados atuais.`)) {
            onImport(json);
          }
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo. Certifique-se de que é um JSON válido.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <i className="fas fa-sync-alt text-indigo-600"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Sincronização de Dados</h3>
            <p className="text-xs text-slate-500">Mova seus dados para outro computador</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".json"
          />
          <button 
            onClick={handleImportClick}
            className="flex-1 lg:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
          >
            <i className="fas fa-file-import mr-2"></i> Importar Backup
          </button>
          <button 
            onClick={handleExport}
            className="flex-1 lg:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
          >
            <i className="fas fa-file-export mr-2"></i> Exportar Backup
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Orçamentos</h2>
          <p className="text-slate-500">Lista de serviços e equipamentos</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-md active:scale-95"
        >
          <i className="fas fa-plus mr-2"></i> Novo Orçamento
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {budgets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-block p-6 bg-slate-50 rounded-full mb-4">
              <i className="fas fa-folder-open text-slate-300 text-5xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-600">Nenhum orçamento encontrado</h3>
            <p className="text-slate-400">Crie um novo ou importe um backup de outro computador.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold">
                  <th className="px-6 py-4">Data/ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Equipamento</th>
                  <th className="px-6 py-4">Valor Total</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {budgets.map((budget) => (
                  <tr key={budget.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{new Date(budget.entryDate).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">#{budget.id.substring(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{budget.client.name}</div>
                      <div className="text-xs text-slate-400">{budget.client.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{budget.equipment.brand} - {budget.equipment.model}</div>
                      <div className="text-xs text-slate-400">S/N: {budget.equipment.serialNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-indigo-600">
                        {budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => onPrint(budget)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Imprimir"
                        >
                          <i className="fas fa-print"></i>
                        </button>
                        <button 
                          onClick={() => onEdit(budget)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Excluir este orçamento?')) onDelete(budget.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
