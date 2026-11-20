/**
 * Textos da interface em português (pt-BR), centralizados.
 * Todo texto visível ao usuário deve vir daqui — não escreva strings soltas nas telas.
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
    soon: 'Em breve',
  },
  auth: {
    loginTitle: 'Faça login aqui',
    loginSubtitle: 'Bem-vindo de volta, sentimos sua falta!',
    loginButton: 'Entrar',
    forgotPassword: 'Esqueceu sua senha?',
    createNewAccount: 'Criar nova conta',
    registerTitle: 'Criar conta',
    registerSubtitle: 'Crie uma conta para explorar tudo!',
    registerButton: 'Cadastrar',
    alreadyHaveAccount: 'Já tenho uma conta',
    orContinueWith: 'Ou continue com',
    namePlaceholder: 'Nome completo',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Senha',
    confirmPasswordPlaceholder: 'Confirmar senha',
    passwordsDoNotMatch: 'As senhas não coincidem',
    socialUnavailable: 'Login social será habilitado em breve.',
    forgotPasswordUnavailable: 'Recuperação de senha será habilitada em breve.',
    logout: 'Sair da conta',
    welcomeAuthenticated: 'Você está conectado!',
  },
  errors: {
    generic: 'Algo deu errado. Tente novamente.',
    network: 'Sem conexão com o servidor.',
    invalidCredentials: 'E-mail ou senha inválidos.',
    emailInUse: 'Este e-mail já está em uso.',
    weakPassword: 'A senha deve ter pelo menos 6 caracteres.',
    invalidEmail: 'E-mail inválido.',
    tooManyRequests: 'Muitas tentativas. Aguarde um momento e tente novamente.',
  },
} as const;
