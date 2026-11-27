import { strings } from '@/constants';
import type { OrderStatus } from '@/features/orders/types/order';

// etapas da linha do tempo de entrega, na ordem
export const TRACKING_STEPS = [
  { title: strings.tracking.stepConfirmed, subtitle: strings.tracking.stepConfirmedSub },
  { title: strings.tracking.stepPreparing, subtitle: strings.tracking.stepPreparingSub },
  { title: strings.tracking.stepTransit, subtitle: strings.tracking.stepTransitSub },
  { title: strings.tracking.stepDelivered, subtitle: strings.tracking.stepDeliveredSub },
] as const;

// índice da etapa atual por status
export function getCurrentStep(status: OrderStatus): number {
  switch (status) {
    case 'pending':
      return 0;
    case 'confirmed':
      return 1;
    case 'shipped':
      return 2;
    case 'delivered':
      return TRACKING_STEPS.length;
    case 'cancelled':
      return -1;
  }
}

export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return strings.tracking.badgePending;
    case 'confirmed':
      return strings.tracking.badgeConfirmed;
    case 'shipped':
      return strings.tracking.badgeInTransit;
    case 'delivered':
      return strings.tracking.badgeDelivered;
    case 'cancelled':
      return strings.tracking.badgeCancelled;
  }
}

export function formatDate(iso?: string, addDays = 0): string {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  date.setDate(date.getDate() + addDays);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

// cor do selo de status (tons do badge da marca)
export function getStatusTone(
  status: OrderStatus,
): 'warning' | 'neutral' | 'signal' | 'success' | 'danger' {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'neutral';
    case 'shipped':
      return 'signal';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'danger';
  }
}

// forma de pagamento salva no pedido ("card:visa", "other") em texto para o usuário
export function getPaymentLabel(method: string): string {
  if (method.startsWith('card:')) {
    const brand = method.slice('card:'.length);
    const name =
      brand === 'visa'
        ? strings.checkout.visa
        : brand === 'mastercard'
          ? strings.checkout.mastercard
          : brand;
    return strings.tracking.methodCard.replace('{brand}', name);
  }
  return strings.tracking.methodOther;
}
