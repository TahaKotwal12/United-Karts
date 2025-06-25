import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FlatList } from 'react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Order Your Favorite Food',
    subtitle: 'Discover restaurants and cuisines you love',
    description: 'Browse through hundreds of restaurants and order your favorite meals with just a few taps.',
    image: '🍕',
    color: '#5e60ce',
  },
  {
    id: '2',
    title: 'Fast & Reliable Delivery',
    subtitle: 'Get your food delivered quickly',
    description: 'Our delivery partners ensure your food reaches you hot and fresh, right at your doorstep.',
    image: '🚗',
    color: '#51cf66',
  },
  {
    id: '3',
    title: 'Track Your Order',
    subtitle: 'Real-time order tracking',
    description: 'Stay updated with live tracking from restaurant to your location. Know exactly when your food will arrive.',
    image: '📍',
    color: '#ffd43b',
  },
  {
    id: '4',
    title: 'Multiple User Roles',
    subtitle: 'Join as customer, restaurant, or delivery partner',
    description: 'Whether you want to order food, run a restaurant, or earn by delivering - we have got you covered.',
    image: '👥',
    color: '#ff6b6b',
  },
];

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      router.replace('/role-selection' as any);
    }
  };

  const handleSkip = () => {
    router.replace('/role-selection' as any);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const renderOnboardingItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.imageContainer, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.emoji}>{item.image}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.subtitle, { color: item.color }]}>{item.subtitle}</Text>
        <Text style={[styles.description, { color: colors.icon }]}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentIndex ? colors.primary : colors.border,
              width: index === currentIndex ? 24 : 8,
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.icon }]}>Skip</Text>
        </TouchableOpacity>
        
        <View style={styles.brandContainer}>
          <Text style={[styles.brandName, { color: colors.primary }]}>UnitedKarts</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Onboarding Content */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderOnboardingItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEnabled={false} // Disable manual scrolling, use buttons only
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={[
            styles.navButton,
            styles.previousButton,
            {
              backgroundColor: currentIndex === 0 ? colors.secondary : colors.border,
              opacity: currentIndex === 0 ? 0.5 : 1,
            }
          ]}
          disabled={currentIndex === 0}
        >
          <IconSymbol name="chevron.left" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navButton, styles.nextButton, { backgroundColor: colors.primary }]}
        >
          {currentIndex === onboardingData.length - 1 ? (
            <Text style={styles.getStartedText}>Get Started</Text>
          ) : (
            <IconSymbol name="chevron.right" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.icon }]}>
          Welcome to the future of food delivery
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  brandContainer: {
    flex: 1,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 80,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousButton: {
    // Additional styles for previous button if needed
  },
  nextButton: {
    // Additional styles for next button if needed
  },
  getStartedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
