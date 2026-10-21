import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { DonationItem, StockMovement } from '../types/inventory';
import { calculateBalance } from '../domain/inventory';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface ExitDonationScreenProps {
  items: DonationItem[];
  onConfirmExit: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  onCancel?: () => void;
}

export const ExitDonationScreen: React.FC<ExitDonationScreenProps> = ({
  items,
  onConfirmExit,
  onCancel,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    items.length > 0 ? items[0].id : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<StockMovement['reason']>('direta');
  const [beneficiary, setBeneficiary] = useState('Família Silva - Cadastro #402');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];
  const maxStock = selectedItem ? selectedItem.quantity : 0;

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setErrorMsg(null);
    }
  };

  const handlePlus = () => {
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
      setErrorMsg(null);
    }
  };

  const handleSetPreset = (val: number) => {
    const clamped = Math.min(val, maxStock);
    setQuantity(clamped > 0 ? clamped : 1);
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    if (!selectedItem) {
      setErrorMsg('Nenhum item selecionado para saída.');
      return;
    }

    try {
      // Regra de ouro do TDD: calculateBalance valida e impede saldo negativo
      calculateBalance(selectedItem.quantity, quantity, 'EXIT');

      onConfirmExit({
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        type: 'EXIT',
        quantity,
        reason,
        beneficiary,
        volunteer: 'Voluntário DoeMais',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao processar a saída.');
    }
  };

  const percentage = maxStock > 0 ? Math.round((quantity / maxStock) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Contextual Header */}
        <View style={styles.headerTitleBox}>
          <View style={styles.headerTagRow}>
            <MaterialCommunityIcons
              name="truck-delivery"
              size={18}
              color={colors.tertiaryContainer}
            />
            <Text style={styles.headerTagText}>LOGÍSTICA DE DISTRIBUIÇÃO</Text>
          </View>
          <Text style={styles.headerTitle}>Registrar Saída / Distribuição</Text>
          <Text style={styles.headerSubtitle}>
            Dê baixa nos itens destinados às famílias e instituições atendidas.
          </Text>
        </View>

        {/* Social Impact Banner */}
        <View style={styles.impactCard}>
          <View style={styles.impactIconBox}>
            <MaterialCommunityIcons
              name="shield-check"
              size={22}
              color={colors.primary}
            />
          </View>
          <View style={styles.impactTextBox}>
            <Text style={styles.impactTitle}>Impacto & Transparência</Text>
            <Text style={styles.impactDesc}>
              As baixas alimentam em tempo real o relatório público comunitário da ONG.
            </Text>
          </View>
        </View>

        {/* 1. Item Selector Card */}
        <Card style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>Selecionar Item do Estoque</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.scanChip}
              onPress={() => Alert.alert('Escanear', 'Aponte a câmera para o código do item.')}
            >
              <MaterialCommunityIcons
                name="barcode-scan"
                size={14}
                color={colors.primary}
              />
              <Text style={styles.scanChipText}>Escanear</Text>
            </TouchableOpacity>
          </View>

          {/* Current Selected Item Preview */}
          {selectedItem ? (
            <View style={styles.itemPreviewBox}>
              <View style={styles.itemPreviewIcon}>
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.itemPreviewTextCol}>
                <Text style={styles.itemPreviewTitle} numberOfLines={1}>
                  {selectedItem.name}
                </Text>
                <Text style={styles.itemPreviewSubtitle}>
                  {selectedItem.category} • {selectedItem.location || 'Galpão Principal'}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyItemsText}>Nenhum item cadastrado no estoque.</Text>
          )}

          {/* Item Selector Dropdown / Scroll */}
          {items.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.itemListScroll}
            >
              {items.map((it) => {
                const isSelected = it.id === selectedItemId;
                return (
                  <TouchableOpacity
                    key={it.id}
                    onPress={() => {
                      setSelectedItemId(it.id);
                      setQuantity(1);
                      setErrorMsg(null);
                    }}
                    style={[
                      styles.itemChip,
                      isSelected && styles.itemChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemChipText,
                        isSelected && styles.itemChipTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {it.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Stock Balance Indicator */}
          <View style={styles.balanceBadgeRow}>
            <View style={styles.balanceDotRow}>
              <View style={styles.balanceDot} />
              <Text style={styles.balanceLabel}>Saldo disponível em depósito</Text>
            </View>
            <Text style={styles.balanceValue}>
              {maxStock} {selectedItem?.unit || 'Unidades'}
            </Text>
          </View>
        </Card>

        {/* 2. Quantity Touch Stepper Card */}
        <Card style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>Quantidade para Baixa</Text>
            <Text style={styles.maxNotice}>
              Máximo: {maxStock} {selectedItem?.unit || 'un'}
            </Text>
          </View>

          {/* Stepper Controls */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleMinus}
              style={styles.stepperActionBtn}
              testID="exit-minus-btn"
            >
              <MaterialCommunityIcons name="minus" size={24} color={colors.onSurface} />
            </TouchableOpacity>

            <View style={styles.stepperValueCol}>
              <View style={styles.stepperValueRow}>
                <Text style={styles.stepperNumber}>{quantity}</Text>
                <Text style={styles.stepperUnit}>{selectedItem?.unit || 'un'}</Text>
              </View>
              <Text style={styles.percentageText}>
                {percentage}% do estoque atual
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePlus}
              style={styles.stepperActionBtn}
              testID="exit-plus-btn"
            >
              <MaterialCommunityIcons name="plus" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Quick Presets */}
          <View style={styles.presetsRow}>
            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => handleSetPreset(1)}
            >
              <Text style={styles.presetBtnText}>1 un</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => handleSetPreset(5)}
            >
              <Text style={styles.presetBtnText}>5 un</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => handleSetPreset(10)}
            >
              <Text style={styles.presetBtnText}>10 un</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.presetBtn, styles.presetBtnHighlight]}
              onPress={() => handleSetPreset(maxStock)}
            >
              <Text style={[styles.presetBtnText, styles.presetBtnHighlightText]}>
                Tudo
              </Text>
            </TouchableOpacity>
          </View>

          {errorMsg && (
            <View style={styles.errorAlert}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color={colors.error}
              />
              <Text style={styles.errorAlertText}>{errorMsg}</Text>
            </View>
          )}
        </Card>

        {/* 3. Reason of Dispatch */}
        <Card style={styles.sectionCard}>
          <Text style={styles.cardLabel}>Motivo da Saída</Text>
          <View style={styles.reasonList}>
            {[
              {
                id: 'direta' as const,
                title: 'Distribuição Direta para Família',
                desc: 'Entrega pontual por demanda social',
                icon: 'account-group',
              },
              {
                id: 'cesta' as const,
                title: 'Cesta Básica Emergencial',
                desc: 'Composição de kit humanitário',
                icon: 'shopping',
              },
              {
                id: 'repasse' as const,
                title: 'Repasse para Outra Instituição',
                desc: 'Parcerias e abrigos conveniados',
                icon: 'domain',
              },
              {
                id: 'descarte' as const,
                title: 'Descarte / Item Danificado',
                desc: 'Avaria ou perda no armazenamento',
                icon: 'delete-sweep',
              },
            ].map((r) => {
              const isSelected = reason === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  activeOpacity={0.7}
                  onPress={() => setReason(r.id)}
                  style={[
                    styles.reasonItem,
                    isSelected && styles.reasonItemSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={r.icon as any}
                    size={22}
                    color={isSelected ? colors.primaryContainer : colors.onSurfaceVariant}
                    style={styles.reasonIcon}
                  />
                  <View style={styles.reasonTextCol}>
                    <Text
                      style={[
                        styles.reasonTitle,
                        isSelected && styles.reasonTitleSelected,
                      ]}
                    >
                      {r.title}
                    </Text>
                    <Text style={styles.reasonDesc}>{r.desc}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                    size={20}
                    color={isSelected ? colors.primaryContainer : colors.outline}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* 4. Beneficiary */}
        <Card style={styles.sectionCard}>
          <Input
            label="Destinatário / Beneficiário"
            placeholder="Nome, CPF ou família..."
            value={beneficiary}
            onChangeText={setBeneficiary}
            leftIcon={
              <MaterialCommunityIcons
                name="account-search"
                size={20}
                color={colors.onSurfaceVariant}
              />
            }
          />
        </Card>

        {/* Submit Button */}
        <Button
          title="Confirmar Distribuição"
          onPress={handleSubmit}
          disabled={maxStock <= 0}
          icon={
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={colors.onPrimary}
            />
          }
          style={styles.submitBtn}
        />
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
  headerTitleBox: {
    marginBottom: spacing.md,
  },
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.tertiary,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  impactIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  impactTextBox: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSecondaryFixed,
  },
  impactDesc: {
    fontSize: 11,
    color: colors.onSecondaryContainer,
    marginTop: 2,
  },
  sectionCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  scanChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.default,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  scanChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  itemPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  itemPreviewIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.default,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemPreviewTextCol: {
    flex: 1,
  },
  itemPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  itemPreviewSubtitle: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  emptyItemsText: {
    fontSize: 13,
    color: colors.outline,
    paddingVertical: 8,
  },
  itemListScroll: {
    marginTop: spacing.sm,
  },
  itemChip: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemChipSelected: {
    borderColor: colors.primaryContainer,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  itemChipText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  itemChipTextSelected: {
    color: colors.primaryContainer,
    fontWeight: '600',
  },
  balanceBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: borderRadius.default,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: spacing.sm,
  },
  balanceDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
    marginRight: 6,
  },
  balanceLabel: {
    fontSize: 11,
    color: colors.onPrimaryFixedVariant,
  },
  balanceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onPrimaryFixedVariant,
  },
  maxNotice: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: 6,
    marginVertical: spacing.xs,
  },
  stepperActionBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.default,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperValueCol: {
    alignItems: 'center',
  },
  stepperValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stepperNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onSurface,
  },
  stepperUnit: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  percentageText: {
    fontSize: 11,
    color: colors.primaryContainer,
    fontWeight: '600',
    marginTop: 2,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.default,
    paddingVertical: 8,
    alignItems: 'center',
  },
  presetBtnHighlight: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },
  presetBtnHighlightText: {
    color: colors.primaryContainer,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    padding: spacing.sm,
    borderRadius: borderRadius.default,
    marginTop: spacing.sm,
  },
  errorAlertText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: 6,
  },
  reasonList: {
    marginTop: spacing.xs,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  reasonItemSelected: {
    borderColor: colors.primaryContainer,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
  },
  reasonIcon: {
    marginRight: 10,
  },
  reasonTextCol: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  reasonTitleSelected: {
    color: colors.primaryContainer,
  },
  reasonDesc: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
});
