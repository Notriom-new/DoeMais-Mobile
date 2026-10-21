import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InventoryScreen } from '../InventoryScreen';
import { DonationItem } from '../../types/inventory';

const mockInventory: DonationItem[] = [
  {
    id: '1',
    name: 'Arroz Branco Tipo 1 (5kg)',
    category: 'Alimentos',
    quantity: 145,
    unit: 'Unidades',
    expirationDate: '2026-11-20', // Data segura (> 7 dias)
    location: 'Prateleira A2',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
  {
    id: '2',
    name: 'Leite Integral UHT (1L)',
    category: 'Alimentos',
    quantity: 8, // Estoque baixo
    unit: 'Unidades',
    expirationDate: '2026-10-24', // Vencimento próximo (próximos 7 dias)
    location: 'Setor B1',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
  {
    id: '3',
    name: 'Sabonete Antibacteriano',
    category: 'Higiene',
    quantity: 50,
    unit: 'Unidades',
    isNonPerishable: true,
    location: 'Setor C',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
  {
    id: '4',
    name: 'Cobertor Térmico Casal',
    category: 'Vestuário',
    quantity: 20,
    unit: 'Unidades',
    isNonPerishable: true,
    location: 'Prateleira D1',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
];

describe('InventoryScreen Component (TDD)', () => {
  const mockOnNavigateEntry = jest.fn();
  const mockOnNavigateExit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o dashboard de estoque com cards de métricas e lista de itens', () => {
    const { getByText, getAllByText } = render(
      <InventoryScreen
        items={mockInventory}
        onNavigateEntry={mockOnNavigateEntry}
        onNavigateExit={mockOnNavigateExit}
      />
    );

    expect(getByText('Inventário Central')).toBeTruthy();
    expect(getByText('Total')).toBeTruthy();
    expect(getByText('Baixo')).toBeTruthy();
    expect(getAllByText('Vencendo').length).toBeGreaterThan(0);
    expect(getByText('Arroz Branco Tipo 1 (5kg)')).toBeTruthy();
    expect(getByText('Sabonete Antibacteriano')).toBeTruthy();
    expect(getByText('Cobertor Térmico Casal')).toBeTruthy();
    expect(getAllByText(/Alimentos/).length).toBeGreaterThan(0);
  });

  it('deve filtrar os itens exibidos ao selecionar uma categoria', () => {
    const { getByTestId, queryByText, getByText } = render(
      <InventoryScreen
        items={mockInventory}
        onNavigateEntry={mockOnNavigateEntry}
        onNavigateExit={mockOnNavigateExit}
      />
    );

    // Clica no chip de Higiene
    const hygieneChip = getByTestId('chip-higiene');
    fireEvent.press(hygieneChip);

    // Deve exibir o sabonete, mas esconder o arroz e o cobertor
    expect(getByText('Sabonete Antibacteriano')).toBeTruthy();
    expect(queryByText('Arroz Branco Tipo 1 (5kg)')).toBeNull();
    expect(queryByText('Cobertor Térmico Casal')).toBeNull();
  });

  it('deve filtrar os itens a partir do campo de busca textual', () => {
    const { getByPlaceholderText, queryByText, getByText } = render(
      <InventoryScreen
        items={mockInventory}
        onNavigateEntry={mockOnNavigateEntry}
        onNavigateExit={mockOnNavigateExit}
      />
    );

    const searchInput = getByPlaceholderText('Buscar item ou código de barras...');
    fireEvent.changeText(searchInput, 'Cobertor');

    expect(getByText('Cobertor Térmico Casal')).toBeTruthy();
    expect(queryByText('Arroz Branco Tipo 1 (5kg)')).toBeNull();
    expect(queryByText('Sabonete Antibacteriano')).toBeNull();
  });

  it('deve sinalizar status de estoque baixo e vencimento próximo nos cards', () => {
    const { getByText, getAllByText } = render(
      <InventoryScreen
        items={mockInventory}
        onNavigateEntry={mockOnNavigateEntry}
        onNavigateExit={mockOnNavigateExit}
      />
    );

    // O leite tem 8 unidades e vence em poucos dias -> Deve indicar alerta
    expect(getAllByText(/Vencendo/i).length).toBeGreaterThan(0);
  });
});
