import { MovementType, StockStatus } from '../types/inventory';

export interface ExpirationAlertResult {
  hasAlert: boolean;
  status: StockStatus;
  daysRemaining: number | null;
}

/**
 * Calcula o novo saldo em estoque a partir de uma movimentação (Entrada ou Saída).
 *
 * @param currentStock Saldo atual do item no estoque da ONG
 * @param quantity Quantidade a ser movimentada
 * @param type Tipo de movimentação ('ENTRY' para recebimento, 'EXIT' para distribuição)
 * @returns Novo saldo calculado
 * @throws Error se a quantidade for menor ou igual a zero ou se a saída exceder o saldo atual
 */
export function calculateBalance(
  currentStock: number,
  quantity: number,
  type: MovementType
): number {
  if (quantity <= 0) {
    throw new Error('A quantidade deve ser maior que zero.');
  }

  if (type === 'ENTRY') {
    return currentStock + quantity;
  }

  if (type === 'EXIT') {
    if (quantity > currentStock) {
      throw new Error('Saldo insuficiente em estoque para realizar esta saída.');
    }
    return currentStock - quantity;
  }

  throw new Error(`Tipo de movimentação inválido: ${type}`);
}

/**
 * Avalia se um item está com validade próxima (próximos 7 dias) ou já vencido.
 * Fundamental para triagem humanitária e controle de perdas no galpão social.
 *
 * @param expirationDate Data de validade no formato YYYY-MM-DD
 * @param referenceDate Data de referência para comparação (padrão: hoje)
 * @returns Status de alerta e quantidade de dias restantes
 */
export function checkExpirationAlert(
  expirationDate?: string,
  referenceDate: Date = new Date()
): ExpirationAlertResult {
  if (!expirationDate) {
    return {
      hasAlert: false,
      status: 'NORMAL',
      daysRemaining: null,
    };
  }

  // Parse YYYY-MM-DD preservando dia local sem desvios de fuso
  const [yearStr, monthStr, dayStr] = expirationDate.split('-');
  const expiry = new Date(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    parseInt(dayStr, 10)
  );

  const ref = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  const diffTime = expiry.getTime() - ref.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      hasAlert: true,
      status: 'EXPIRED',
      daysRemaining: diffDays,
    };
  }

  if (diffDays <= 7) {
    return {
      hasAlert: true,
      status: 'EXPIRING',
      daysRemaining: diffDays,
    };
  }

  return {
    hasAlert: false,
    status: 'NORMAL',
    daysRemaining: diffDays,
  };
}
