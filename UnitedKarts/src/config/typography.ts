export const typography = {
  fonts: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Text style presets
export const textStyles = {
  h1: {
    fontSize: typography.sizes['4xl'],
    fontFamily: typography.fonts.bold,
    lineHeight: typography.lineHeights.tight,
  },
  h2: {
    fontSize: typography.sizes['3xl'],
    fontFamily: typography.fonts.bold,
    lineHeight: typography.lineHeights.tight,
  },
  h3: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.semibold,
    lineHeight: typography.lineHeights.normal,
  },
  h4: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.semibold,
    lineHeight: typography.lineHeights.normal,
  },
  h5: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.medium,
    lineHeight: typography.lineHeights.normal,
  },
  body: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    lineHeight: typography.lineHeights.normal,
  },
  bodyMedium: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.medium,
    lineHeight: typography.lineHeights.normal,
  },
  caption: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    lineHeight: typography.lineHeights.normal,
  },
  small: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    lineHeight: typography.lineHeights.normal,
  },
  button: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semibold,
    lineHeight: typography.lineHeights.tight,
  },
};
