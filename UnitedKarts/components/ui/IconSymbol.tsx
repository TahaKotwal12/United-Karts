// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'house': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'magnifyingglass': 'search',
  'list.bullet': 'list',
  'list.bullet.clipboard.fill': 'assignment',
  'list.bullet.clipboard': 'assignment',
  'cart.fill': 'shopping-cart',
  'cart': 'shopping-cart',
  'person.fill': 'person',
  'person': 'person',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'star.fill': 'star',
  'star': 'star-border',
  'clock': 'access-time',
  'location.fill': 'location-on',
  'location': 'location-on',
  'plus': 'add',
  'minus': 'remove',
  'trash': 'delete',
  'pencil': 'edit',
  'bell.fill': 'notifications',
  'bell': 'notifications-none',
  'creditcard.fill': 'credit-card',
  'creditcard': 'credit-card',
  'questionmark.circle.fill': 'help',
  'questionmark.circle': 'help-outline',
  'info.circle.fill': 'info',
  'chevron.down': 'keyboard-arrow-down',
  'chevron.up': 'keyboard-arrow-up',
  'xmark.circle.fill': 'cancel',
  'xmark': 'close',
  'checkmark.circle.fill': 'check-circle',
  'checkmark': 'check',
  'car': 'directions-car',
  'line.horizontal.3.decrease': 'filter-list',
  'chevron.left': 'chevron-left',
  'lock': 'lock',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'phone': 'phone',
  'envelope': 'email',
  'bag.fill': 'shopping-bag',
  'bag': 'shopping-bag',
  'dollarsign.circle.fill': 'monetization-on',
  'dollarsign.circle': 'monetization-on',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'chart.bar.fill': 'bar-chart',
  'chart.bar': 'bar-chart',
  'person.2.fill': 'group',
  'person.2': 'group',
  'truck.box': 'local-shipping',
  'square.and.arrow.up': 'share',
  'arrow.up': 'keyboard-arrow-up',
  'arrow.down': 'keyboard-arrow-down',
  'arrow.up.circle.fill': 'keyboard-arrow-up',
  'arrow.right.square': 'exit-to-app',
  'doc.text': 'description',
  'tag': 'local-offer',
  'menucard': 'restaurant-menu',
  'menucard.fill': 'restaurant-menu',
  'clock.fill': 'schedule',
  'indianrupee.circle.fill': 'currency-rupee',
  'indianrupee.circle': 'currency-rupee',
  'qrcode': 'qr-code',
  'creditcard.and.123': 'payment',
  'building.2.fill': 'business',
  'building.2': 'business',
  'chart.pie.fill': 'pie-chart',
  'chart.pie': 'pie-chart',
  'calendar': 'event',
  'calendar.fill': 'event',
  'gear': 'settings',
  'gear.fill': 'settings',
  'arrow.clockwise': 'refresh',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name] as any} style={style} />;
}
