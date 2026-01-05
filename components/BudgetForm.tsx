
import React, { useState, useEffect } from 'react';
import { Budget, BudgetItem, Client, Equipment } from '../types';
import { optimizeDescription } from '../services/geminiService';

interface BudgetFormProps {
  budget: Budget | null;
  onSave: (b: Budget) => void;
  onCancel: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ budget, onSave, onCancel }) => {
  const [client, setClient] = useState<Client>(budget?.client || { name: '', phone: '', email: '', address: '' });
  const [equipment, setEquipment] = useState<Equipment>(budget?.equipment || { brand: '', model: '', serialNumber: '' });
  const [entryDate, setEntryDate] = useState(budget?.entryDate || new Date().toISOString().split('T')[0]);
  const [companyName, setCompanyName] = useState(budget?.companyName || 'Minha Empresa de Serviços');
  const [items, setItems] = useState<BudgetItem[]>(budget?.items || [{ id: '1', description: '', quantity: 1, unitPrice: 0 }]);
  const [observations, setObservations] = useState(budget?.observations || '');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const handleOptimize = async () => {
    if (!observations.trim()) return;
    setIsOptimizing(true);
    const result = await optimizeDescription(observations);
    setObservations(result);
    setIsOptimizing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget: Budget = {
      id: budget?.id || Math.random().toString(36).substr(2, 9).toUpperCase(),
      companyName,
      client,
      equipment,
      entryDate,
      items,
      observations,
      status: budget?.status || 'pending',
      total: calculateTotal()
    };
    onSave(newBudget);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12 animate-fadeIn">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">{budget ? 'Editar Orçamento' : 'Novo Orçamento'}</h2>
        <div className="space-x-4">
          <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-700 font-medium">Cancelar</button>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md">Salvar Orçamento</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600 flex items-center">
            <i className="fas fa-building mr-2"></i> Dados da Empresa
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Minha Empresa</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Entrada</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600 flex items-center">
            <i className="fas fa-user mr-2"></i> Dados do Cliente
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => setClient({...client, name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone/WhatsApp</label>
                <input
                  type="text"
                  value={client.phone}
                  onChange={(e) => setClient({...client, phone: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={client.email}
                  onChange={(e) => setClient({...client, email: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="contato@email.com"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-4 text-indigo-600 flex items-center">
          <i className="fas fa-tools mr-2"></i> Dados do Equipamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
            <input
              type="text"
              value={equipment.brand}
              onChange={(e) => setEquipment({...equipment, brand: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Samsung, Dell, Apple"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
            <input
              type="text"
              value={equipment.model}
              onChange={(e) => setEquipment({...equipment, model: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Latitude 3420"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Número de Série</label>
            <input
              type="text"
              value={equipment.serialNumber}
              onChange={(e) => setEquipment({...equipment, serialNumber: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="S/N: 12345ABC"
              required
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-indigo-600 flex items-center">
            <i className="fas fa-list-ul mr-2"></i> Itens do Orçamento
          </h3>
          <button type="button" onClick={addItem} className="text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded-lg font-bold flex items-center">
            <i className="fas fa-plus mr-1"></i> Adicionar Item
          </button>
        </div>
        
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="flex gap-4 items-end animate-fadeIn">
              <div className="flex-grow">
                <label className="block text-xs font-medium text-slate-400 mb-1">Descrição do Serviço/Peça</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Troca de Tela LED"
                  required
                />
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-slate-400 mb-1">Qtd</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  min="1"
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-slate-400 mb-1">Preço Unit.</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="R$ 0,00"
                  required
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-400 hover:text-red-600 mb-0.5"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl flex justify-between items-center">
          <span className="text-slate-600 font-semibold">Valor Total do Orçamento:</span>
          <span className="text-2xl font-black text-indigo-700">
            {calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-indigo-600 flex items-center">
            <i className="fas fa-comment-alt mr-2"></i> Observações Técnicas
          </h3>
          <button 
            type="button" 
            onClick={handleOptimize}
            disabled={isOptimizing || !observations}
            className={`text-sm px-3 py-1 rounded-lg font-bold flex items-center transition-colors ${
              isOptimizing ? 'bg-slate-100 text-slate-400' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
            }`}
          >
            <i className={`fas fa-magic mr-1 ${isOptimizing ? 'animate-spin' : ''}`}></i>
            {isOptimizing ? 'Otimizando...' : 'Otimizar com IA'}
          </button>
        </div>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 h-32"
          placeholder="Descreva o defeito relatado, laudo técnico ou observações extras..."
        ></textarea>
        <p className="text-xs text-slate-400 mt-2">Use o botão Otimizar com IA para tornar o texto mais profissional.</p>
      </section>
    </form>
  );
};

export default BudgetForm;
