import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { DonationItem } from '../types/inventory';
import { checkExpirationAlert } from '../domain/inventory';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface InventoryScreenProps {
  items: DonationItem[];
  onNavigateEntry?: () => void;
  onNavigateExit?: () => void;
  onSelectItem?: (item: DonationItem) => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  items,
  onNavigateEntry,
  onNavigateExit,
  onSelectItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cálculos de métricas em tempo real para o Bento Dashboard
  const metrics = useMemo(() => {
    let totalUnits = 0;
    let lowStockCount = 0;
    let expiringCount = 0;

    items.forEach((item) => {
      totalUnits += item.quantity;
      if (item.quantity <= 10) {
        lowStockCount++;
      }
      if (item.expirationDate && !item.isNonPerishable) {
        const alert = checkExpirationAlert(item.expirationDate);
        if (alert.hasAlert) {
          expiringCount++;
        }
      }
    });

    return { totalUnits, lowStockCount, expiringCount };
  }, [items]);

  // Filtros combinados de Categoria e Busca Textual
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const categoryChips = [
    { key: 'all', label: 'Todos', icon: 'view-grid-outline' },
    { key: 'alimentos', label: 'Alimentos', icon: 'food-apple-outline' },
    { key: 'higiene', label: 'Higiene', icon: 'bottle-tonic-outline' },
    { key: 'vestuario', label: 'Vestuário', icon: 'tshirt-crew-outline' },
    { key: 'medicamentos', label: 'Saúde', icon: 'medical-bag' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bento Overview Metrics Banner */}
        <Card style={styles.metricsCard}>
          <View style={styles.metricsHeader}>
            <View style={styles.metricsTitleRow}>
              <MaterialCommunityIcons
                name="warehouse"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.metricsTitle}>Inventário Central</Text>
            </View>
            <Badge label="Ao vivo" variant="live" />
          </View>

          {/* Quick Stats Bento */}
          <View style={styles.bentoGrid}>
            {/* Total */}
            <View style={[styles.bentoBox, styles.bentoBoxNeutral]}>
              <View style={styles.bentoLabelRow}>
                <MaterialCommunityIcons
                  name="package-variant"
                  size={14}
                  color={colors.secondary}
                />
                <Text style={styles.bentoLabelNeutral}>Total</Text>
              </View>
              <Text style={styles.bentoNumber}>{metrics.totalUnits}</Text>
              <Text style={styles.bentoSubtext}>unidades</Text>
            </View>

            {/* Low Stock */}
            <View style={[styles.bentoBox, styles.bentoBoxAmber]}>
              <View style={styles.bentoLabelRow}>
                <MaterialCommunityIcons
                  name="alert-outline"
                  size={14}
                  color={colors.tertiary}
                />
                <Text style={styles.bentoLabelAmber}>Baixo</Text>
              </View>
              <Text style={[styles.bentoNumber, styles.bentoNumberAmber]}>
                {metrics.lowStockCount}
              </Text>
              <Text style={styles.bentoSubtextAmber}>itens críticos</Text>
            </View>

            {/* Expiring */}
            <View style={[styles.bentoBox, styles.bentoBoxRed]}>
              <View style={styles.bentoLabelRow}>
                <MaterialCommunityIcons
                  name="calendar-alert"
                  size={14}
                  color={colors.error}
                />
                <Text style={styles.bentoLabelRed}>Vencendo</Text>
              </View>
              <Text style={[styles.bentoNumber, styles.bentoNumberRed]}>
                {metrics.expiringCount}
              </Text>
              <Text style={styles.bentoSubtextRed}>em 7 dias</Text>
            </View>
          </View>
        </Card>

        {/* Search & Filter Bar */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchInputWrapper}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={colors.outline}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar item ou código de barras..."
              placeholderTextColor={colors.outline}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.barcodeBtn}>
              <MaterialCommunityIcons
                name="barcode-scan"
                size={20}
                color={colors.outline}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.tuneBtn}>
            <MaterialCommunityIcons name="tune" size={22} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Category Horizontal Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
        >
          {categoryChips.map((chip) => {
            const isSelected = selectedCategory === chip.key;
            return (
              <TouchableOpacity
                key={chip.key}
                testID={`chip-${chip.key}`}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(chip.key)}
                style={[
                  styles.chipButton,
                  isSelected && styles.chipButtonSelected,
                ]}
              >
                <MaterialCommunityIcons
                  name={chip.icon as any}
                  size={16}
                  color={isSelected ? colors.onPrimary : colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.chipLabel,
                    isSelected && styles.chipLabelSelected,
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Inventory Items Header */}
        <View style={styles.listHeaderRow}>
          <View style={styles.listHeaderLeft}>
            <Text style={styles.listTitle}>Itens Cadastrados</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredItems.length} exibidos</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={styles.sortBtnText}>Ordenar</Text>
            <MaterialCommunityIcons
              name="swap-vertical"
              size={16}
              color={colors.primaryContainer}
            />
          </TouchableOpacity>
        </View>

        {/* Inventory Cards List */}
        <View style={styles.cardsList}>
          {filteredItems.map((item) => {
            // Avaliação de status com a regra de negócio do domínio
            const expiryAlert = checkExpirationAlert(item.expirationDate);
            const isLowStock = item.quantity <= 10;

            let badgeLabel = 'Normal';
            let badgeVariant: 'normal' | 'low' | 'expiring' | 'neutral' = 'normal';

            if (expiryAlert.hasAlert) {
              badgeLabel = expiryAlert.status === 'EXPIRED' ? 'Vencido' : 'Vencendo';
              badgeVariant = 'expiring';
            } else if (isLowStock) {
              badgeLabel = 'Estoque Baixo';
              badgeVariant = 'low';
            }

            return (
              <Card key={item.id} style={styles.itemCard}>
                {/* Top Section */}
                <View style={styles.itemCardTop}>
                  <View style={styles.itemCardIconCircle}>
                    <MaterialCommunityIcons
                      name={
                        item.category === 'Alimentos'
                          ? 'food-apple'
                          : item.category === 'Higiene'
                          ? 'sanitizer'
                          : item.category === 'Vestuário'
                          ? 'tshirt-crew'
                          : 'medical-bag'
                      }
                      size={24}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.itemCardInfo}>
                    <Text style={styles.itemCardTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemCardSubtitle}>
                      {item.category} • {item.location || 'Depósito Geral'}
                    </Text>
                  </View>

                  <Badge label={badgeLabel} variant={badgeVariant} />
                </View>

                {/* Bottom Section */}
                <View style={styles.itemCardBottom}>
                  <View style={styles.stockCol}>
                    <Text style={styles.stockLabel}>Estoque Disponível</Text>
                    <View style={styles.stockValueRow}>
                      <Text style={styles.stockNumber}>{item.quantity}</Text>
                      <Text style={styles.stockUnit}>{item.unit || 'un'}</Text>
                    </View>
                  </View>

                  <View style={styles.rightCardActions}>
                    <View style={styles.expiryInfoCol}>
                      <Text style={styles.expiryLabel}>Validade</Text>
                      <Text style={styles.expiryDateText}>
                        {item.isNonPerishable
                          ? 'Sem validade'
                          : item.expirationDate || 'Não informada'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => onSelectItem && onSelectItem(item)}
                      style={styles.chevronBtn}
                    >
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color={colors.onSurfaceVariant}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            );
          })}

          {filteredItems.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="package-variant-closed-remove"
                size={48}
                color={colors.outline}
              />
              <Text style={styles.emptyStateTitle}>Nenhum item encontrado</Text>
              <Text style={styles.emptyStateDesc}>
                Tente alterar os filtros ou cadastrar uma nova entrada de doação.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.md,
    paddingBottom: 40,
  },
  metricsCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metricsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    marginLeft: 6,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  bentoBox: {
    flex: 1,
    borderRadius: borderRadius.default,
    padding: spacing.sm,
  },
  bentoBoxNeutral: {
    backgroundColor: colors.surfaceContainerLow,
  },
  bentoBoxAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  bentoBoxRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  bentoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bentoLabelNeutral: {
    fontSize: 11,
    color: colors.secondary,
    marginLeft: 4,
  },
  bentoLabelAmber: {
    fontSize: 11,
    color: colors.tertiary,
    marginLeft: 4,
  },
  bentoLabelRed: {
    fontSize: 11,
    color: colors.error,
    marginLeft: 4,
  },
  bentoNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 2,
  },
  bentoNumberAmber: {
    color: colors.tertiary,
  },
  bentoNumberRed: {
    color: colors.error,
  },
  bentoSubtext: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  bentoSubtextAmber: {
    fontSize: 10,
    color: colors.tertiary,
  },
  bentoSubtextRed: {
    fontSize: 10,
    color: colors.error,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: 8,
  },
  searchInputWrapper: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 13,
    color: colors.onSurface,
  },
  barcodeBtn: {
    padding: 4,
  },
  tuneBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  chipsScroll: {
    marginBottom: spacing.md,
  },
  chipsContent: {
    gap: 8,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  chipButtonSelected: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
    marginLeft: 6,
  },
  chipLabelSelected: {
    color: colors.onPrimary,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  listHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  countBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginLeft: 8,
  },
  countText: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryContainer,
    marginRight: 2,
  },
  cardsList: {
    gap: 12,
  },
  itemCard: {
    padding: spacing.md,
  },
  itemCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemCardInfo: {
    flex: 1,
  },
  itemCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  itemCardSubtitle: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  itemCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    marginHorizontal: -spacing.md,
    marginBottom: -spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  stockCol: {},
  stockLabel: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  stockValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stockNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  stockUnit: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  rightCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryInfoCol: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  expiryLabel: {
    fontSize: 10,
    color: colors.outline,
  },
  expiryDateText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurface,
  },
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
    marginTop: 8,
  },
  emptyStateDesc: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
});
