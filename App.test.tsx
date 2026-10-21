import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from './App';

describe('App Integration (TDD)', () => {
  it('deve renderizar a tela de login inicialmente quando o usuário não estiver autenticado', () => {
    const { getByText, getByPlaceholderText } = render(<App />);

    expect(getByText('Doe')).toBeTruthy();
    expect(getByText('Mais')).toBeTruthy();
    expect(getByText('Acesse sua conta')).toBeTruthy();
    expect(getByPlaceholderText('coordenador@esperancaviva.org')).toBeTruthy();
  });

  it('deve autenticar o usuário e exibir o Dashboard de Estoque e a navegação por abas', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<App />);

    const emailInput = getByPlaceholderText('coordenador@esperancaviva.org');
    const passwordInput = getByPlaceholderText('••••••••••••');
    const submitBtn = getByText('Entrar no Sistema');

    fireEvent.changeText(emailInput, 'coordenador@esperancaviva.org');
    fireEvent.changeText(passwordInput, 'doemais2026');
    fireEvent.press(submitBtn);

    const dashboardTitle = await findByText('Inventário Central');
    expect(dashboardTitle).toBeTruthy();
    expect(getByText('Estoque')).toBeTruthy();
    expect(getByText('Entrada')).toBeTruthy();
    expect(getByText('Saída')).toBeTruthy();
  });
});
