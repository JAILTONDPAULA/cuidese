# Stores globais

Estados globais do app (zustand) que não pertencem a um componente específico. Stores de componentes globais, como o Toast, o Dialog e o Preload, ficam na pasta do próprio componente.

## sessaoStore

Sessão do usuário logado: o token Sanctum (bearer) e os dados do usuário.

```js
import { sessao, useSessaoStore } from '@/stores/sessaoStore'
```

### Onde fica salvo

O store usa o `persist` do zustand com o **`@capacitor/preferences`**, que tem uma API só e grava no armazenamento nativo de cada plataforma:

| Plataforma | Armazenamento |
|---|---|
| Web | `localStorage` |
| Android | `SharedPreferences` |
| iOS | `UserDefaults` (o sistema não apaga quando falta espaço, ao contrário do localStorage do WebView) |

A chave é `cuidese-sessao`. Ao reabrir o app, a sessão volta sozinha.

Para guardar o token **criptografado** no celular (Keychain no iOS, Keystore no Android), troque só o objeto `armazenamento` no topo do arquivo por um plugin de armazenamento seguro. Antes, confira se ele é compatível com o Capacitor 8.

### Estado

| Campo | Descrição |
|---|---|
| `token` | Token bearer, ou `null` sem sessão |
| `usuario` | Dados do usuário (o `usuario` devolvido pelo `POST /login`), ou `null` |
| `carregada` | `true` depois que a sessão salva foi lida do armazenamento. **Antes disso, `token` é `null` mesmo com sessão salva**, porque a leitura é assíncrona. Esse campo não é salvo |

### Uso

**Em componentes**, use o hook, para que a tela re-renderize no login e no logout:

```jsx
const usuario = useSessaoStore((s) => s.usuario)
const logado = useSessaoStore((s) => s.carregada && Boolean(s.token))
```

**Fora de componentes** (helpers, classes de API), use o objeto `sessao`:

| Método | Descrição |
|---|---|
| `sessao.token()` | Token atual, ou `null` |
| `sessao.usuario()` | Usuário atual, ou `null` |
| `sessao.logado()` | `true` se há token |
| `sessao.entrar(token, usuario)` | Guarda a sessão (depois do login) |
| `sessao.sair()` | Apaga a sessão **do aparelho** |

### Como a sessão é usada no app

- **Login** (`/login`): chama `AutenticacaoApi.login`. Em caso de sucesso, faz `sessao.entrar(token, usuario)` e volta para a tela que pediu o login.
- **FetchHelper**: envia `Authorization: Bearer <token>` em toda requisição para a **nossa API** (URL relativa), nunca para URLs externas. As classes de API não mexem no token.
- **401 com token** (sessão expirada ou revogada): o FetchHelper mostra o toast da API e faz `sessao.sair()`.
- **`RotaProtegida`** (`src/routes/RotaProtegida.jsx`): envolve as telas que exigem login. Sem sessão, leva ao `/login`. Enquanto a sessão não termina de carregar, não renderiza nada, e o preload continua na tela.
- **Sair** (Header): `AutenticacaoApi.logout()` revoga o token na API e, em seguida, `sessao.sair()` apaga a sessão do aparelho, mesmo se a API falhar.

### Cuidados

- `sessao.sair()` sozinho **não revoga** o token na API. Para sair de verdade, chame `AutenticacaoApi.logout()` antes, como faz o Header.
- **Não guarde senha** no store. Só o token e os dados públicos do usuário.

### Testar pelo console

Em desenvolvimento, fica disponível em `window.sessao`: `sessao.usuario()`, `sessao.logado()`, `sessao.sair()`.
