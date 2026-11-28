// preenche um texto de `strings` com valores: filltemplate('{n} produtos', { n: 3 }) -> "3 produtos"
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
