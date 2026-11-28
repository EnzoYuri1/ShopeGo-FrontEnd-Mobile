# ShopGo Mobile

Aplicativo mobile de marketplace construído com **React Native**, **Expo (SDK 58)**, **Expo Router** e **Firebase (Plano Spark)** seguindo a **Feature-Based Architecture**.

---

## Download do APK (Android)

Baixe a versão mais recente do aplicativo diretamente na página de Releases:

- [Download do APK (GitHub Releases)](https://github.com/EnzoYuri1/ShopeGo-FrontEnd-Mobile/releases/latest)

Após instalar o APK uma única vez no celular, novas atualizações de telas e código JS/TS são recebidas automaticamente via **EAS Update (OTA)** ao fechar e reabrir o aplicativo.

---

## Stack Tecnológica

- **Framework:** React Native + Expo + Expo Router (roteamento baseado em arquivos em `app/`)
- **Linguagem:** TypeScript (`strict: true`, alias `@/*` mapeado para `src/*`)
- **Backend as a Service (BaaS):** Firebase (`firebase/app`, `firebase/auth`, `firebase/firestore`, `firebase/storage`) com persistência de sessão via `@react-native-async-storage/async-storage`
- **Catálogo de Produtos:** API REST (DummyJSON por padrão, configurável via `EXPO_PUBLIC_PRODUCTS_SOURCE` entre `api`, `firestore` ou `mock`)
- **Estado Remoto e Cache:** TanStack Query (`@tanstack/react-query`)
- **Estado Local e UI:** Zustand (`src/store/`: carrinho, favoritos e feedback global)
- **Validação e Schemas:** Zod

---

## Pré-requisitos

- **Node.js** >= 22.13
- **npm**
- Aplicativo **Expo Go** no celular (ou emulador Android/iOS)

---

## Instruções de Execução

1. **Instale as dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente:**

Copie o arquivo de exemplo e preencha com as credenciais do projeto Firebase:

```bash
cp .env.example .env
```

Variáveis esperadas no `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...

EXPO_PUBLIC_USE_MOCKS=true
EXPO_PUBLIC_API_URL=https://dummyjson.com
EXPO_PUBLIC_USD_TO_BRL=5.5
EXPO_PUBLIC_PRODUCTS_SOURCE=api
```

> Com `EXPO_PUBLIC_USE_MOCKS=true`, pedidos e perfil utilizam `src/mocks/` como fallback local. A origem dos produtos é controlada por `EXPO_PUBLIC_PRODUCTS_SOURCE` (`api`, `firestore` ou `mock`).

3. **Inicie o servidor de desenvolvimento:**

```bash
npx expo start
```

Escaneie o QR Code com o Expo Go (celular e computador na mesma rede Wi-Fi) ou use:

```bash
npx expo start --tunnel   # quando estiver em redes diferentes
npm run web               # abre no navegador
npm run android           # abre no emulador Android
npm run ios               # abre no simulador iOS
```

4. **Verificações de qualidade:**

```bash
npm run typecheck         # verificação estrita de tipos (tsc --noEmit)
npm run lint              # análise estática (expo lint)
npm run format            # formatação com Prettier
```

---

## CI/CD e Atualizações OTA

O projeto conta com pipeline automatizada em `.github/workflows/ci-cd.yml` (GitHub Actions) integrada ao **Expo EAS Update**:

- **CI (Pull Requests e push na `main`):** executa `npm ci`, `npm run typecheck` e `npm run lint`.
- **CD (push/merge na `main` ou disparo manual):** publica automaticamente uma atualização OTA no canal `preview` (`eas update --branch preview --environment preview`), atualizando o APK já instalado nos celulares sem necessidade de novo build.
- **Requisito no repositório:** secret `EXPO_TOKEN` configurado em *Settings -> Secrets and variables -> Actions* (as variáveis `EXPO_PUBLIC_*` ficam gerenciadas no ambiente `preview` do EAS).

---

## Fluxo do Aplicativo

```mermaid
flowchart TD
    Start["Abertura do App (app/_layout.tsx)"] --> Providers["ErrorBoundary + QueryClientProvider + AuthProvider"]
    Providers --> Entry["app/index.tsx"]
    Entry --> Loading{"isLoading ou onboarding?"}
    Loading -- "Sim" --> Spinner["ActivityIndicator"]
    Loading -- "Não" --> AuthCheck{"isAuthenticated?"}

    AuthCheck -- "Não" --> OnboardingCheck{"Viu onboarding?"}
    OnboardingCheck -- "Não" --> Onboarding["app/onboarding.tsx -> app/discover.tsx"]
    OnboardingCheck -- "Sim" --> AuthGroup["app/(auth)/"]
    Onboarding --> AuthGroup
    AuthGroup --> Login["login / register / forgot-password"]
    Login --> FirebaseAuth["Firebase Auth + AsyncStorage"]
    FirebaseAuth -- "Sessão ativa" --> MainApp

    AuthCheck -- "Sim" --> MainApp["app/(drawer)/(tabs)/"]
    MainApp --> Home["Início (HomeScreen + carregamento progressivo)"]
    MainApp --> Categories["Categorias -> category/[slug]"]
    MainApp --> Search["Buscar -> product/[id]"]
    MainApp --> Cart["Carrinho -> checkout/payment -> checkout/success"]
    MainApp --> Profile["Perfil -> orders -> tracking/[id] / favorites / offers"]
```

---

## Arquitetura (Feature-Based)

A comunicação externa é isolada na camada `services/` de cada feature, consumida pelas telas via `hooks/` (TanStack Query ou Zustand) e validada com schemas **Zod** em `types/`. Erros de renderização são capturados globalmente pelo `ErrorBoundary` e avisos globais são exibidos pelo `FeedbackHost`.

```mermaid
flowchart LR
    Routes["app/ (Expo Router)"] --> Features["src/features/<dominio>/"]
    Routes --> UI["src/components/ui/ e layout/"]

    subgraph Feature ["Estrutura Interna de cada Feature"]
        Components["components/ (UI do domínio)"]
        Hooks["hooks/ (TanStack Query / Store)"]
        Services["services/ (Firebase / API REST)"]
        Types["types/ (Zod schemas e interfaces)"]
        Components --> Hooks
        Hooks --> Services
        Services --> Types
    end

    Features --> Feature
    Services --> Firebase["src/services/firebase.ts (app, auth, db, storage)"]
    Services --> ApiClient["src/services/api/client.ts (HTTP)"]
    Hooks --> Store["src/store/ (Cart, Favorites, Feedback)"]
    Firebase --> Cloud["Firebase Spark (Auth, Firestore, Storage)"]
    Cloud --> Rules["firestore.rules (Controle de acesso por uid)"]
```

### Estrutura de Pastas

```text
ShopeGo-FrontEnd-Mobile/
├── .github/workflows/
│   └── ci-cd.yml                 # Pipeline de CI (typecheck/lint) e CD (EAS Update OTA)
├── app/                          # Rotas Expo Router (arquivos finos de navegação)
│   ├── (auth)/                   # Fluxo público: login, cadastro e recuperação de senha
│   ├── (drawer)/(tabs)/          # Navegação principal (Início, Categorias, Buscar, Carrinho, Conta)
│   ├── category/[slug].tsx       # Produtos por categoria e ofertas
│   ├── checkout/                 # Pagamento e confirmação de pedido
│   ├── product/[id].tsx          # Detalhes do produto
│   ├── tracking/[id].tsx         # Rastreamento do pedido
│   ├── _layout.tsx               # ErrorBoundary, QueryClientProvider, AuthProvider e FeedbackHost
│   └── index.tsx                 # Redirecionamento inicial (onboarding, auth ou área principal)
├── src/
│   ├── components/               # Componentes globais reutilizáveis (ui/ e layout/)
│   ├── constants/                # Design tokens, cores, espaçamentos, strings e config
│   ├── features/                 # Módulos isolados por domínio (auth, cart, categories, checkout,
│   │                             # design-system, favorites, offers, onboarding, orders, products, profile)
│   ├── hooks/                    # Hooks genéricos globais (atualização OTA, largura de tela)
│   ├── mocks/                    # Dados fictícios para fallback local
│   ├── services/                 # Singleton do Firebase (firebase.ts) e cliente HTTP (api/client.ts)
│   ├── store/                    # Estado global local com Zustand (cart, favorites, feedback)
│   ├── types/                    # Tipagens globais compartilhadas
│   └── utils/                    # Funções utilitárias puras (preço, templates, compressão de imagem)
├── .env.example                  # Modelo das variáveis EXPO_PUBLIC_*
├── eas.json                      # Perfis do EAS Build e canais do EAS Update
└── firestore.rules               # Regras de segurança do Cloud Firestore
```
