import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../config/colors';
import { textStyles } from '../../../config/typography';
import { AuthStackScreenProps } from '../../../types/navigation';

type Props = AuthStackScreenProps<'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to onboarding or main app based on auth state
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <View style={styles.content}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🛒</Text>
          <Text style={styles.appName}>United Karts</Text>
          <Text style={styles.tagline}>Food Delivery Made Easy</Text>
        </View>
        
        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    ...textStyles.h1,
    color: colors.textWhite,
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    ...textStyles.body,
    color: colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 50,
  },
  loadingText: {
    ...textStyles.caption,
    color: colors.textWhite,
    opacity: 0.8,
  },
  footer: {
    paddingBottom: 30,
  },
  footerText: {
    ...textStyles.small,
    color: colors.textWhite,
    opacity: 0.7,
  },
});

export default SplashScreen;
