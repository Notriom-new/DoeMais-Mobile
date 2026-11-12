import { AuthValidationResult, UserProfile } from '../types/auth';

interface StoredUser extends UserProfile {
  passwordHash: string;
}

// Banco em memória inicial com usuários pré-cadastrados para o MVP de testes e demonstração do Projeto Integrador
const USERS_DB: StoredUser[] = [
  {
    id: 'usr-1',
    name: 'Helena Santos',
    email: 'coordenador@esperancaviva.org',
    role: 'COORDINATOR',
    ongId: 'ong-1',
    ongName: 'ONG Esperança Viva — Unidade Central',
    passwordHash: 'doemais2026',
  },
  {
    id: 'usr-2',
    name: 'Carlos Eduardo',
    email: 'voluntario@doemais.org',
    role: 'VOLUNTEER',
    ongId: 'ong-1',
    ongName: 'ONG Esperança Viva — Unidade Central',
    passwordHash: 'doemais2026',
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

export interface RegisterValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  };
}

/**
 * Validação de formulário de cadastro de conta
 */
export function validateRegisterForm(
  name?: string,
  email?: string,
  password?: string
): RegisterValidationResult {
  const errors: RegisterValidationResult['errors'] = {};

  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedPassword = (password || '').trim();

  if (!trimmedName) {
    errors.name = 'Nome completo é obrigatório.';
  } else if (trimmedName.length < 3) {
    errors.name = 'O nome deve ter pelo menos 3 caracteres.';
  }

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
 * Registro de novo voluntário/usuário no aplicativo
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  ongName: string = 'ONG Esperança Viva — Unidade Central'
): Promise<UserProfile> {
  const validation = validateRegisterForm(name, email, password);
  if (!validation.isValid) {
    const firstError =
      validation.errors.name || validation.errors.email || validation.errors.password || 'Dados inválidos.';
    throw new Error(firstError);
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPassword = password.trim();

  const existing = USERS_DB.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('Este e-mail já está cadastrado no sistema.');
  }

  const newUser: StoredUser = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    role: 'VOLUNTEER',
    ongId: 'ong-1',
    ongName,
    passwordHash: cleanPassword,
  };

  USERS_DB.push(newUser);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    ongId: newUser.ongId,
    ongName: newUser.ongName,
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

  // Verifica na base de usuários cadastrados
  const found = USERS_DB.find((u) => u.email.toLowerCase() === cleanEmail);

  if (found && (found.passwordHash === cleanPassword || cleanPassword === 'doemais2026')) {
    return {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      ongId: found.ongId,
      ongName: found.ongName,
    };
  }

  // Permite login com qualquer e-mail válido com a senha mestre de demonstração
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
