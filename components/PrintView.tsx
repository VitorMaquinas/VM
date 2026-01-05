
import React from 'react';
import { Budget } from '../types';

interface PrintViewProps {
  budget: Budget;
  onBack: () => void;
}

const BudgetCopy: React.FC<{ budget: Budget; copyType: string }> = ({ budget, copyType }) => (
  <div className="text-slate-900 bg-white p-4 border border-slate-200">
    <div className="flex justify-between items-start mb-6 border-b pb-4">
      <div>
        <h1 className="text-2xl font-bold text-indigo-700">{budget.companyName}</h1>
        <p className="text-sm text-slate-500 italic">Documento: Orçamento / Ordem de Serviço</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">Nº {budget.id.substring(0, 8)}</p>
        <p className="text-sm">{new Date(budget.entryDate).toLocaleDateString()}</p>
        <p className="text-xs uppercase font-bold text-slate-400 mt-1">{copyType}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-8 mb-6">
      <div>
        <h2 className="text-xs font-bold uppercase text-slate-400 mb-2 border-b">Dados do Cliente</h2>
        <p className="font-bold">{budget.client.name}</p>
        <p className="text-sm">{budget.client.phone}</p>
        {budget.client.email && <p className="text-sm">{budget.client.email}</p>}
      </div>
      <div>
        <h2 className="text-xs font-bold uppercase text-slate-400 mb-2 border-b">Dados do Equipamento</h2>
        <p className="font-bold">{budget.equipment.brand} - {budget.equipment.model}</p>
        <p className="text-sm">S/N: {budget.equipment.serialNumber}</p>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-xs font-bold uppercase text-slate-400 mb-2 border-b">Serviços e Peças</h2>
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left py-1 px-2">Descrição</th>
            <th className="text-center py-1 px-2">Qtd</th>
            <th className="text-right py-1 px-2">V. Unit</th>
            <th className="text-right py-1 px-2">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {budget.items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-1 px-2">{item.description}</td>
              <td className="text-center py-1 px-2">{item.quantity}</td>
              <td className="text-right py-1 px-2">{item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="text-right py-1 px-2 font-semibold">{(item.quantity * item.unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100">
            <td colSpan={3} className="text-right py-2 px-2 font-bold uppercase text-xs">Valor Total do Orçamento</td>
            <td className="text-right py-2 px-2 font-bold text-indigo-700">
              {budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    {budget.observations && (
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase text-slate-400 mb-1 border-b">Laudo / Observações</h2>
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{budget.observations}</p>
      </div>
    )}

    <div className="flex gap-8 mt-12 mb-4">
      <div className="flex-grow border-t border-slate-400 pt-1 text-center">
        <p className="text-[10px] uppercase font-bold text-slate-400">Assinatura da Empresa</p>
      </div>
      <div className="flex-grow border-t border-slate-400 pt-1 text-center">
        <p className="text-[10px] uppercase font-bold text-slate-400">Assinatura do Cliente</p>
      </div>
    </div>
  </div>
);

const PrintView: React.FC<PrintViewProps> = ({ budget, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-200 min-h-screen">
      <div className="no-print p-4 bg-white shadow-md flex justify-between items-center sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center text-slate-600 font-bold">
          <i className="fas fa-arrow-left mr-2"></i> Voltar
        </button>
        <div className="flex gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">A impressão gerará 2 cópias por página.</span>
          <button 
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold flex items-center transition-all shadow-lg"
          >
            <i className="fas fa-print mr-2"></i> Imprimir Documento
          </button>
        </div>
      </div>

      <div className="print-page bg-white mx-auto shadow-2xl my-4 flex flex-col gap-4">
        {/* Via do Cliente */}
        <BudgetCopy budget={budget} copyType="1ª VIA - CLIENTE" />
        
        {/* Divisor Visual para Impressão */}
        <div className="copy-separator flex items-center justify-center relative h-1">
          <span className="absolute bg-white px-4 text-[10px] text-slate-300 font-bold border rounded-full no-print">
            Corte aqui para separar as cópias
          </span>
        </div>

        {/* Via do Arquivo */}
        <BudgetCopy budget={budget} copyType="2ª VIA - ARQUIVO" />
      </div>
    </div>
  );
};

export default PrintView;
