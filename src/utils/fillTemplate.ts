/** Preenche um texto de `strings` com valores: fillTemplate('{n} produtos', { n: 3 }) -> "3 produtos". */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
