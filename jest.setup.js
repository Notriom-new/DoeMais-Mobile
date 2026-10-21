// Configurações globais de setup do Jest para React Native
import '@testing-library/jest-native/extend-expect';
import React from 'react';

// Mock de react-native-safe-area-context para renderizar children normalmente nos testes
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaConsumer: ({ children }: any) => children(insets),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock de @expo/vector-icons para testes unitários limpos e sem dependência de fontes nativas
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: (props: any) => <View testID={`icon-${props.name}`} {...props} />,
    MaterialIcons: (props: any) => <View testID={`icon-${props.name}`} {...props} />,
    Feather: (props: any) => <View testID={`icon-${props.name}`} {...props} />,
    Ionicons: (props: any) => <View testID={`icon-${props.name}`} {...props} />,
  };
});

// Silenciar warnings desnecessários durante os testes
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: An update to Animated') ||
     args[0].includes('useNativeDriver'))
  ) {
    return;
  }
  originalError(...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('useNativeDriver') || args[0].includes('Animated: `useNativeDriver`'))
  ) {
    return;
  }
  originalWarn(...args);
};
