import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { DonationCategory, DonationItem } from '../types/inventory';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface AddDonationScreenProps {
  onAddDonation: (item: Omit<DonationItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

export const AddDonationScreen: React.FC<AddDonationScreenProps> = ({
  onAddDonation,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DonationCategory>('Alimentos');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState<DonationItem['unit']>('Unidades');
  const [expirationDate, setExpirationDate] = useState('2026-12-31');
  const [isNonPerishable, setIsNonPerishable] = useState(false);
  const [source, setSource] = useState('Campanha Comunitária');
  const [location, setLocation] = useState('Galpão Central - Prateleira A');
  const [errorName, setErrorName] = useState<string | undefined>();

  const categories: { label: DonationCategory; icon: string; desc: string }[] = [
    { label: 'Alimentos', icon: 'food-apple-outline', desc: 'Cestas e grãos' },
    { label: 'Higiene', icon: 'bottle-tonic-outline', desc: 'Limpeza pessoal' },
    { label: 'Vestuário', icon: 'tshirt-crew-outline', desc: 'Roupas / cobertores' },
    { label: 'Medicamentos', icon: 'medical-bag', desc: 'Primeiros socorros' },
  ];

  const handleMinusQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlusQty = () => {
    setQuantity(quantity + 1);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setErrorName('Informe o nome do item doado.');
      return;
    }

    onAddDonation({
      name: name.trim(),
      category,
      quantity,
      unit,
      expirationDate: isNonPerishable ? undefined : expirationDate,
      isNonPerishable,
      source,
      location,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Title Section */}
        <View style={styles.headerTitleBox}>
          <View style={styles.headerTagRow}>
            <MaterialCommunityIcons
              name="plus-circle"
              size={18}
              color={colors.primaryContainer}
            />
            <Text style={styles.headerTagText}>GESTÃO DE DOAÇÕES</Text>
          </View>
          <Text style={styles.headerTitle}>Nova Entrada de Doação</Text>
          <Text style={styles.headerSubtitle}>
            Cadastre novos itens recebidos no estoque da ONG com facilidade e rapidez.
          </Text>
        </View>

        {/* Barcode Quick Scan Banner */}
        <View style={styles.scanBanner}>
          <View style={styles.scanIconBox}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={22}
              color={colors.primary}
            />
          </View>
          <View style={styles.scanTextBox}>
            <Text style={styles.scanTitle}>Entrada por Código</Text>
            <Text style={styles.scanDesc}>
              Bipe o código de barras para preenchimento rápido.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.scanBtn}
            onPress={() => Alert.alert('Scanner', 'Câmera do dispositivo pronta para leitura de EAN/QRCode.')}
          >
            <MaterialCommunityIcons name="camera" size={16} color={colors.onPrimary} />
            <Text style={styles.scanBtnText}>Escanear</Text>
          </TouchableOpacity>
        </View>

        {/* Main Form Fields */}
        <Card style={styles.formCard}>
          {/* Item Name */}
          <Input
            label="Nome do Item"
            required
            placeholder="Ex.: Arroz Agulhinha 5kg, Fralda G..."
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errorName) setErrorName(undefined);
            }}
            error={errorName}
            leftIcon={
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={20}
                color={colors.onSurfaceVariant}
              />
            }
          />

          {/* Categories Grid */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>Categoria do Item</Text>
              <Text style={styles.requiredStar}> *</Text>
            </View>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <TouchableOpacity
                    key={cat.label}
                    activeOpacity={0.7}
                    onPress={() => setCategory(cat.label)}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.catIconCircle,
                        isSelected && styles.catIconCircleSelected,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={cat.icon as any}
                        size={20}
                        color={isSelected ? colors.onPrimary : colors.onSurfaceVariant}
                      />
                    </View>
                    <View style={styles.catTextCol}>
                      <Text
                        style={[
                          styles.catTitle,
                          isSelected && styles.catTitleSelected,
                        ]}
                      >
                        {cat.label}
                      </Text>
                      <Text style={styles.catDesc}>{cat.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quantity & Unit Stepper */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>Quantidade Recebida</Text>
              <Text style={styles.requiredStar}> *</Text>
            </View>
            <View style={styles.quantityRow}>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleMinusQty}
                  style={styles.stepperBtn}
                  testID="qty-minus-btn"
                >
                  <MaterialCommunityIcons name="minus" size={20} color={colors.onSurface} />
                </TouchableOpacity>

                <TextInput
                  value={String(quantity)}
                  onChangeText={(val) => {
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed) && parsed > 0) setQuantity(parsed);
                  }}
                  keyboardType="numeric"
                  style={styles.quantityInput}
                />

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handlePlusQty}
                  style={styles.stepperBtn}
                  testID="qty-plus-btn"
                >
                  <MaterialCommunityIcons name="plus" size={20} color={colors.onSurface} />
                </TouchableOpacity>
              </View>

              {/* Units Picker Options */}
              <View style={styles.unitPicker}>
                <Text style={styles.unitCurrent}>{unit}</Text>
              </View>
            </View>
          </View>

          {/* Expiration Date Section */}
          <View style={styles.expirationCard}>
            <View style={styles.expHeaderRow}>
              <View style={styles.expTitleRow}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={18}
                  color={colors.tertiary}
                />
                <Text style={styles.expLabel}>Data de Validade</Text>
              </View>
              <View style={styles.fifoBadge}>
                <Text style={styles.fifoText}>Controle FIFO</Text>
              </View>
            </View>

            {!isNonPerishable && (
              <TextInput
                value={expirationDate}
                onChangeText={setExpirationDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={colors.outline}
                style={styles.dateInput}
              />
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsNonPerishable(!isNonPerishable)}
              style={styles.checkboxRow}
            >
              <MaterialCommunityIcons
                name={isNonPerishable ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={isNonPerishable ? colors.primaryContainer : colors.outline}
              />
              <Text style={styles.checkboxText}>
                Item não perecível (sem validade crítica)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Origin & Location */}
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Origem da Doação</Text>
              <View style={styles.metaBox}>
                <MaterialCommunityIcons
                  name="hand-heart"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.metaValue} numberOfLines={1}>
                  {source}
                </Text>
              </View>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Local no Galpão</Text>
              <View style={styles.metaBox}>
                <MaterialCommunityIcons
                  name="warehouse"
                  size={16}
                  color={colors.secondary}
                />
                <Text style={styles.metaValue} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <Button
            title="Confirmar Entrada"
            onPress={handleSubmit}
            icon={
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={colors.onPrimary}
              />
            }
            style={styles.submitBtn}
          />
        </Card>
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
    color: colors.primaryContainer,
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
  scanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  scanIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  scanTextBox: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  scanDesc: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.default,
    marginLeft: 6,
  },
  scanBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onPrimary,
    marginLeft: 4,
  },
  formCard: {
    padding: spacing.md,
  },
  sectionContainer: {
    marginVertical: spacing.sm,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  requiredStar: {
    color: colors.error,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: colors.primaryContainer,
  },
  catIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  catIconCircleSelected: {
    backgroundColor: colors.primaryContainer,
  },
  catTextCol: {
    flex: 1,
  },
  catTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  catTitleSelected: {
    color: colors.primaryContainer,
  },
  catDesc: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperContainer: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: 4,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.default,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  unitPicker: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  unitCurrent: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  expirationCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
  },
  expHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  expTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
    marginLeft: 6,
  },
  fifoBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  fifoText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.onSecondaryContainer,
  },
  dateInput: {
    height: 44,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.onSurface,
    marginVertical: spacing.xs,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  checkboxText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginLeft: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  metaCol: {
    flex: 1,
    marginHorizontal: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  metaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.default,
    paddingHorizontal: 8,
    height: 38,
  },
  metaValue: {
    fontSize: 11,
    color: colors.onSurface,
    marginLeft: 6,
    flex: 1,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
