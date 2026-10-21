import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  headlineLg: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  headlineLgMobile: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  headlineMd: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  headlineSm: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  titleMd: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  labelLg: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  labelSm: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: 0.5,
  },
};
