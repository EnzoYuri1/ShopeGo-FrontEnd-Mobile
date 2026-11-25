import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { BackButton, BrandLogo, Button, SelectField } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { usePlaceOrder } from '@/features/checkout/hooks/usePlaceOrder';
import {
  cardFormSchema,
  type CardFormInput,
  type CardType,
} from '@/features/checkout/types/payment';
import { formatPrice } from '@/utils/formatPrice';

const logos = {
  visa: require('../../../../assets/images/payments/visa.webp'),
  mastercard: require('../../../../assets/images/payments/mastercard.webp'),
};

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => String(THIS_YEAR + i));

type Errors = Partial<Record<'cardType' | 'cardNumber' | 'expiry' | 'cvn', string>>;

function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function PaymentDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { placeOrder, isPlacing, total, hasItems } = usePlaceOrder();

  const [cardType, setCardType] = useState<CardType | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvn, setCvn] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | undefined>();

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/cart');
  }

  function handleConfirm() {
    const form: CardFormInput = {
      cardType: cardType ?? ('' as CardType),
      cardNumber,
      expMonth,
      expYear,
      cvn,
    };
    const parsed = cardFormSchema.safeParse(form);

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === 'cardType') next.cardType ??= strings.checkout.invalidCardType;
        if (field === 'cardNumber') next.cardNumber ??= issue.message;
        if (field === 'expMonth' || field === 'expYear') next.expiry ??= issue.message;
        if (field === 'cvn') next.cvn ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setFormError(undefined);
    // Só o tipo do cartão vai no pedido; número e CVV ficam apenas nesta tela.
    placeOrder(
      `card:${parsed.data.cardType}`,
      () => router.replace('/checkout/success'),
      () => setFormError(strings.checkout.orderFailed),
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <BackButton onPress={handleBack} />
        <BrandLogo style={{ top: insets.top - 2 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{strings.checkout.detailsTitle}</Text>
            <Svg width={24} height={26} viewBox="0 0 24 26" fill="none">
              <Path
                d="M12 2l8 3v7c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"
                stroke={colors.black}
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
              <Path
                d="M8.5 12.5l2.5 2.5 4.5-5"
                stroke={colors.black}
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <Text style={styles.label}>{strings.checkout.cardType}</Text>
          <View style={styles.radios}>
            <Radio
              selected={cardType === 'visa'}
              onPress={() => setCardType('visa')}
              source={logos.visa}
              label={strings.checkout.visa}
            />
            <Radio
              selected={cardType === 'mastercard'}
              onPress={() => setCardType('mastercard')}
              source={logos.mastercard}
              label={strings.checkout.mastercard}
            />
          </View>
          {errors.cardType ? <Text style={styles.error}>{errors.cardType}</Text> : null}

          <Text style={styles.label}>{strings.checkout.cardNumber}</Text>
          <TextInput
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            placeholder={strings.checkout.cardNumberPlaceholder}
            placeholderTextColor="rgba(0,0,0,0.4)"
            keyboardType="number-pad"
            autoComplete="cc-number"
            maxLength={19}
            style={[styles.input, errors.cardNumber ? styles.inputError : null]}
          />
          {errors.cardNumber ? <Text style={styles.error}>{errors.cardNumber}</Text> : null}

          <View style={styles.pair}>
            <View style={styles.pairCol}>
              <Text style={styles.label}>{strings.checkout.expMonth}</Text>
              <SelectField
                value={expMonth}
                placeholder={strings.checkout.month}
                options={MONTHS}
                onChange={setExpMonth}
                error={Boolean(errors.expiry)}
              />
            </View>
            <View style={styles.pairCol}>
              <Text style={styles.label}>{strings.checkout.expYear}</Text>
              <SelectField
                value={expYear}
                placeholder={strings.checkout.year}
                options={YEARS}
                onChange={setExpYear}
                error={Boolean(errors.expiry)}
              />
            </View>
          </View>
          {errors.expiry ? <Text style={styles.error}>{errors.expiry}</Text> : null}

          <Text style={styles.label}>{strings.checkout.cvn}</Text>
          <Text style={styles.hint}>{strings.checkout.cvnHint}</Text>
          <TextInput
            value={cvn}
            onChangeText={(text) => setCvn(text.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            secureTextEntry
            autoComplete="cc-csc"
            maxLength={4}
            style={[styles.input, styles.cvnInput, errors.cvn ? styles.inputError : null]}
          />
          {errors.cvn ? <Text style={styles.error}>{errors.cvn}</Text> : null}

          <Text style={[styles.label, styles.orderLabel]}>{strings.checkout.yourOrder}</Text>
          <View style={styles.divider} />
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>{strings.checkout.totalAmount}</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <View style={styles.actions}>
          <Button
            title={strings.checkout.cancel}
            variant="outline"
            onPress={handleBack}
            style={styles.cancel}
          />
          <Button
            title={strings.checkout.confirm}
            onPress={handleConfirm}
            loading={isPlacing}
            disabled={!hasItems}
            style={styles.confirm}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface RadioProps {
  selected: boolean;
  onPress: () => void;
  source: number;
  label: string;
}

function Radio({ selected, onPress, source, label }: RadioProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={styles.radio}
    >
      <View style={[styles.radioDot, selected ? styles.radioDotOn : null]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <View style={styles.logoBox}>
        <Image source={source} contentFit="contain" style={styles.logo} />
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 90,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 0,
  },
  card: {
    marginHorizontal: 0,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: '#FFF1EA',
    borderWidth: 1,
    borderColor: '#4A3A33',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  },
  title: {
    fontFamily: fontFamily.interBold,
    fontSize: 22,
    color: colors.black,
  },
  label: {
    marginTop: 18,
    marginBottom: 6,
    fontFamily: fontFamily.interSemibold,
    fontSize: 12,
    color: colors.black,
  },
  hint: {
    marginBottom: 6,
    fontFamily: fontFamily.regular,
    fontSize: 10,
    color: 'rgba(0,0,0,0.65)',
  },
  radios: {
    flexDirection: 'row',
    gap: 22,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotOn: {
    borderColor: colors.black,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.black,
  },
  logoBox: {
    width: 56,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 44,
    height: 24,
  },
  radioLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.black,
  },
  input: {
    height: 36,
    borderRadius: 6,
    backgroundColor: '#C9C9C9',
    paddingHorizontal: 12,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.black,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cvnInput: {
    width: 86,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: 4,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.danger,
  },
  pair: {
    flexDirection: 'row',
    gap: 16,
  },
  pairCol: {
    flex: 1,
  },
  orderLabel: {
    marginTop: 26,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginBottom: 12,
  },
  totalBox: {
    height: 54,
    borderRadius: 6,
    backgroundColor: '#F2B9B9',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontFamily: fontFamily.interSemibold,
    fontSize: 13,
    color: colors.black,
  },
  totalValue: {
    fontFamily: fontFamily.interBold,
    fontSize: 18,
    color: colors.black,
  },
  formError: {
    marginTop: 14,
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.danger,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 18,
    marginTop: 24,
  },
  cancel: {
    flex: 1,
    width: undefined,
    borderWidth: 1,
    borderColor: colors.black,
  },
  confirm: {
    flex: 1,
    width: undefined,
    backgroundColor: '#FF6F61',
    shadowOpacity: 0,
    elevation: 0,
  },
});
