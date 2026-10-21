import { calculateBalance, checkExpirationAlert } from './inventory';

describe('Inventory Domain - Regras de Negócio de Estoque (TDD)', () => {
  describe('calculateBalance', () => {
    it('deve incrementar o saldo em caso de entrada (ENTRY)', () => {
      const currentStock = 100;
      const quantity = 50;
      const result = calculateBalance(currentStock, quantity, 'ENTRY');
      expect(result).toBe(150);
    });

    it('deve decrementar o saldo em caso de saída (EXIT)', () => {
      const currentStock = 100;
      const quantity = 30;
      const result = calculateBalance(currentStock, quantity, 'EXIT');
      expect(result).toBe(70);
    });

    it('deve zerar o estoque quando a saída for igual ao saldo disponível', () => {
      const currentStock = 50;
      const quantity = 50;
      const result = calculateBalance(currentStock, quantity, 'EXIT');
      expect(result).toBe(0);
    });

    it('deve lançar um erro/exceção se a quantidade de EXIT for maior que o saldo disponível (impede saldo negativo)', () => {
      const currentStock = 20;
      const quantity = 25;
      expect(() => {
        calculateBalance(currentStock, quantity, 'EXIT');
      }).toThrow('Saldo insuficiente em estoque para realizar esta saída.');
    });

    it('deve lançar um erro caso a quantidade informada seja menor ou igual a zero', () => {
      expect(() => {
        calculateBalance(10, 0, 'ENTRY');
      }).toThrow('A quantidade deve ser maior que zero.');

      expect(() => {
        calculateBalance(10, -5, 'EXIT');
      }).toThrow('A quantidade deve ser maior que zero.');
    });
  });

  describe('checkExpirationAlert', () => {
    const today = new Date('2026-10-21T12:00:00Z');

    it('deve sinalizar alerta caso o item esteja vencido (data anterior a hoje)', () => {
      // 2 dias atrás
      const expiredDate = '2026-10-19';
      const result = checkExpirationAlert(expiredDate, today);
      expect(result.hasAlert).toBe(true);
      expect(result.status).toBe('EXPIRED');
      expect(result.daysRemaining).toBeLessThan(0);
    });

    it('deve sinalizar alerta caso o item vença hoje', () => {
      const todayDate = '2026-10-21';
      const result = checkExpirationAlert(todayDate, today);
      expect(result.hasAlert).toBe(true);
      expect(result.status).toBe('EXPIRING');
      expect(result.daysRemaining).toBe(0);
    });

    it('deve sinalizar alerta caso a data de validade esteja dentro dos próximos 7 dias (crítico)', () => {
      // Daqui a 5 dias
      const nearFutureDate = '2026-10-26';
      const result = checkExpirationAlert(nearFutureDate, today);
      expect(result.hasAlert).toBe(true);
      expect(result.status).toBe('EXPIRING');
      expect(result.daysRemaining).toBe(5);
    });

    it('deve sinalizar alerta no limite exato de 7 dias restantes', () => {
      // Daqui a 7 dias
      const exactSevenDays = '2026-10-28';
      const result = checkExpirationAlert(exactSevenDays, today);
      expect(result.hasAlert).toBe(true);
      expect(result.status).toBe('EXPIRING');
      expect(result.daysRemaining).toBe(7);
    });

    it('NÃO deve sinalizar alerta caso a data de validade seja superior a 7 dias', () => {
      // Daqui a 30 dias
      const safeDate = '2026-11-20';
      const result = checkExpirationAlert(safeDate, today);
      expect(result.hasAlert).toBe(false);
      expect(result.status).toBe('NORMAL');
      expect(result.daysRemaining).toBeGreaterThan(7);
    });

    it('não deve gerar alerta se a data for indefinida ou não perecível', () => {
      const result = checkExpirationAlert(undefined, today);
      expect(result.hasAlert).toBe(false);
      expect(result.status).toBe('NORMAL');
      expect(result.daysRemaining).toBeNull();
    });
  });
});
