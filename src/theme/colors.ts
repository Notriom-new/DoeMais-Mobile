/**
 * Paleta de cores oficial do DoeMais Mobile System
 * Baseada no DESIGN.md do projeto UNIVALI PI8
 */
export const colors = {
  // Cores principais
  primary: '#006c49',
  primaryContainer: '#10b981', // Emerald 500
  onPrimary: '#ffffff',
  onPrimaryContainer: '#00422b',
  primaryFixed: '#6ffbbe',
  primaryFixedDim: '#4edea3',
  onPrimaryFixedVariant: '#005236',

  // Superfícies e fundos
  background: '#f8fafc', // Slate 50
  surface: '#f7f9fb',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f5f9', // Slate 100
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e2e8f0', // Slate 200
  surfaceContainerHighest: '#cbd5e1', // Slate 300
  onSurface: '#0f172a', // Slate 900
  onSurfaceVariant: '#475569', // Slate 600

  // Cores secundárias
  secondary: '#565e74',
  secondaryContainer: '#dae2fd',
  onSecondaryContainer: '#1e293b',
  onSecondaryFixed: '#131b2e',

  // Alertas / Terciárias (Estoque Baixo / Atenção)
  tertiary: '#b45309', // Amber 700
  tertiaryContainer: '#f59e0b',
  tertiaryFixed: '#fffbeb', // Amber 50
  tertiaryBorder: '#fde68a',
  onTertiaryContainer: '#78350f',

  // Erro / Validade Crítica
  error: '#ba1a1a', // Crimson
  errorContainer: '#fef2f2', // Red 50
  errorBorder: '#fecaca',
  onError: '#ffffff',
  onErrorContainer: '#991b1b',

  // Status de Estoque Específicos
  statusNormalBg: '#ecfdf5',
  statusNormalText: '#047857',
  statusNormalBorder: '#a7f3d0',

  statusLowBg: '#fffbeb',
  statusLowText: '#b45309',
  statusLowBorder: '#fde68a',

  statusExpiringBg: '#fef2f2',
  statusExpiringText: '#b91c1c',
  statusExpiringBorder: '#fecaca',

  // Linhas e contornos
  outline: '#94a3b8',
  outlineVariant: '#cbd5e1',
} as const;
