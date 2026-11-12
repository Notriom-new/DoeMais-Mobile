import { validateLoginForm, authenticateUser, validateRegisterForm, registerUser } from './auth';

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

  describe('validateRegisterForm', () => {
    it('deve retornar erro se o nome tiver menos de 3 caracteres', () => {
      const result = validateRegisterForm('Jo', 'joao@email.com', '123456');
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('O nome deve ter pelo menos 3 caracteres.');
    });

    it('deve retornar erro se o e-mail for inválido', () => {
      const result = validateRegisterForm('João Silva', 'email_ruim', '123456');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Informe um e-mail válido.');
    });
  });

  describe('registerUser & authenticateUser', () => {
    it('deve cadastrar um novo usuário com sucesso e permitir login com a senha cadastrada', async () => {
      const novoEmail = 'maria.voluntaria@gmail.com';
      const novaSenha = 'senhaSecreta123';

      const user = await registerUser('Maria Oliveira', novoEmail, novaSenha);
      expect(user).toBeDefined();
      expect(user.name).toBe('Maria Oliveira');
      expect(user.email).toBe(novoEmail);

      // Agora autentica com as credenciais criadas
      const loggedUser = await authenticateUser(novoEmail, novaSenha);
      expect(loggedUser.id).toBe(user.id);
      expect(loggedUser.email).toBe(novoEmail);
    });

    it('deve lançar erro se tentar cadastrar e-mail duplicado', async () => {
      await expect(
        registerUser('Outro Usuário', 'coordenador@esperancaviva.org', 'outraSenha')
      ).rejects.toThrow('Este e-mail já está cadastrado no sistema.');
    });

    it('deve lançar erro se a senha digitada for diferente da cadastrada', async () => {
      await expect(
        authenticateUser('maria.voluntaria@gmail.com', 'senha_errada')
      ).rejects.toThrow('Credenciais inválidas. Verifique seu e-mail e senha.');
    });
  });
});
