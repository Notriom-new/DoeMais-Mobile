import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TabKey = 'inventory' | 'entry' | 'exit' | 'profile';

export interface BottomNavigationProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs = [
    {
      key: 'inventory' as TabKey,
      label: 'Estoque',
      icon: 'archive-outline',
      activeIcon: 'archive',
    },
    {
      key: 'entry' as TabKey,
      label: 'Entrada',
      icon: 'plus-circle-outline',
      activeIcon: 'plus-circle',
    },
    {
      key: 'exit' as TabKey,
      label: 'Saída',
      icon: 'minus-circle-outline',
      activeIcon: 'minus-circle',
    },
    {
      key: 'profile' as TabKey,
      label: 'Perfil / ONG',
      icon: 'office-building-outline',
      activeIcon: 'office-building',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => onTabChange(tab.key)}
            style={styles.tabItem}
            testID={`tab-${tab.key}`}
          >
            <MaterialCommunityIcons
              name={(isActive ? tab.activeIcon : tab.icon) as any}
              size={24}
              color={isActive ? colors.primaryContainer : colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
    minHeight: 48,
    paddingHorizontal: spacing.sm,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  activeTabLabel: {
    color: colors.primaryContainer,
  },
  inactiveTabLabel: {
    color: colors.onSurfaceVariant,
  },
});
