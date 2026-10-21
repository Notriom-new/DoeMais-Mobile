import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme/colors';
import { Header } from './src/components/Header';
import { BottomNavigation, TabKey } from './src/components/BottomNavigation';
import { LoginScreen } from './src/screens/LoginScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { AddDonationScreen } from './src/screens/AddDonationScreen';
import { ExitDonationScreen } from './src/screens/ExitDonationScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { InventoryProvider, useInventory } from './src/context/InventoryContext';

const MainNavigator: React.FC = () => {
  const { currentUser, setCurrentUser, items, addItem, dispatchItem } = useInventory();
  const [currentTab, setCurrentTab] = useState<TabKey>('inventory');

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const handleAddDonation = (data: any) => {
    addItem(data);
    Alert.alert('Sucesso!', 'Entrada de doação cadastrada com sucesso no estoque.');
    setCurrentTab('inventory');
  };

  const handleConfirmExit = (movement: any) => {
    dispatchItem(movement);
    Alert.alert('Baixa Concluída!', 'Distribuição registrada e contabilizada no estoque.');
    setCurrentTab('inventory');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.surfaceContainerLowest} />
      <Header
        subtitle={currentUser.ongName}
        onProfilePress={() => setCurrentTab('profile')}
      />

      <View style={styles.content}>
        {currentTab === 'inventory' && (
          <InventoryScreen
            items={items}
            onNavigateEntry={() => setCurrentTab('entry')}
            onNavigateExit={() => setCurrentTab('exit')}
          />
        )}

        {currentTab === 'entry' && (
          <AddDonationScreen
            onAddDonation={handleAddDonation}
            onCancel={() => setCurrentTab('inventory')}
          />
        )}

        {currentTab === 'exit' && (
          <ExitDonationScreen
            items={items}
            onConfirmExit={handleConfirmExit}
            onCancel={() => setCurrentTab('inventory')}
          />
        )}

        {currentTab === 'profile' && <ProfileScreen />}
      </View>

      <BottomNavigation
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <InventoryProvider>
        <MainNavigator />
      </InventoryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
