import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function RestaurantDashboardScreen() {
  useEffect(() => {
    // Redirect to the new restaurant tab system
    // router.replace('/restaurant/(tabs)'); // We will display the dashboard here for now
  }, []);

  // Dummy Data
  const dummyDailyRevenue = '₹ 15,250';
  const dummyTotalOrdersToday = 45;
  const dummyPopularItems = ['Chicken Biryani', 'Paneer Butter Masala', 'Gulab Jamun'];
  const dummyRecentReviews = [
    { id: '1', customer: 'Rahul Sharma', rating: 4, comment: 'Food was great, timely delivery!' },
    { id: '2', customer: 'Priya Singh', rating: 5, comment: 'Excellent service and delicious food.' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>Restaurant Dashboard</ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Today's Summary</ThemedText>
          <Text>Daily Revenue: {dummyDailyRevenue}</Text>
          <Text>Total Orders Today: {dummyTotalOrdersToday}</Text>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Popular Items (Today)</ThemedText>
          {dummyPopularItems.map((item, index) => (
            <Text key={index}>- {item}</Text>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recent Reviews</ThemedText>
          {dummyRecentReviews.map((review) => (
            <View key={review.id} style={styles.review}>
              <Text>Customer: {review.customer} (Rating: {review.rating}/5)</Text>
              <Text>Comment: {review.comment}</Text>
            </View>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0', // Use a light background for sections
  },
  review: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
