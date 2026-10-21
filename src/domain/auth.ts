import { AuthValidationResult, UserProfile } from '../types/auth';

// Usuários pré-cadastrados para o MVP de testes e demonstração do Projeto Integrador
const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Helena Santos',
    email: 'coordenador@esperancaviva.org',
    role: 'COORDINATOR',
    ongId: 'ong-1',
    ongName: 'ONG Esperança Viva — Unidade Central',
  },
  {
    id: 'usr-2',
    name: 'Carlos Eduardo',
    email: 'voluntario@doemais.org',
    role: 'VOLUNTEER',
    ongId: 'ong-1',
    ongName: 'ONG Esperança Viva — Unidade Central',
  },
];

/**
 * Validação de formulário de login (E-mail e Senha)
 */
export function validateLoginForm(email?: string, password?: string): AuthValidationResult {
  const errors: AuthValidationResult['errors'] = {};

  const trimmedEmail = (email || '').trim();
  const trimmedPassword = (password || '').trim();

  if (!trimmedEmail) {
    errors.email = 'E-mail é obrigatório.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Informe um e-mail válido.';
    }
  }

  if (!trimmedPassword) {
    errors.password = 'Senha é obrigatória.';
  } else if (trimmedPassword.length < 4) {
    errors.password = 'A senha deve ter pelo menos 4 caracteres.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Autenticação de usuário com credenciais
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<UserProfile> {
  const validation = validateLoginForm(email, password);
  if (!validation.isValid) {
    const firstError = validation.errors.email || validation.errors.password || 'Dados inválidos.';
    throw new Error(firstError);
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Simulação de autenticação com dados do protótipo
  const found = MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

  if (
    found &&
    (cleanPassword === 'doemais2026' || cleanPassword === 'senha123' || cleanPassword === '123456')
  ) {
    return found;
  }

  // Permite login com qualquer e-mail válido e senha correta para flexibilidade de demonstração se for doemais2026
  if (cleanPassword === 'doemais2026') {
    return {
      id: `usr-${Date.now()}`,
      name: 'Voluntário DoeMais',
      email: cleanEmail,
      role: 'VOLUNTEER',
      ongId: 'ong-1',
      ongName: 'ONG Esperança Viva — Unidade Central',
    };
  }

  throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
}
