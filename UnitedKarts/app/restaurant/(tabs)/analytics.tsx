import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width: screenWidth } = Dimensions.get('window');

interface AnalyticsData {
  period: 'today' | 'week' | 'month' | 'year';
  revenue: number;
  orders: number;
  avgOrderValue: number;
  customers: number;
  rating: number;
  totalRatings: number;
  topItems: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  hourlyData: Array<{
    hour: string;
    orders: number;
    revenue: number;
  }>;
  weeklyData: Array<{
    day: string;
    orders: number;
    revenue: number;
  }>;
}

export default function RestaurantAnalyticsScreen() {  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');

  const analyticsData: Record<string, AnalyticsData> = {
    today: {
      period: 'today', 
      revenue: 36412.50, // Using INR conversion factor ~75 for demonstration
      orders: 24,
      avgOrderValue: 1517.25, // Using INR conversion factor ~75 for demonstration 
      customers: 22,
      rating: 4.6,
      totalRatings: 18,
      topItems: [
        { name: 'Margherita Pizza', orders: 8, revenue: 9594.00 }, // ₹127.92 * 75
        { name: 'Chicken Tikka Pizza', orders: 6, revenue: 8545.50 }, // ₹113.94 * 75
        { name: 'Garlic Naan', orders: 12, revenue: 6291.00 }, // ₹83.88 * 75
        { name: 'Masala Chai', orders: 15, revenue: 3363.75 }, // ₹44.85 * 75
      ],
      hourlyData: [
        { hour: '9AM', orders: 2, revenue: 2662.50 },
        { hour: '10AM', orders: 1, revenue: 1424.25 },
        { hour: '11AM', orders: 3, revenue: 5058.75 },
        { hour: '12PM', orders: 5, revenue: 7406.25 },
        { hour: '1PM', orders: 4, revenue: 6690.00 },
        { hour: '2PM', orders: 3, revenue: 4222.50 },
        { hour: '3PM', orders: 2, revenue: 3135.00 },
        { hour: '4PM', orders: 4, revenue: 5813.25 },
      ],
      weeklyData: [],
    },
    week: {
      period: 'week',
      revenue: 243435.00, // ₹3245.80 * 75
      orders: 156,
      avgOrderValue: 1560.75, // ₹20.81 * 75
      customers: 142,
      rating: 4.5,
      totalRatings: 89,
      topItems: [
        { name: 'Margherita Pizza', orders: 45, revenue: 53966.25 }, // ₹719.55 * 75
        { name: 'Chicken Tikka Pizza', orders: 38, revenue: 54121.50 }, // ₹721.62 * 75
        { name: 'Garlic Naan', orders: 67, revenue: 35124.75 }, // ₹468.33 * 75
        { name: 'Paneer Butter Masala', orders: 28, revenue: 35679.00 }, // ₹475.72 * 75
      ],
      hourlyData: [],
      weeklyData: [
        { day: 'Mon', orders: 18, revenue: 29208.75 }, // ₹389.45 * 75
        { day: 'Tue', orders: 22, revenue: 35085.00 }, // ₹467.80 * 75
        { day: 'Wed', orders: 25, revenue: 39281.25 }, // ₹523.75 * 75
        { day: 'Thu', orders: 28, revenue: 44865.00 }, // ₹598.20 * 75
        { day: 'Fri', orders: 32, revenue: 51720.00 }, // ₹689.60 * 75
        { day: 'Sat', orders: 19, revenue: 29887.50 },
        { day: 'Sun', orders: 12, revenue: 13387.50 },
      ],
    },
    month: {
      period: 'month',
      revenue: 1092540.00,
      orders: 687,
      avgOrderValue: 1590.75, // ₹21.21 * 75
      customers: 523,
      rating: 4.4,
      totalRatings: 342,
      topItems: [
        { name: 'Margherita Pizza', orders: 198, revenue: 237601.50 }, // ₹3168.02 * 75
        { name: 'Chicken Tikka Pizza', orders: 167, revenue: 237849.75 },
        { name: 'Garlic Naan', orders: 289, revenue: 151508.25 },
        { name: 'Paneer Butter Masala', orders: 134, revenue: 170749.50 },
      ],
      hourlyData: [],
      weeklyData: [],
    },
    year: {
      period: 'year',
      revenue: 12591783.75, // ₹167890.45 * 75
      orders: 7834, 
      avgOrderValue: 1607.25, // ₹21.43 * 75
      customers: 4567,
      rating: 4.3,
      totalRatings: 2890,
      topItems: [
        { name: 'Margherita Pizza', orders: 2145, revenue: 2573366.25 },
        { name: 'Chicken Tikka Pizza', orders: 1876, revenue: 2671218.00 },
        { name: 'Garlic Naan', orders: 3234, revenue: 1695424.50 },
        { name: 'Paneer Butter Masala', orders: 1567, revenue: 1997874.75 },
      ],
      hourlyData: [],
      weeklyData: [],
    },
  };

  const currentData = analyticsData[selectedPeriod];

  const periods = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const SimpleChart = ({ data, type }: { data: any[], type: 'hourly' | 'weekly' }) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map(item => item.orders));
    const chartWidth = screenWidth - 80;
    const barWidth = chartWidth / data.length - 8;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {data.map((item, index) => {
            const height = (item.orders / maxValue) * 120;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: height || 2,
                        width: barWidth,
                        backgroundColor: colors.primary,
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: colors.icon }]}>
                  {type === 'hourly' ? item.hour : item.day}
                </Text>
                <Text style={[styles.barValue, { color: colors.text }]}>
                  {item.orders}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
        <TouchableOpacity>
          <IconSymbol name="square.and.arrow.up" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Time Period</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodContainer}>
          {periods.map((period) => {
            const isSelected = selectedPeriod === period.key;
            const getPeriodIcon = (key: string) => {
              switch (key) {
                case 'today': return 'clock';
                case 'week': return 'calendar';
                case 'month': return 'calendar.fill';
                case 'year': return 'chart.bar';
                default: return 'clock';
              }
            };
            
            return (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setSelectedPeriod(period.key as any)}
              >
                <IconSymbol 
                  name={getPeriodIcon(period.key) as any} 
                  size={16} 
                  color={isSelected ? 'white' : colors.icon} 
                />
                <Text
                  style={[
                    styles.periodChipText,
                    { color: isSelected ? 'white' : colors.text }
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.success + '20' }]}>
                <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.success} />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {formatCurrency(currentData.revenue)}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.icon }]}>Revenue</Text>
              <View style={styles.metricChange}>
                <IconSymbol name="arrow.up" size={12} color={colors.success} />
                <Text style={[styles.changeText, { color: colors.success }]}>+12.5%</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="bag.fill" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {currentData.orders.toLocaleString()}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.icon }]}>Orders</Text>
              <View style={styles.metricChange}>
                <IconSymbol name="arrow.up" size={12} color={colors.success} />
                <Text style={[styles.changeText, { color: colors.success }]}>+8.3%</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.warning + '20' }]}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.warning} />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {formatCurrency(currentData.avgOrderValue)}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.icon }]}>Avg Order</Text>
              <View style={styles.metricChange}>
                <IconSymbol name="arrow.up" size={12} color={colors.success} />
                <Text style={[styles.changeText, { color: colors.success }]}>+3.7%</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol name="person.2.fill" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {currentData.customers.toLocaleString()}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.icon }]}>Customers</Text>
              <View style={styles.metricChange}>
                <IconSymbol name="arrow.up" size={12} color={colors.success} />
                <Text style={[styles.changeText, { color: colors.success }]}>+15.2%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Orders Chart */}
        {(currentData.hourlyData.length > 0 || currentData.weeklyData.length > 0) && (
          <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Orders {selectedPeriod === 'today' ? 'by Hour' : 'by Day'}
            </Text>
            <SimpleChart 
              data={selectedPeriod === 'today' ? currentData.hourlyData : currentData.weeklyData} 
              type={selectedPeriod === 'today' ? 'hourly' : 'weekly'} 
            />
          </View>
        )}

        {/* Top Performing Items */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Performing Items</Text>
          
          {currentData.topItems.map((item, index) => (
            <View key={index} style={styles.topItemRow}>
              <View style={styles.topItemInfo}>
                <View style={[styles.rankBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.itemStats, { color: colors.icon }]}>
                    {item.orders} orders
                  </Text>
                </View>
              </View>
              <Text style={[styles.itemRevenue, { color: colors.primary }]}>
                {formatCurrency(item.revenue)}
              </Text>
            </View>
          ))}
        </View>

        {/* Customer Satisfaction */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Satisfaction</Text>
          
          <View style={styles.satisfactionContainer}>
            <View style={styles.ratingDisplay}>
              <Text style={[styles.ratingValue, { color: colors.text }]}>
                {currentData.rating.toFixed(1)}
              </Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconSymbol
                    key={star}
                    name={star <= Math.floor(currentData.rating) ? "star.fill" : "star"}
                    size={16}
                    color={colors.warning}
                  />
                ))}
              </View>
              <Text style={[styles.ratingCount, { color: colors.icon }]}>
                Based on {currentData.totalRatings} reviews
              </Text>
            </View>

            <View style={styles.ratingBreakdown}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = Math.random() * 100; // Mock data
                return (
                  <View key={rating} style={styles.ratingRow}>
                    <Text style={[styles.ratingLabel, { color: colors.text }]}>{rating}</Text>
                    <IconSymbol name="star.fill" size={12} color={colors.warning} />
                    <View style={[styles.ratingBar, { backgroundColor: colors.secondary }]}>
                      <View
                        style={[
                          styles.ratingFill,
                          {
                            width: `${percentage}%`,
                            backgroundColor: colors.warning,
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.ratingPercentage, { color: colors.icon }]}>
                      {percentage.toFixed(0)}%
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Performance Insights */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Insights</Text>
          
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: colors.success + '20' }]}>
                <IconSymbol name="arrow.up.circle.fill" size={20} color={colors.success} />
              </View>
              <View style={styles.insightContent}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>
                  Revenue Growth
                </Text>
                <Text style={[styles.insightDescription, { color: colors.icon }]}>
                  Your revenue increased by 12.5% compared to last {selectedPeriod}
                </Text>
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="clock.fill" size={20} color={colors.primary} />
              </View>
              <View style={styles.insightContent}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>
                  Peak Hours
                </Text>
                <Text style={[styles.insightDescription, { color: colors.icon }]}>
                  Most orders come between 12PM-2PM and 7PM-9PM
                </Text>
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: colors.warning + '20' }]}>
                <IconSymbol name="star.fill" size={20} color={colors.warning} />
              </View>
              <View style={styles.insightContent}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>
                  Customer Satisfaction
                </Text>
                <Text style={[styles.insightDescription, { color: colors.icon }]}>
                  Your rating improved by 0.2 points this {selectedPeriod}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  periodContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  periodTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  chartContainer: {
    marginTop: 8,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    borderRadius: 2,
  },
  barLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  topItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemStats: {
    fontSize: 12,
  },
  itemRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  satisfactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingDisplay: {
    alignItems: 'center',
    flex: 1,
  },
  ratingValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingCount: {
    fontSize: 12,
    textAlign: 'center',
  },
  ratingBreakdown: {
    flex: 1,
    marginLeft: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    width: 12,
    marginRight: 4,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  ratingFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratingPercentage: {
    fontSize: 10,
    width: 30,
    textAlign: 'right',
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 100,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  periodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  periodChipText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
