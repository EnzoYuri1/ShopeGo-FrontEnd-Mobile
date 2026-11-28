import { RouteLine } from '@/components/ui';
import { strings } from '@/constants';

const STOPS = [
  { key: 'cart', label: strings.checkout.stepCart },
  { key: 'payment', label: strings.checkout.stepPayment },
  { key: 'done', label: strings.checkout.stepDone },
];

// etapas da compra (carrinho, pagamento, confirmação) na linha de rota da marca
export function CheckoutSteps({ step }: { step: 0 | 1 | 2 }) {
  return <RouteLine stops={STOPS} activeIndex={step} progress />;
}
