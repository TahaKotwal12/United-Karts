// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'magnifyingglass': 'search',
  'list.bullet': 'list',
  'cart.fill': 'shopping-cart',
  'cart': 'shopping-cart',
  'person.fill': 'person',
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
  'creditcard.fill': 'credit-card',
  'questionmark.circle.fill': 'help',
  'info.circle.fill': 'info',
  'chevron.down': 'keyboard-arrow-down',
  'xmark.circle.fill': 'cancel',
  'checkmark.circle.fill': 'check-circle',
  'car': 'directions-car',
  'line.horizontal.3.decrease': 'filter-list',
  'chevron.left': 'chevron-left',
  'lock': 'lock',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'phone': 'phone',
} as IconMapping;

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
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
