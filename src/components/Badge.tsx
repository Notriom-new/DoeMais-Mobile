import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';
import { StockStatus } from '../types/inventory';

export interface BadgeProps {
  label: string;
  status?: StockStatus;
  variant?: 'normal' | 'low' | 'expiring' | 'expired' | 'neutral' | 'live';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  status,
  variant,
  style,
}) => {
  // Mapeia status de estoque para variantes
  let activeVariant = variant;
  if (status) {
    if (status === 'NORMAL') activeVariant = 'normal';
    if (status === 'LOW') activeVariant = 'low';
    if (status === 'EXPIRING') activeVariant = 'expiring';
    if (status === 'EXPIRED') activeVariant = 'expired';
  }

  const isNormal = activeVariant === 'normal';
  const isLow = activeVariant === 'low';
  const isExpiring = activeVariant === 'expiring' || activeVariant === 'expired';
  const isLive = activeVariant === 'live';

  return (
    <View
      style={[
        styles.badge,
        isNormal && styles.normalBadge,
        isLow && styles.lowBadge,
        isExpiring && styles.expiringBadge,
        isLive && styles.liveBadge,
        style,
      ]}
    >
      <View
        style={[
          styles.dot,
          isNormal && styles.normalDot,
          isLow && styles.lowDot,
          isExpiring && styles.expiringDot,
          isLive && styles.liveDot,
        ]}
      />
      <Text
        style={[
          styles.label,
          isNormal && styles.normalText,
          isLow && styles.lowText,
          isExpiring && styles.expiringText,
          isLive && styles.liveText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    backgroundColor: colors.surfaceContainerLow,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: colors.onSurfaceVariant,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: colors.onSurface,
  },
  // Normal
  normalBadge: {
    backgroundColor: colors.statusNormalBg,
    borderColor: colors.statusNormalBorder,
  },
  normalDot: {
    backgroundColor: colors.statusNormalText,
  },
  normalText: {
    color: colors.statusNormalText,
  },
  // Low
  lowBadge: {
    backgroundColor: colors.statusLowBg,
    borderColor: colors.statusLowBorder,
  },
  lowDot: {
    backgroundColor: colors.statusLowText,
  },
  lowText: {
    color: colors.statusLowText,
  },
  // Expiring / Expired
  expiringBadge: {
    backgroundColor: colors.statusExpiringBg,
    borderColor: colors.statusExpiringBorder,
  },
  expiringDot: {
    backgroundColor: colors.statusExpiringText,
  },
  expiringText: {
    color: colors.statusExpiringText,
  },
  // Live
  liveBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'transparent',
  },
  liveDot: {
    backgroundColor: colors.primaryContainer,
  },
  liveText: {
    color: colors.primary,
  },
});
