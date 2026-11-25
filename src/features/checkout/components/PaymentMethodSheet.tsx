import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import type { PaymentMethod } from '@/features/checkout/types/payment';

const logos = {
  visa: require('../../../../assets/images/payments/visa.webp'),
  mastercard: require('../../../../assets/images/payments/mastercard.webp'),
  other: require('../../../../assets/images/payments/other.webp'),
};

interface PaymentMethodSheetProps {
  onClose: () => void;
  onProceed: (method: PaymentMethod) => void;
}

/** Sheet "Select your payment method" (frame 25:122): aparece sobre o carrinho. */
export function PaymentMethodSheet({ onClose, onProceed }: PaymentMethodSheetProps) {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState<PaymentMethod>('card');

  return (
    <View style={styles.overlay}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel={strings.common.cancel}
      />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Text style={styles.title}>{strings.checkout.selectMethod}</Text>

        <Option
          selected={method === 'card'}
          accent="#FF9797"
          checkColor="#E53E3E"
          label={strings.checkout.methodCard}
          onPress={() => setMethod('card')}
        >
          <View style={styles.logos}>
            <Image source={logos.visa} contentFit="contain" style={styles.visa} />
            <Image source={logos.mastercard} contentFit="contain" style={styles.mastercard} />
          </View>
        </Option>

        <Option
          selected={method === 'other'}
          accent="#1B1B1B"
          checkColor={colors.black}
          label={strings.checkout.methodOther}
          onPress={() => setMethod('other')}
        >
          <Image source={logos.other} contentFit="contain" style={styles.other} />
        </Option>

        <Button
          title={strings.checkout.proceed}
          onPress={() => onProceed(method)}
          style={styles.proceed}
        />
      </View>
    </View>
  );
}

interface OptionProps {
  selected: boolean;
  accent: string;
  checkColor: string;
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}

function Option({ selected, accent, checkColor, label, onPress, children }: OptionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.option, { borderColor: selected ? accent : '#B2B2B2' }]}
    >
      <View style={styles.optionBody}>
        <Text style={styles.optionLabel}>{label}</Text>
        {children}
      </View>
      <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        {selected ? (
          <>
            <Circle cx={14} cy={14} r={13} fill={checkColor} />
            <Path
              d="M8 14.5l4 4 8-9"
              stroke={colors.white}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <Circle cx={14} cy={14} r={12.5} stroke="#B2B2B2" strokeWidth={1.5} />
        )}
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: '#1B1B1B',
    paddingHorizontal: 22,
    paddingTop: 34,
    gap: 12,
  },
  title: {
    fontFamily: fontFamily.interSemibold,
    fontSize: 14,
    color: colors.black,
    marginBottom: 18,
  },
  option: {
    height: 62,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionBody: {
    gap: 2,
  },
  optionLabel: {
    fontFamily: fontFamily.interSemibold,
    fontSize: 12,
    color: colors.black,
  },
  logos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  visa: {
    width: 50,
    height: 26,
  },
  mastercard: {
    width: 28,
    height: 26,
  },
  other: {
    width: 24,
    height: 24,
  },
  proceed: {
    marginTop: 20,
    backgroundColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
});
