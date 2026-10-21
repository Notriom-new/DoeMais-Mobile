import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddDonationScreen } from '../AddDonationScreen';

describe('AddDonationScreen Component (TDD)', () => {
  const mockOnAddDonation = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar campos de Nome, Categoria, Quantidade e Data de Validade', () => {
    const { getByText, getByPlaceholderText } = render(
      <AddDonationScreen onAddDonation={mockOnAddDonation} onCancel={mockOnCancel} />
    );

    expect(getByText('Nova Entrada de Doação')).toBeTruthy();
    expect(getByText('Nome do Item')).toBeTruthy();
    expect(getByPlaceholderText(/Arroz Agulhinha/i)).toBeTruthy();
    expect(getByText('Alimentos')).toBeTruthy();
    expect(getByText('Higiene')).toBeTruthy();
    expect(getByText('Vestuário')).toBeTruthy();
    expect(getByText('Quantidade Recebida')).toBeTruthy();
    expect(getByText('Data de Validade')).toBeTruthy();
    expect(getByText('Confirmar Entrada')).toBeTruthy();
  });

  it('deve exibir erro caso o nome do item não seja preenchido', () => {
    const { getByText } = render(
      <AddDonationScreen onAddDonation={mockOnAddDonation} onCancel={mockOnCancel} />
    );

    const submitBtn = getByText('Confirmar Entrada');
    fireEvent.press(submitBtn);

    expect(getByText('Informe o nome do item doado.')).toBeTruthy();
    expect(mockOnAddDonation).not.toHaveBeenCalled();
  });

  it('deve permitir cadastrar item com Nome, Categoria, Quantidade e Validade', async () => {
    const { getByText, getByPlaceholderText } = render(
      <AddDonationScreen onAddDonation={mockOnAddDonation} onCancel={mockOnCancel} />
    );

    const nameInput = getByPlaceholderText(/Arroz Agulhinha/i);
    fireEvent.changeText(nameInput, 'Feijão Preto Tipo 1 (1kg)');

    // Seleciona Categoria Vestuário
    const vestuarioBtn = getByText('Vestuário');
    fireEvent.press(vestuarioBtn);

    const submitBtn = getByText('Confirmar Entrada');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(mockOnAddDonation).toHaveBeenCalledTimes(1);
      expect(mockOnAddDonation).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Feijão Preto Tipo 1 (1kg)',
          category: 'Vestuário',
        })
      );
    });
  });

  it('deve permitir incrementar e decrementar a quantidade recebida', () => {
    const { getByTestId, getByDisplayValue } = render(
      <AddDonationScreen onAddDonation={mockOnAddDonation} onCancel={mockOnCancel} />
    );

    const btnPlus = getByTestId('qty-plus-btn');
    const btnMinus = getByTestId('qty-minus-btn');

    // Valor inicial é 10
    expect(getByDisplayValue('10')).toBeTruthy();

    fireEvent.press(btnPlus);
    expect(getByDisplayValue('11')).toBeTruthy();

    fireEvent.press(btnMinus);
    expect(getByDisplayValue('10')).toBeTruthy();
  });
});
