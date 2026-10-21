import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  onProfilePress?: () => void;
  showProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onProfilePress,
  showProfile = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="hand-heart" size={20} color={colors.primary} />
        </View>
        <View style={styles.titleWrapper}>
          <View style={styles.nameRow}>
            <Text style={styles.titleDoe}>Doe</Text>
            <Text style={styles.titleMais}>Mais</Text>
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {showProfile && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onProfilePress}
          style={styles.profileButton}
          testID="header-profile-button"
        >
          <MaterialCommunityIcons name="account-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titleWrapper: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleDoe: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  titleMais: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryContainer,
  },
  subtitle: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: -2,
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
