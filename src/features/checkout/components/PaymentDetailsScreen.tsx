import { Image, type ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Button,
  ErrorBanner,
  Icon,
  Input,
  ScreenTopBar,
  SelectField,
} from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { CheckoutSteps } from '@/features/checkout/components/CheckoutSteps';
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

/**
 * Dados do cartão. Os campos são validados com zod e NUNCA são salvos:
 * o pedido guarda só a bandeira (ex.: "card:visa").
 */
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
      <ScreenTopBar onBack={handleBack} title={strings.checkout.paymentTitle} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CheckoutSteps step={1} />

        <View style={styles.group}>
          <AppText variant="label" color="textSecondary">
            {strings.checkout.cardTypeLabel}
          </AppText>
          <View style={styles.brands} accessibilityRole="radiogroup">
            <BrandOption
              selected={cardType === 'visa'}
              label={strings.checkout.visa}
              source={logos.visa}
              onPress={() => setCardType('visa')}
            />
            <BrandOption
              selected={cardType === 'mastercard'}
              label={strings.checkout.mastercard}
              source={logos.mastercard}
              onPress={() => setCardType('mastercard')}
            />
          </View>
          {errors.cardType ? (
            <AppText variant="caption" color="danger">
              {errors.cardType}
            </AppText>
          ) : null}
        </View>

        <Input
          label={strings.checkout.cardNumberLabel}
          value={cardNumber}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          placeholder={strings.checkout.cardNumberPlaceholder}
          keyboardType="number-pad"
          autoComplete="cc-number"
          maxLength={19}
          error={errors.cardNumber}
        />

        <View style={styles.group}>
          <AppText variant="label" color="textSecondary">
            {strings.checkout.expiryLabel}
          </AppText>
          <View style={styles.pair}>
            <SelectField
              value={expMonth}
              placeholder={strings.checkout.month}
              options={MONTHS}
              onChange={setExpMonth}
              error={Boolean(errors.expiry)}
              accessibilityLabel={strings.checkout.expMonth}
            />
            <SelectField
              value={expYear}
              placeholder={strings.checkout.year}
              options={YEARS}
              onChange={setExpYear}
              error={Boolean(errors.expiry)}
              accessibilityLabel={strings.checkout.expYear}
            />
          </View>
          {errors.expiry ? (
            <AppText variant="caption" color="danger">
              {errors.expiry}
            </AppText>
          ) : null}
        </View>

        <View style={styles.group}>
          <Input
            label={strings.checkout.cvnLabel}
            value={cvn}
            onChangeText={(text) => setCvn(text.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            secureTextEntry
            autoComplete="cc-csc"
            maxLength={4}
            error={errors.cvn}
            style={styles.cvn}
          />
          <AppText variant="caption" color="textSecondary">
            {strings.checkout.cvnHint}
          </AppText>
        </View>

        <View style={styles.note}>
          <Icon name="alert" size={18} color="textSecondary" />
          <AppText variant="caption" color="textSecondary" style={styles.noteText}>
            {strings.checkout.secureNote}
          </AppText>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.totalRow}>
          <AppText variant="body" color="textSecondary">
            {strings.checkout.totalAmount}
          </AppText>
          <AppText variant="priceLarge">{formatPrice(total)}</AppText>
        </View>
        {formError ? <ErrorBanner message={formError} onRetry={handleConfirm} /> : null}
        <View style={styles.actions}>
          <Button
            title={strings.checkout.cancel}
            variant="outline"
            fullWidth={false}
            onPress={handleBack}
            style={styles.action}
          />
          <Button
            title={strings.checkout.confirm}
            fullWidth={false}
            onPress={handleConfirm}
            loading={isPlacing}
            disabled={!hasItems}
            style={styles.action}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

interface BrandOptionProps {
  selected: boolean;
  label: string;
  source: ImageSource;
  onPress: () => void;
}

function BrandOption({ selected, label, source, onPress }: BrandOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={[styles.brand, selected ? styles.brandOn : null]}
    >
      <Image source={source} contentFit="contain" style={styles.brandLogo} />
      <AppText variant={selected ? 'bodyStrong' : 'body'}>{label}</AppText>
      {selected ? <Icon name="check" size={18} color="brand" strokeWidth={2.5} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, gap: spacing.lg },
  group: { gap: spacing.xs + 2 },
  brands: { flexDirection: 'row', gap: spacing.sm },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.ms,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  brandOn: { borderColor: colors.brand, backgroundColor: colors.surfaceBrand },
  brandLogo: { width: 34, height: 20 },
  pair: { flexDirection: 'row', gap: spacing.sm },
  cvn: { maxWidth: 160 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.ms,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  noteText: { flex: 1 },
  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.ms,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  actions: { flexDirection: 'row', gap: spacing.ms },
  action: { flex: 1 },
});
