import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { validateLoginForm, authenticateUser, validateRegisterForm, registerUser } from '../domain/auth';
import { UserProfile } from '../types/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOng, setSelectedOng] = useState('ONG Esperança Viva — Unidade Central');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

  const handleLogin = async () => {
    setErrors({});
    const validation = validateLoginForm(email, password);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const user = await authenticateUser(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrors({ general: err.message || 'Erro ao realizar login.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setErrors({});
    const validation = validateRegisterForm(name, email, password);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const newUser = await registerUser(name, email, password, selectedOng);
      Alert.alert('Conta Criada com Sucesso!', `Bem-vindo(a), ${newUser.name}! Você já está conectado.`);
      onLoginSuccess(newUser);
    } catch (err: any) {
      setErrors({ general: err.message || 'Erro ao cadastrar conta.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBiometrics = async () => {
    setLoading(true);
    try {
      const user = await authenticateUser('coordenador@esperancaviva.org', 'doemais2026');
      onLoginSuccess(user);
    } catch {
      setErrors({ general: 'Não foi possível validar biometria.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <View style={styles.logoInner}>
                <MaterialCommunityIcons
                  name="hand-heart"
                  size={42}
                  color={colors.primary}
                />
              </View>
              <View style={styles.leafBadge}>
                <MaterialCommunityIcons name="leaf" size={14} color={colors.onPrimary} />
              </View>
            </View>

            <View style={styles.brandTitleRow}>
              <Text style={styles.titleDoe}>Doe</Text>
              <Text style={styles.titleMais}>Mais</Text>
            </View>

            <View style={styles.tagPill}>
              <View style={styles.tagDot} />
              <Text style={styles.tagText}>Gestão de Estoque Social</Text>
            </View>

            <View style={styles.welcomeBox}>
              <Text style={styles.welcomeTitle}>
                {mode === 'login' ? 'Acesse sua conta' : 'Criar nova conta'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {mode === 'login'
                  ? 'Gerencie as doações da sua entidade de forma transparente e ágil.'
                  : 'Cadastre-se como voluntário(a) e participe da gestão de doações.'}
              </Text>
            </View>
          </View>

          {/* Mode Switch Tabs */}
          <View style={styles.tabsSwitchContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setMode('login');
                setErrors({});
              }}
              style={[styles.switchTab, mode === 'login' && styles.switchTabActive]}
            >
              <Text style={[styles.switchTabText, mode === 'login' && styles.switchTabTextActive]}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setMode('register');
                setErrors({});
              }}
              style={[styles.switchTab, mode === 'register' && styles.switchTabActive]}
            >
              <Text style={[styles.switchTabText, mode === 'register' && styles.switchTabTextActive]}>
                Cadastrar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Card */}
          <Card style={styles.loginCard}>
            {/* ONG Unit Info */}
            <View style={styles.ongSelectorBox}>
              <Text style={styles.ongLabel}>Entidade / Unidade Social</Text>
              <View style={styles.ongValueBox}>
                <MaterialCommunityIcons
                  name="domain"
                  size={20}
                  color={colors.onSurfaceVariant}
                  style={styles.ongIcon}
                />
                <Text style={styles.ongValueText} numberOfLines={1}>
                  {selectedOng}
                </Text>
              </View>
            </View>

            {/* General Error Alert */}
            {errors.general && (
              <View style={styles.generalErrorBox}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={18}
                  color={colors.error}
                />
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            {/* Name Field (apenas no modo cadastro) */}
            {mode === 'register' && (
              <Input
                label="Nome Completo"
                placeholder="Ex.: Maria Oliveira"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
                leftIcon={
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                }
              />
            )}

            {/* Email Field */}
            <Input
              label="E-mail de Acesso"
              placeholder="coordenador@esperancaviva.org"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              }
            />

            {/* Password Field */}
            <Input
              label="Senha"
              placeholder="••••••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              secureTextEntry={!showPassword}
              error={errors.password}
              leftIcon={
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              }
              rightIcon={
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            {/* Remember Me Option (apenas no login) */}
            {mode === 'login' && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <MaterialCommunityIcons
                  name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={20}
                  color={rememberMe ? colors.primaryContainer : colors.outline}
                />
                <Text style={styles.rememberText}>Lembrar nesta unidade</Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <Button
              title={mode === 'login' ? 'Entrar no Sistema' : 'Criar Minha Conta'}
              onPress={mode === 'login' ? handleLogin : handleRegister}
              loading={loading}
              icon={
                <MaterialCommunityIcons
                  name={mode === 'login' ? 'arrow-right' : 'check-circle-outline'}
                  size={20}
                  color={colors.onPrimary}
                />
              }
              style={styles.submitBtn}
            />

            {/* Divider & Biometrics (apenas no login) */}
            {mode === 'login' && (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OU</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  title="Entrar com Biometria / Face ID"
                  variant="secondary"
                  onPress={handleBiometrics}
                  icon={
                    <MaterialCommunityIcons
                      name="fingerprint"
                      size={22}
                      color={colors.primary}
                    />
                  }
                  iconPosition="left"
                />
              </>
            )}

            {/* Toggle Mode Footer Link */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrors({});
              }}
              style={styles.toggleModeLink}
            >
              <Text style={styles.toggleModeText}>
                {mode === 'login' ? (
                  <>
                    Não possui cadastro? <Text style={styles.toggleModeHighlight}>Cadastre-se aqui</Text>
                  </>
                ) : (
                  <>
                    Já possui conta? <Text style={styles.toggleModeHighlight}>Faça login aqui</Text>
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Volunteer Tip */}
          <View style={styles.tipCard}>
            <View style={styles.tipIconBox}>
              <MaterialCommunityIcons
                name="face-agent"
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Primeiro plantão como voluntário?</Text>
              <Text style={styles.tipDesc}>
                Solicite seu código PIN com o gestor do polo de Itajaí/SC.
              </Text>
            </View>
          </View>

          {/* Security Footer */}
          <View style={styles.footer}>
            <View style={styles.auditRow}>
              <MaterialCommunityIcons
                name="shield-check"
                size={16}
                color={colors.primaryContainer}
              />
              <Text style={styles.auditText}>
                Ambiente auditado · DoeMais Core v2.4 (UNIVALI PI8)
              </Text>
            </View>
            <Text style={styles.subAuditText}>
              Acesso restrito e criptografado para voluntários autorizados.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.lg,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleDoe: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.onSurface,
  },
  titleMais: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryContainer,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
    marginRight: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  welcomeBox: {
    alignItems: 'center',
    marginTop: spacing.md,
    maxWidth: 280,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
  },
  tabsSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.xs,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.default,
  },
  switchTabActive: {
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  switchTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  switchTabTextActive: {
    color: colors.primaryContainer,
  },
  loginCard: {
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  ongSelectorBox: {
    marginBottom: spacing.sm,
  },
  ongLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 6,
  },
  ongValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    height: 48,
    paddingHorizontal: spacing.md,
  },
  ongIcon: {
    marginRight: 8,
  },
  ongValueText: {
    fontSize: 13,
    color: colors.onSurface,
    fontWeight: '500',
    flex: 1,
  },
  generalErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    padding: spacing.sm,
    borderRadius: borderRadius.default,
    marginBottom: spacing.sm,
  },
  generalErrorText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: 6,
    flex: 1,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  rememberText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginLeft: 8,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surfaceContainerHigh,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.outline,
    marginHorizontal: 12,
  },
  toggleModeLink: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: 6,
  },
  toggleModeText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  toggleModeHighlight: {
    color: colors.primaryContainer,
    fontWeight: '700',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  tipIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  tipDesc: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  subAuditText: {
    fontSize: 11,
    color: colors.outline,
    marginTop: 4,
    textAlign: 'center',
  },
});
