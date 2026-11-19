/**
 * Textos da interface em português (pt-BR), centralizados.
 * Todo texto visível ao usuário deve vir daqui — não escreva strings soltas nas telas.
 * Os textos abaixo são só a base; cada tela adiciona os seus na Etapa 02.
 */
export const strings = {
  app: {
    name: 'ShopGo',
    tagline: 'Compre e venda com facilidade, a qualquer hora e em qualquer lugar.',
  },
  common: {
    getStarted: 'Começar',
    next: 'Próximo',
    back: 'Voltar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    loading: 'Carregando...',
    tryAgain: 'Tentar novamente',
  },
  errors: {
    generic: 'Algo deu errado. Tente novamente.',
    network: 'Sem conexão com o servidor.',
  },
} as const;
