import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

describe('LoginScreen Component (TDD)', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar os elementos da tela de login (logo, inputs, botões)', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    expect(getByText('Doe')).toBeTruthy();
    expect(getByText('Mais')).toBeTruthy();
    expect(getByText('Gestão de Estoque Social')).toBeTruthy();
    expect(getByText('Acesse sua conta')).toBeTruthy();
    expect(getByPlaceholderText('coordenador@esperancaviva.org')).toBeTruthy();
    expect(getByPlaceholderText('••••••••••••')).toBeTruthy();
    expect(getByText('Entrar no Sistema')).toBeTruthy();
  });

  it('deve exibir mensagem de erro se tentar submeter com campos vazios', async () => {
    const { getByText, findByText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const submitBtn = getByText('Entrar no Sistema');
    fireEvent.press(submitBtn);

    const errorMsg = await findByText('E-mail é obrigatório.');
    expect(errorMsg).toBeTruthy();
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });

  it('deve exibir erro quando credenciais forem inválidas', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const emailInput = getByPlaceholderText('coordenador@esperancaviva.org');
    const passwordInput = getByPlaceholderText('••••••••••••');
    const submitBtn = getByText('Entrar no Sistema');

    fireEvent.changeText(emailInput, 'usuario@inexistente.com');
    fireEvent.changeText(passwordInput, 'senha_errada');
    fireEvent.press(submitBtn);

    const errorMsg = await findByText('Credenciais inválidas. Verifique seu e-mail e senha.');
    expect(errorMsg).toBeTruthy();
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });

  it('deve chamar onLoginSuccess quando credenciais forem válidas', async () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const emailInput = getByPlaceholderText('coordenador@esperancaviva.org');
    const passwordInput = getByPlaceholderText('••••••••••••');
    const submitBtn = getByText('Entrar no Sistema');

    fireEvent.changeText(emailInput, 'coordenador@esperancaviva.org');
    fireEvent.changeText(passwordInput, 'doemais2026');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
