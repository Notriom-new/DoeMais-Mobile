export type DonationCategory = 'Alimentos' | 'Higiene' | 'Vestuário' | 'Medicamentos';

export type MovementType = 'ENTRY' | 'EXIT';

export type StockStatus = 'NORMAL' | 'LOW' | 'EXPIRING' | 'EXPIRED';

export interface DonationItem {
  id: string;
  name: string;
  category: DonationCategory;
  quantity: number;
  unit: 'Unidades' | 'Kg' | 'Litros' | 'Fardos';
  expirationDate?: string; // Formato YYYY-MM-DD
  isNonPerishable?: boolean;
  location?: string;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: MovementType;
  quantity: number;
  reason?: 'direta' | 'cesta' | 'repasse' | 'descarte' | 'doacao_recebida';
  beneficiary?: string;
  volunteer?: string;
  timestamp: string;
}

export interface InventoryStats {
  totalItems: number;
  lowStockCount: number;
  expiringCount: number;
}
