/** Formata um valor em reais: 59.9 -> "R$ 59,90". */
export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}
