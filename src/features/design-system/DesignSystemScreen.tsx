import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Badge,
  BrandLogo,
  BrandMark,
  Button,
  Chip,
  EmptyState,
  ErrorState,
  Icon,
  IconButton,
  Input,
  RouteLine,
  Skeleton,
  Snackbar,
  type IconName,
} from '@/components/ui';
import { colors, palette, radius, spacing, textVariants, type TextVariant } from '@/constants';

// catálogo interno do design system "rota" (tela de desenvolvimento, não aparece em produção)
const SWATCHES: { name: string; value: string }[] = [
  { name: 'Laranja Sinal', value: palette.signal },
  { name: 'Azul Noite', value: palette.night },
  { name: 'Céu', value: palette.sky },
  { name: 'Névoa', value: palette.mist },
  { name: 'Ardósia', value: palette.slate },
  { name: 'Linha', value: palette.line },
  { name: 'Entregue', value: palette.delivered },
  { name: 'Alerta', value: palette.alert },
];

const ICON_NAMES: IconName[] = [
  'home',
  'grid',
  'search',
  'bag',
  'user',
  'heart',
  'star',
  'bell',
  'menu',
  'close',
  'chevronLeft',
  'chevronRight',
  'chevronDown',
  'arrowRight',
  'plus',
  'minus',
  'check',
  'filter',
  'trash',
  'tag',
  'percent',
  'truck',
  'package',
  'creditCard',
  'mapPin',
  'camera',
  'alert',
  'logout',
];

const CATEGORY_STOPS = [
  { key: 'beauty', label: 'Beleza' },
  { key: 'fragrances', label: 'Perfumes' },
  { key: 'furniture', label: 'Casa' },
  { key: 'groceries', label: 'Mercado' },
  { key: 'smartphones', label: 'Celulares' },
];

const ORDER_STOPS = [
  { key: 'confirmed', label: 'Pedido confirmado', description: 'Pagamento aprovado' },
  { key: 'preparing', label: 'Em preparação', description: 'O vendedor está separando seu pedido' },
  { key: 'shipping', label: 'Em trânsito', description: 'Seu pedido está a caminho' },
  { key: 'delivered', label: 'Entregue' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="heading">{title}</AppText>
      {children}
    </View>
  );
}

export function DesignSystemScreen() {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState(0);
  const [chip, setChip] = useState('relevancia');
  const [favorite, setFavorite] = useState(false);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      <BrandLogo floating={false} size={36} />
      <AppText variant="body" color="textSecondary">
        Design System Rota. Catálogo interno para revisão.
      </AppText>

      <Section title="Marca">
        <View style={styles.row}>
          <View
            style={[
              styles.markBox,
              { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <BrandMark size={44} />
          </View>
          <View style={[styles.markBox, { backgroundColor: colors.brand }]}>
            <BrandMark size={44} tone="onBrand" />
          </View>
          <View style={[styles.markBox, { backgroundColor: colors.primary }]}>
            <BrandMark size={44} tone="onPrimary" />
          </View>
        </View>
      </Section>

      <Section title="Cores">
        <View style={styles.wrap}>
          {SWATCHES.map((swatch) => (
            <View key={swatch.name} style={styles.swatch}>
              <View style={[styles.swatchColor, { backgroundColor: swatch.value }]} />
              <AppText variant="label">{swatch.name}</AppText>
              <AppText variant="caption" color="textSecondary">
                {swatch.value}
              </AppText>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Tipografia">
        {(Object.keys(textVariants) as TextVariant[]).map((variant) => (
          <View key={variant} style={styles.typeRow}>
            <AppText variant="caption" color="textSecondary" style={styles.typeName}>
              {variant}
            </AppText>
            <AppText variant={variant} style={styles.typeSample} numberOfLines={1}>
              {variant.startsWith('price') ? 'R$ 1.249,90' : 'Compre e siga em frente'}
            </AppText>
          </View>
        ))}
      </Section>

      <Section title="Botões">
        <Button title="Adicionar ao carrinho" icon="bag" />
        <Button title="Comprar agora" variant="secondary" />
        <Button title="Ver detalhes" variant="outline" />
        <Button title="Continuar comprando" variant="ghost" />
        <View style={styles.row}>
          <Button title="Médio" size="md" fullWidth={false} />
          <Button title="Carregando" size="md" fullWidth={false} loading />
          <Button title="Indisponível" size="md" fullWidth={false} disabled />
        </View>
      </Section>

      <Section title="Ícones">
        <View style={styles.wrap}>
          {ICON_NAMES.map((name) => (
            <View key={name} style={styles.iconCell}>
              <Icon name={name} size={24} />
              <AppText
                variant="caption"
                color="textSecondary"
                numberOfLines={1}
                style={styles.iconName}
              >
                {name}
              </AppText>
            </View>
          ))}
        </View>
        <View style={styles.row}>
          <IconButton icon="bag" accessibilityLabel="Abrir carrinho" badgeCount={3} />
          <IconButton
            icon="heart"
            accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            filled={favorite}
            onPress={() => setFavorite((value) => !value)}
          />
          <IconButton icon="search" accessibilityLabel="Buscar" variant="filled" />
        </View>
      </Section>

      <Section title="Rota (elemento da marca)">
        <AppText variant="caption" color="textSecondary">
          Horizontal: categorias como paradas. Toque para trocar.
        </AppText>
        <RouteLine stops={CATEGORY_STOPS} activeIndex={category} onSelect={setCategory} />
        <AppText variant="caption" color="textSecondary">
          Vertical: progresso real do pedido.
        </AppText>
        <RouteLine stops={ORDER_STOPS} activeIndex={2} orientation="vertical" />
      </Section>

      <Section title="Chips e selos">
        <View style={styles.row}>
          <Chip
            label="Relevância"
            selected={chip === 'relevancia'}
            onPress={() => setChip('relevancia')}
          />
          <Chip label="Menor preço" selected={chip === 'preco'} onPress={() => setChip('preco')} />
          <Chip label="Filtros" icon="filter" />
        </View>
        <View style={styles.row}>
          <Badge label="-18%" tone="signal" />
          <Badge label="Novo" tone="brand" />
          <Badge label="Entregue" tone="success" />
          <Badge label="Atrasado" tone="warning" />
          <Badge label="Cancelado" tone="danger" />
          <Badge label="4,6 de 5" tone="neutral" />
        </View>
      </Section>

      <Section title="Campos">
        <Input
          label="E-mail"
          placeholder="voce@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Senha"
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
          error="A senha precisa ter pelo menos 6 caracteres."
        />
      </Section>

      <Section title="Carregamento">
        <View style={styles.row}>
          <View style={styles.skeletonCard}>
            <Skeleton height={120} />
            <Skeleton height={14} width="80%" rounded="xs" />
            <Skeleton height={18} width="45%" rounded="xs" />
          </View>
          <View style={styles.skeletonCard}>
            <Skeleton height={120} />
            <Skeleton height={14} width="70%" rounded="xs" />
            <Skeleton height={18} width="40%" rounded="xs" />
          </View>
        </View>
      </Section>

      <Section title="Estados">
        <View style={styles.stateBox}>
          <EmptyState
            icon="heart"
            title="Nenhum favorito ainda"
            message="Toque no coração de um produto para guardar aqui."
            actionLabel="Explorar categorias"
            onAction={() => {}}
          />
        </View>
        <View style={styles.stateBox}>
          <ErrorState message="Não foi possível carregar os produtos." onRetry={() => {}} />
        </View>
        <Snackbar message="Adicionado ao carrinho" actionLabel="Ver carrinho" onAction={() => {}} />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, gap: spacing.md },
  section: {
    gap: spacing.ms,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.ms },
  markBox: {
    width: 88,
    height: 88,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: { width: 76, gap: 2 },
  swatchColor: {
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  typeRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  typeName: { width: 84 },
  typeSample: { flex: 1 },
  iconCell: { width: 64, alignItems: 'center', gap: spacing.xs },
  iconName: { fontSize: 10 },
  skeletonCard: { flex: 1, gap: spacing.sm },
  stateBox: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
});
