
export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Equipment {
  brand: string;
  model: string;
  serialNumber: string;
}

export interface Client {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Budget {
  id: string;
  companyName: string;
  client: Client;
  equipment: Equipment;
  entryDate: string;
  items: BudgetItem[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  observations: string;
  total: number;
}

export interface User {
  username: string;
  name: string;
}
