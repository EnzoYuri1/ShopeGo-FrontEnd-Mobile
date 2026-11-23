# ShopGo — Guia de continuidade (HANDOFF)

## 1. Projeto
- **ShopGo**: app mobile de marketplace (projeto acadêmico), **somente Frontend**. O backend é feito por outro integrante.
- **Stack**: React Native + Expo (SDK 58) + TypeScript (strict) + Expo Router.
- **Meta**: seguir fielmente o protótipo do Figma. Prints de referência em [`docs/design-refs/`](./design-refs).
- **Idioma da interface**: português (pt-BR). Vários textos do Figma ainda estão em inglês e devem ser traduzidos.

## 2. Como rodar
Requisitos: **Node >= 22.13** (testado com 26.7) e npm.

```bash
git clone https://github.com/EnzoYuri1/ShopeGo-FrontEnd-Mobile.git shopgo
cd shopgo
npm install
cp .env.example .env     # Windows (PowerShell): Copy-Item .env.example .env
npm run web              # abre no navegador (http://localhost:8081)
# ou: npx expo start     # e escanear o QR com o Expo Go no celular
```

Scripts úteis: `npm run typecheck` · `npm run lint` · `npm run format`.
Antes de commitar, rode `typecheck` e `lint`. Instale pacotes sempre com `npx expo install <pacote>`.

## 3. Arquitetura
```
app/                 Rotas (Expo Router) — arquivos finos, só navegação
  (auth)/  (drawer)/  product/  checkout/  tracking/     (ainda vazias)
src/
  components/ui|layout   Componentes reutilizáveis, sem regra de negócio
  features/              auth, products, cart, profile, orders (uma pasta por funcionalidade)
  services/              Única camada que fala com o backend (api/client.ts + *.service.ts)
  hooks/  utils/         Hooks e utilitários genéricos
  constants/             colors, spacing, typography, strings (pt-BR), config
  types/                 Product, User, ApiError, Paginated
  mocks/                 Dados FICTÍCIOS (nunca dados reais)
assets/                  images, icons, fonts
example/                 Arquivos do template original (ignorado pelo Git; pode apagar)
```
Alias de import: `@/*` → `src/*` (ex.: `import { colors } from '@/constants'`).

## 4. Decisões já tomadas
- Rotas em **`app/` na raiz** (o template usa `src/app/`; seguimos o padrão pedido).
- **Navegação por Drawer** (menu lateral), não tabs → dependência `@react-navigation/drawer`.
- **Textos centralizados** em `src/constants/strings.ts` (sem biblioteca de i18n).
- **HTTP com `fetch` nativo** (`src/services/api/client.ts`), sem axios.
- **Mocks**: `EXPO_PUBLIC_USE_MOCKS=true` (padrão) faz os services devolverem `src/mocks`. Com `false`, chamam a API em `EXPO_PUBLIC_API_URL`.
- Cada produto tem `cardColor` (cor pastel do card no Figma).
- **Dados reais são proibidos**: o perfil do protótipo traz nome/cidade que parecem reais → usar pessoa fictícia nos mocks.
- `.env` está no `.gitignore` (só `.env.example` é versionado).
- Cores e tipografia atuais são **PROVISÓRIAS** (estimadas dos prints) — validar com o Figma.

## 5. Telas do protótipo (≈ 22)
| Grupo | Telas | Idioma no Figma |
|---|---|---|
| Entrada | Welcome, Onboarding (3 slides), "Descubra seus itens" | slides em PT; botão "Next" em EN |
| Autenticação | Login, Create account, Forgot Password, Set New Password, Verification (OTP 6 dígitos) | Login em PT; demais em **EN** |
| Compra | Home, Busca, Detalhe do produto (2 variações), Confirm Order, Método de pagamento, Payment Details, Pagamento aprovado | **EN** |
| Menu e conta | Ofertas, Favoritos, Perfil, Drawer (4 variações) | **EN** |
| Pedido | Acompanhar pedido (timeline) | já em PT |

Índice dos prints em `docs/design-refs/`: `01`–`04` logos/welcome/drawer antigos · `05`–`09` entrada e onboarding · `10`–`14` autenticação · `15`–`17` home e busca · `18`–`19` produto · `20`–`23` checkout · `24`–`26` ofertas, favoritos, perfil · `27`–`29` variações de drawer · `30` rastreio.

## 6. Pendências (preciso de resposta)
1. **Link do Figma** → extrair cores, fonte e medidas exatas e exportar ilustrações/ícones em boa resolução.
2. **Qual drawer é o final?** (prints 27, 28, 29 e 03). Suposição: o **colorido (28)**, que tem "Meus Pedidos".
3. **Usar só "ShopGo"?** Prints antigos ainda mostram "ShopEase" (01, 03, 04). Suposição: só ShopGo.
4. **Rastreio de pedido (30) está no escopo?** Suposição: sim.
5. **Fonte do protótipo.** Títulos parecem Poppins; botões "Get Started/Next" parecem serifada itálica (a confirmar).

## 7. Próximo passo — Etapa 02
Construir as telas uma a uma, começando por **Welcome → Onboarding → Descubra seus itens**, depois autenticação, e assim por diante.
Para cada tela: criar o componente em `src/features/<feature>/`, a rota fina em `app/`, textos em `strings.ts`, e reutilizar `src/components/ui`.
Não implementar backend; manter tudo tipado e sem duplicação.

## 8. Convenção de commits
Formato `tipo: descrição` (minúsculo, em português):
- `feat`: funcionalidade (implementação)
- `fix`: conserto
- `refactor`: refatoração
- `docs`: documentação
- `style`: estilização
- `hotfix`: implementação, melhoria ou conserto urgente

