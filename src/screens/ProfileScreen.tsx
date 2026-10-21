import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useInventory } from '../context/InventoryContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ProfileScreen: React.FC = () => {
  const { currentUser, logout, movements } = useInventory();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="account" size={40} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{currentUser?.name || 'Voluntário DoeMais'}</Text>
          <Text style={styles.userRole}>
            {currentUser?.role === 'COORDINATOR' ? 'Coordenador de Estoque' : 'Voluntário Operacional'}
          </Text>

          <View style={styles.ongBadge}>
            <MaterialCommunityIcons name="domain" size={16} color={colors.primary} />
            <Text style={styles.ongBadgeText}>
              {currentUser?.ongName || 'ONG Esperança Viva — Unidade Central'}
            </Text>
          </View>
        </Card>

        {/* Project Info Bento */}
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons name="school" size={20} color={colors.primary} />
            <Text style={styles.infoTitle}>Projeto Integrador 8 — UNIVALI</Text>
          </View>
          <Text style={styles.infoDesc}>
            Sistema desenvolvido para o ecossistema comunitário de Itajaí/SC com metodologia TDD (Test-Driven Development) rigorosa e arquitetura modular limpa.
          </Text>
          <View style={styles.tagsRow}>
            <View style={styles.tagItem}>
              <Text style={styles.tagText}>React Native Expo</Text>
            </View>
            <View style={styles.tagItem}>
              <Text style={styles.tagText}>Jest & RNTL</Text>
            </View>
            <View style={styles.tagItem}>
              <Text style={styles.tagText}>TypeScript Strict</Text>
            </View>
          </View>
        </Card>

        {/* Recent Movements Audit */}
        <Card style={styles.auditCard}>
          <View style={styles.auditHeader}>
            <MaterialCommunityIcons name="history" size={20} color={colors.onSurface} />
            <Text style={styles.auditTitle}>Histórico de Ações Recentes</Text>
          </View>

          {movements.length > 0 ? (
            movements.slice(0, 5).map((mov) => (
              <View key={mov.id} style={styles.movementItem}>
                <View
                  style={[
                    styles.movementIconBox,
                    mov.type === 'ENTRY' ? styles.movEntry : styles.movExit,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={mov.type === 'ENTRY' ? 'arrow-down-bold' : 'arrow-up-bold'}
                    size={16}
                    color={mov.type === 'ENTRY' ? colors.statusNormalText : colors.tertiary}
                  />
                </View>
                <View style={styles.movementInfo}>
                  <Text style={styles.movementItemName}>{mov.itemName}</Text>
                  <Text style={styles.movementDate}>
                    {mov.type === 'ENTRY' ? 'Entrada' : 'Saída'} • {mov.quantity} un • {mov.beneficiary || 'Recebimento'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMovements}>Nenhuma movimentação registrada nesta sessão.</Text>
          )}
        </Card>

        {/* Logout Button */}
        <Button
          title="Encerrar Sessão"
          variant="outline"
          onPress={logout}
          icon={<MaterialCommunityIcons name="logout" size={20} color={colors.onSurface} />}
          style={styles.logoutBtn}
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
  profileCard: {
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  userRole: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  ongBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  ongBadgeText: {
    fontSize: 12,
    color: colors.onSurface,
    fontWeight: '600',
    marginLeft: 6,
  },
  infoCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
    marginLeft: 6,
  },
  infoDesc: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  tagItem: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.default,
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  auditCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  auditTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    marginLeft: 6,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  movementIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  movEntry: {
    backgroundColor: colors.statusNormalBg,
  },
  movExit: {
    backgroundColor: colors.statusLowBg,
  },
  movementInfo: {
    flex: 1,
  },
  movementItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  movementDate: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  emptyMovements: {
    fontSize: 12,
    color: colors.outline,
    paddingVertical: 8,
  },
  logoutBtn: {
    marginTop: spacing.sm,
  },
});
