import { Capacitor } from '@capacitor/core'

// Client ID do tipo "Aplicativo da Web" (Google Cloud Console). Público: vai para o navegador.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

// Se o botão aparece: precisa do Client ID e só funciona na web (no app, o Google bloqueia WebView)
export const GOOGLE_LOGIN_DISPONIVEL = Boolean(GOOGLE_CLIENT_ID) && !Capacitor.isNativePlatform()
