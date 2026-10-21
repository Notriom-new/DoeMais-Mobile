import { validateLoginForm, authenticateUser } from './auth';

describe('Auth Domain - Regras de Negócio de Autenticação (TDD)', () => {
  describe('validateLoginForm', () => {
    it('deve retornar erro quando e-mail e senha estiverem vazios', () => {
      const result = validateLoginForm('', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('E-mail é obrigatório.');
      expect(result.errors.password).toBe('Senha é obrigatória.');
    });

    it('deve retornar erro quando o e-mail não tiver formato válido', () => {
      const result = validateLoginForm('email-invalido', '123456');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Informe um e-mail válido.');
    });

    it('deve retornar erro quando a senha tiver menos de 4 caracteres', () => {
      const result = validateLoginForm('coordenador@esperanca.org', '123');
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe('A senha deve ter pelo menos 4 caracteres.');
    });

    it('deve validar com sucesso quando credenciais forem fornecidas corretamente', () => {
      const result = validateLoginForm('voluntario@doemais.org', 'senha123');
      expect(result.isValid).toBe(true);
      expect(result.errors.email).toBeUndefined();
      expect(result.errors.password).toBeUndefined();
    });
  });

  describe('authenticateUser', () => {
    it('deve autenticar com sucesso para credenciais cadastradas', async () => {
      const user = await authenticateUser('coordenador@esperancaviva.org', 'doemais2026');
      expect(user).toBeDefined();
      expect(user.email).toBe('coordenador@esperancaviva.org');
      expect(user.ongName).toContain('Esperança');
    });

    it('deve lançar erro se as credenciais forem incorretas', async () => {
      await expect(
        authenticateUser('coordenador@esperancaviva.org', 'senha_errada')
      ).rejects.toThrow('Credenciais inválidas. Verifique seu e-mail e senha.');
    });
  });
});
