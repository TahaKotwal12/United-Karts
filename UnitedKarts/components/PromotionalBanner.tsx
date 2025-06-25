import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width: screenWidth } = Dimensions.get('window');

interface PromotionalOffer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  backgroundColor: string[];
  textColor: string;
  buttonText: string;
  validUntil: string;
}

const PROMOTIONAL_OFFERS: PromotionalOffer[] = [
  {
    id: '1',
    title: 'Free Delivery',
    subtitle: 'On orders above $25',
    discount: 'FREE',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    backgroundColor: ['#FF6B6B', '#FF8E8E'],
    textColor: 'white',
    buttonText: 'Order Now',
    validUntil: '2024-02-15',
  },
  {
    id: '2',
    title: '50% OFF',
    subtitle: 'First order discount',
    discount: '50%',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    backgroundColor: ['#4ECDC4', '#44A08D'],
    textColor: 'white',
    buttonText: 'Claim Offer',
    validUntil: '2024-02-20',
  },
  {
    id: '3',
    title: 'Buy 1 Get 1',
    subtitle: 'On selected pizzas',
    discount: 'BOGO',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    backgroundColor: ['#45B7D1', '#96CEB4'],
    textColor: 'white',
    buttonText: 'View Menu',
    validUntil: '2024-02-18',
  },
];

interface PromotionalBannerProps {
  onOfferPress: (offer: PromotionalOffer) => void;
}

export function PromotionalBanner({ onOfferPress }: PromotionalBannerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderBannerItem = ({ item }: { item: PromotionalOffer }) => (
    <TouchableOpacity
      style={styles.bannerContainer}
      onPress={() => onOfferPress(item)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={item.backgroundColor as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerGradient}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerLeft}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>
            <Text style={[styles.bannerTitle, { color: item.textColor }]}>
              {item.title}
            </Text>
            <Text style={[styles.bannerSubtitle, { color: item.textColor }]}>
              {item.subtitle}
            </Text>
            <TouchableOpacity
              style={[styles.bannerButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={() => onOfferPress(item)}
            >
              <Text style={[styles.bannerButtonText, { color: item.textColor }]}>
                {item.buttonText}
              </Text>
              <IconSymbol name="arrow.right" size={14} color={item.textColor} />
            </TouchableOpacity>
          </View>
          <View style={styles.bannerRight}>
            <Image source={{ uri: item.image }} style={styles.bannerImage} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={PROMOTIONAL_OFFERS}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={screenWidth - 40}
        decelerationRate="fast"
        contentContainerStyle={styles.bannerList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  bannerList: {
    paddingHorizontal: 20,
  },
  bannerContainer: {
    width: screenWidth - 40,
    height: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerGradient: {
    flex: 1,
    padding: 20,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  discountBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  bannerRight: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
