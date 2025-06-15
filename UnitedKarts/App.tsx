import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { store } from './src/store';
import { colors } from './src/config/colors';
import AppNavigator from './src/navigation/AppNavigator';

// Import required for React Native setup
import 'react-native-get-random-values';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar 
            barStyle="light-content" 
            backgroundColor={colors.primary} 
            translucent={false}
          />
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
