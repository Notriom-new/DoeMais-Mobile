import React, { createContext, useContext, useState } from 'react';
import { DonationItem, StockMovement } from '../types/inventory';
import { UserProfile } from '../types/auth';
import { calculateBalance } from '../domain/inventory';

interface InventoryContextData {
  items: DonationItem[];
  movements: StockMovement[];
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  addItem: (item: Omit<DonationItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  dispatchItem: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  logout: () => void;
}

const INITIAL_ITEMS: DonationItem[] = [
  {
    id: 'item-1',
    name: 'Arroz Branco Tipo 1 (5kg)',
    category: 'Alimentos',
    quantity: 145,
    unit: 'Unidades',
    expirationDate: '2026-11-20',
    location: 'Prateleira A2',
    source: 'Campanha UNIVALI Solidária',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
  {
    id: 'item-2',
    name: 'Leite Integral UHT (1L)',
    category: 'Alimentos',
    quantity: 8,
    unit: 'Fardos',
    expirationDate: '2026-10-24', // Vencimento próximo (próximos 7 dias)
    location: 'Setor B1',
    source: 'Empresa Parceira Supermercados',
    createdAt: '2026-10-05',
    updatedAt: '2026-10-05',
  },
  {
    id: 'item-3',
    name: 'Sabonete Antibacteriano',
    category: 'Higiene',
    quantity: 50,
    unit: 'Unidades',
    isNonPerishable: true,
    location: 'Setor C - Higiene',
    source: 'Pessoa Física',
    createdAt: '2026-10-10',
    updatedAt: '2026-10-10',
  },
  {
    id: 'item-4',
    name: 'Cobertor Térmico Casal',
    category: 'Vestuário',
    quantity: 20,
    unit: 'Unidades',
    isNonPerishable: true,
    location: 'Prateleira D1',
    source: 'Campanha do Agasalho Itajaí',
    createdAt: '2026-10-12',
    updatedAt: '2026-10-12',
  },
  {
    id: 'item-5',
    name: 'Kit Primeiros Socorros',
    category: 'Medicamentos',
    quantity: 14,
    unit: 'Unidades',
    expirationDate: '2026-12-15',
    location: 'Farmácia Social',
    source: 'Defesa Civil SC',
    createdAt: '2026-10-15',
    updatedAt: '2026-10-15',
  },
];

const InventoryContext = createContext<InventoryContextData>({} as InventoryContextData);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<DonationItem[]>(INITIAL_ITEMS);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const addItem = (newItemData: Omit<DonationItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setItems((prevItems) => {
      // Verifica se o item já existe pelo nome e categoria
      const existingIndex = prevItems.findIndex(
        (it) => it.name.trim().toLowerCase() === newItemData.name.trim().toLowerCase()
      );

      const timestamp = new Date().toISOString();

      if (existingIndex >= 0) {
        const existing = prevItems[existingIndex];
        const newStock = calculateBalance(existing.quantity, newItemData.quantity, 'ENTRY');
        const updatedList = [...prevItems];
        updatedList[existingIndex] = {
          ...existing,
          quantity: newStock,
          updatedAt: timestamp,
        };
        return updatedList;
      }

      const created: DonationItem = {
        ...newItemData,
        id: `item-${Date.now()}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      return [created, ...prevItems];
    });

    // Registra movimentação de entrada
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId: 'entry',
      itemName: newItemData.name,
      type: 'ENTRY',
      quantity: newItemData.quantity,
      timestamp: new Date().toISOString(),
      volunteer: currentUser?.name || 'Voluntário Anônimo',
    };
    setMovements((prev) => [newMovement, ...prev]);
  };

  const dispatchItem = (movementData: Omit<StockMovement, 'id' | 'timestamp'>) => {
    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((it) => it.id === movementData.itemId);
      if (itemIndex < 0) return prevItems;

      const item = prevItems[itemIndex];
      // calculateBalance valida saldo negativo e lança exceção se insuficiente
      const newStock = calculateBalance(item.quantity, movementData.quantity, 'EXIT');

      const updatedList = [...prevItems];
      updatedList[itemIndex] = {
        ...item,
        quantity: newStock,
        updatedAt: new Date().toISOString(),
      };
      return updatedList;
    });

    const newMovement: StockMovement = {
      ...movementData,
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      volunteer: currentUser?.name || 'Voluntário DoeMais',
    };
    setMovements((prev) => [newMovement, ...prev]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        movements,
        currentUser,
        setCurrentUser,
        addItem,
        dispatchItem,
        logout,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
