import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ExitDonationScreen } from '../ExitDonationScreen';
import { DonationItem } from '../../types/inventory';

const mockItems: DonationItem[] = [
  {
    id: 'item-1',
    name: 'Leite Integral UHT (1L)',
    category: 'Alimentos',
    quantity: 18,
    unit: 'Fardos',
    expirationDate: '2026-11-15',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
  {
    id: 'item-2',
    name: 'Arroz Branco 5kg',
    category: 'Alimentos',
    quantity: 50,
    unit: 'Unidades',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
];

describe('ExitDonationScreen Component (TDD)', () => {
  const mockOnConfirmExit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a tela de saída com o item selecionado e o saldo disponível', () => {
    const { getByText, getAllByText } = render(
      <ExitDonationScreen
        items={mockItems}
        onConfirmExit={mockOnConfirmExit}
        onCancel={mockOnCancel}
      />
    );

    expect(getByText('Registrar Saída / Distribuição')).toBeTruthy();
    expect(getByText('Selecionar Item do Estoque')).toBeTruthy();
    expect(getAllByText('Leite Integral UHT (1L)').length).toBeGreaterThan(0);
    expect(getByText('18 Fardos')).toBeTruthy();
    expect(getByText('Confirmar Distribuição')).toBeTruthy();
  });

  it('deve permitir incrementar e decrementar a quantidade de saída', () => {
    const { getByTestId, getByText } = render(
      <ExitDonationScreen
        items={mockItems}
        onConfirmExit={mockOnConfirmExit}
        onCancel={mockOnCancel}
      />
    );

    const btnPlus = getByTestId('exit-plus-btn');
    const btnMinus = getByTestId('exit-minus-btn');

    // Valor inicial padrão é 1
    expect(getByText('1')).toBeTruthy();

    fireEvent.press(btnPlus);
    expect(getByText('2')).toBeTruthy();

    fireEvent.press(btnMinus);
    expect(getByText('1')).toBeTruthy();
  });

  it('deve impedir ou alertar se a quantidade de saída ultrapassar o saldo disponível em estoque', () => {
    const { getByText, getByTestId } = render(
      <ExitDonationScreen
        items={mockItems}
        onConfirmExit={mockOnConfirmExit}
        onCancel={mockOnCancel}
      />
    );

    const btnAll = getByText('Tudo');
    fireEvent.press(btnAll);
    expect(getByText('18')).toBeTruthy();

    // Tentar adicionar mais 1 acima do saldo (18 + 1 = 19)
    const btnPlus = getByTestId('exit-plus-btn');
    fireEvent.press(btnPlus);

    // Deve permanecer no máximo 18
    expect(getByText('18')).toBeTruthy();
  });

  it('deve submeter a saída com sucesso chamando onConfirmExit', async () => {
    const { getByText } = render(
      <ExitDonationScreen
        items={mockItems}
        onConfirmExit={mockOnConfirmExit}
        onCancel={mockOnCancel}
      />
    );

    const submitBtn = getByText('Confirmar Distribuição');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(mockOnConfirmExit).toHaveBeenCalledTimes(1);
      expect(mockOnConfirmExit).toHaveBeenCalledWith(
        expect.objectContaining({
          itemId: 'item-1',
          quantity: 1,
        })
      );
    });
  });
});
