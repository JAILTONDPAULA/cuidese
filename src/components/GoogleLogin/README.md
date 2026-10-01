# GoogleLogin

Botão oficial "Fazer login com o Google", do **Google Identity Services**. Quando a pessoa conclui o login, o componente entrega o **ID token**: um JWT assinado pelo Google, com o nome, o e-mail e a foto. Esse token deve ser enviado à API, que o valida e devolve a sessão.

## Uso

```jsx
import GoogleLogin from '@/components/GoogleLogin/GoogleLogin'
import { GOOGLE_LOGIN_DISPONIVEL } from '@/components/GoogleLogin/googleConfig'

{GOOGLE_LOGIN_DISPONIVEL && (
	<GoogleLogin onCredencial={(idToken) => AutenticacaoApi.loginGoogle(idToken).then(...)} />
)}
```

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `onCredencial` | `(idToken: string) => void` | — | Chamado com o ID token depois que a pessoa escolhe a conta |
| `texto` | `'signin_with'` \| `'signup_with'` \| `'continue_with'` | `'signin_with'` | Texto do botão: "Fazer login com o Google", "Inscrever-se com o Google" ou "Continuar com o Google" |

`GOOGLE_LOGIN_DISPONIVEL`, exportada de `googleConfig.js`, indica se o botão vai aparecer. Use para esconder o que estiver em volta dele, como o divisor "ou acesse com sua conta Google".

## Configuração

O componente precisa do **Client ID** no `.env`:

```
VITE_GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
```

- O Client ID é público, porque vai para o navegador. **O Client secret nunca vai no frontend.**
- Sem o Client ID, o componente não renderiza nada e avisa no console em desenvolvimento.
- Depois de mudar o `.env`, reinicie o `npm run dev`.

Veja como gerar o Client ID na seção "Gerando a credencial no Google".

## Comportamento

- O script do Google (`accounts.google.com/gsi/client`) é carregado só quando o botão aparece, e uma vez só.
- O login abre num **popup** (`ux_mode: 'popup'`), e a pessoa não sai da tela.
- O botão é desenhado pelo Google, em pt-BR, com tema contorno e largura igual à do container (máximo de 400px, limite do Google). Não dá para estilizar o botão por dentro: as regras de marca do Google exigem o botão oficial.
- **Só funciona na web.** Dentro do app (APK ou iOS), o Google **bloqueia login em WebView**, então o componente não aparece. No celular, será usado um plugin nativo, numa etapa futura.

## Gerando a credencial no Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e crie um projeto, por exemplo "Cuidese".
2. Vá em **APIs e serviços → Tela de permissão OAuth** (ou **Google Auth Platform → Branding**) e configure:
	- tipo de usuário: **Externo**;
	- nome do app, e-mail de suporte e logo (opcional);
	- escopos: `openid`, `email` e `profile`, que são os padrões e não exigem verificação do Google;
	- enquanto o app estiver em **teste**, só os e-mails adicionados em "Usuários de teste" conseguem entrar.
3. Vá em **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth**:
	- tipo: **Aplicativo da Web**;
	- **Origens JavaScript autorizadas**: `http://localhost`, `http://localhost:5173` e, depois, o domínio de produção (ex.: `https://app.cuidese.com.br`);
	- **URIs de redirecionamento**: pode deixar em branco, porque o modo popup não usa.
4. Copie o **ID do cliente** para o `VITE_GOOGLE_CLIENT_ID`. O mesmo ID vai para o Laravel, que confere se o token foi emitido para o nosso app.

Para Android e iOS, serão criados outros IDs de cliente, um de cada tipo, na etapa do plugin nativo.
